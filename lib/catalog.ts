import { createClient } from "./supabase/server";
import type { AspectRatio, Product, ProductCategory, ProductCollection } from "@/app/types";

const PRODUCT_SELECT = `
  id, slug, name, price, compare_at_price, description, availability, badges,
  rating, review_count, material, fit, care,
  categories!inner ( name, slug ),
  collections ( title, slug ),
  product_images ( role, storage_path, alt, aspect_ratio, sort_order ),
  product_variants ( size, color_name, color_hex, available )
`;

interface ProductImageRow {
  role: string;
  storage_path: string;
  alt: string;
  aspect_ratio: string;
  sort_order: number;
}

interface ProductVariantRow {
  size: string;
  color_name: string;
  color_hex: string;
  available: boolean;
}

interface ProductRow {
  id: number;
  slug: string;
  name: string;
  price: number;
  compare_at_price: number | null;
  description: string;
  availability: "in_stock" | "low_stock" | "out_of_stock";
  badges: string[];
  rating: number;
  review_count: number;
  material: string;
  fit: string;
  care: string;
  categories: { name: string; slug: string } | null;
  collections: { title: string; slug: string } | null;
  product_images: ProductImageRow[];
  product_variants: ProductVariantRow[];
}

export function getPublicImageUrl(storagePath: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${storagePath}`;
}

function mapImage(img?: ProductImageRow) {
  return {
    src: img ? getPublicImageUrl(img.storage_path) : null,
    alt: img?.alt || "",
    aspectRatio: (img?.aspect_ratio || "4:5") as AspectRatio
  };
}

export function mapProductRow(row: ProductRow): Product {
  const primary = row.product_images.find((i) => i.role === "primary");
  const secondary = row.product_images.find((i) => i.role === "secondary");
  const gallery = row.product_images.filter((i) => i.role === "gallery").sort((a, b) => a.sort_order - b.sort_order);

  // Mock/seed data models sizes and colors as independent facets rather than
  // per-combination availability — collapse the variant rows back into that shape.
  const sizeMap = new Map<string, boolean>();
  const colorMap = new Map<string, string>();
  for (const v of row.product_variants) {
    sizeMap.set(v.size, (sizeMap.get(v.size) ?? false) || v.available);
    colorMap.set(v.color_name, v.color_hex);
  }

  return {
    id: String(row.id),
    slug: row.slug,
    name: row.name,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price != null ? Number(row.compare_at_price) : undefined,
    description: row.description,
    category: row.categories?.name ?? "",
    collection: row.collections?.title ?? "",
    images: {
      primary: mapImage(primary),
      secondary: mapImage(secondary),
      gallery: gallery.map((g) => mapImage(g))
    },
    sizes: [...sizeMap.entries()].map(([size, available]) => ({ size, available })),
    colors: [...colorMap.entries()].map(([name, hex]) => ({ name, hex })),
    availability: row.availability,
    badges: row.badges as Product["badges"],
    rating: Number(row.rating),
    reviewCount: row.review_count,
    details: { material: row.material, fit: row.fit, care: row.care }
  };
}

export interface ShopFilters {
  categorySlug?: string;
  collectionSlug?: string;
  size?: string;
  color?: string;
  sort?: "newest" | "price-low" | "price-high" | "best-selling" | "alphabetical";
  limit?: number;
}

export async function getProducts(filters: ShopFilters = {}): Promise<Product[]> {
  const supabase = await createClient();

  let query = supabase.from("products").select(PRODUCT_SELECT);

  if (filters.categorySlug) {
    query = query.eq("categories.slug", filters.categorySlug);
  }

  if (filters.collectionSlug) {
    const { data: collection } = await supabase
      .from("collections")
      .select("id")
      .eq("slug", filters.collectionSlug)
      .maybeSingle();
    if (!collection) return [];
    query = query.eq("collection_id", collection.id);
  }

  // Size/color filters resolve matching product ids from product_variants first,
  // rather than an inner-joined embed, so the product_variants array returned for
  // display still contains every size/color for that product (not just the match).
  if (filters.size || filters.color) {
    let variantQuery = supabase.from("product_variants").select("product_id");
    if (filters.size) variantQuery = variantQuery.eq("size", filters.size).eq("available", true);
    if (filters.color) variantQuery = variantQuery.eq("color_name", filters.color);
    const { data: variantRows } = await variantQuery;
    const ids = [...new Set((variantRows ?? []).map((r) => r.product_id as number))];
    if (ids.length === 0) return [];
    query = query.in("id", ids);
  }

  switch (filters.sort) {
    case "price-low":
      query = query.order("price", { ascending: true });
      break;
    case "price-high":
      query = query.order("price", { ascending: false });
      break;
    case "best-selling":
      query = query.order("review_count", { ascending: false });
      break;
    case "alphabetical":
      query = query.order("name", { ascending: true });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query.returns<ProductRow[]>();
  if (error) throw error;
  return (data ?? []).map(mapProductRow);
}

export async function getProductBySlug(slug: string): Promise<(Product & { categorySlug: string }) | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).eq("slug", slug).maybeSingle<ProductRow>();
  if (error) throw error;
  if (!data) return null;
  return { ...mapProductRow(data), categorySlug: data.categories?.slug ?? "" };
}

export async function getRelatedProducts(categorySlug: string, excludeSlug: string, limit = 4): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("categories.slug", categorySlug)
    .neq("slug", excludeSlug)
    .limit(limit)
    .returns<ProductRow[]>();
  if (error) throw error;
  return (data ?? []).map(mapProductRow);
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (!query.trim()) return [];
  const supabase = await createClient();
  const term = `%${query.trim()}%`;

  // PostgREST's or() combinator only filters the top-level resource's own columns,
  // not embedded-resource columns, so category/collection name matches are resolved
  // as separate id lookups rather than a single combined filter.
  const [{ data: directMatches }, { data: matchingCategories }, { data: matchingCollections }] = await Promise.all([
    supabase.from("products").select("id").or(`name.ilike.${term},description.ilike.${term}`),
    supabase.from("categories").select("id").ilike("name", term),
    supabase.from("collections").select("id").ilike("title", term)
  ]);

  const categoryIds = (matchingCategories ?? []).map((c) => c.id);
  const collectionIds = (matchingCollections ?? []).map((c) => c.id);

  const [categoryMatches, collectionMatches] = await Promise.all([
    categoryIds.length > 0
      ? supabase.from("products").select("id").in("category_id", categoryIds)
      : Promise.resolve({ data: [] as { id: number }[] }),
    collectionIds.length > 0
      ? supabase.from("products").select("id").in("collection_id", collectionIds)
      : Promise.resolve({ data: [] as { id: number }[] })
  ]);

  const ids = [
    ...new Set([
      ...(directMatches ?? []).map((p) => p.id as number),
      ...(categoryMatches.data ?? []).map((p) => p.id as number),
      ...(collectionMatches.data ?? []).map((p) => p.id as number)
    ])
  ];
  if (ids.length === 0) return [];

  const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).in("id", ids).returns<ProductRow[]>();
  if (error) throw error;
  return (data ?? []).map(mapProductRow);
}

export async function getProductsByIds(ids: number[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).in("id", ids).returns<ProductRow[]>();
  if (error) throw error;
  return (data ?? []).map(mapProductRow);
}

export async function getAllProductsForNav(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).returns<ProductRow[]>();
  if (error) throw error;
  return (data ?? []).map(mapProductRow);
}

export async function getCategories(): Promise<ProductCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("slug, name, products(count)")
    .order("sort_order");
  if (error) throw error;
  return (data ?? []).map((c) => ({
    slug: c.slug,
    name: c.name,
    count: (c.products as { count: number }[])?.[0]?.count ?? 0
  }));
}

export async function getCategoryBySlug(slug: string): Promise<ProductCategory | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("slug, name, products(count)")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return { slug: data.slug, name: data.name, count: (data.products as { count: number }[])?.[0]?.count ?? 0 };
}

export async function getCollections(): Promise<ProductCollection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("slug, title, subtitle, description, products(count)")
    .order("sort_order");
  if (error) throw error;
  return (data ?? []).map((c) => ({
    slug: c.slug,
    title: c.title,
    subtitle: c.subtitle,
    description: c.description,
    itemCount: (c.products as { count: number }[])?.[0]?.count ?? 0
  }));
}

export async function getCollectionBySlug(slug: string): Promise<ProductCollection | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("slug, title, subtitle, description, products(count)")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    slug: data.slug,
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    itemCount: (data.products as { count: number }[])?.[0]?.count ?? 0
  };
}

export async function getDistinctSizesAndColors(): Promise<{ sizes: string[]; colors: string[] }> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("product_variants").select("size, color_name");
  if (error) throw error;
  const sizes = [...new Set((data ?? []).map((v) => v.size))];
  const colors = [...new Set((data ?? []).map((v) => v.color_name))];
  return { sizes, colors };
}
