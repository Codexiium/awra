import { createClient } from "./supabase/server";
import type { AspectRatio, Product } from "@/app/types";
import { getPublicImageUrl } from "@/lib/storage";

export { getPublicImageUrl };

const PRODUCT_SELECT = `
  id, slug, name, price, compare_at_price, description, availability, badges,
  rating, review_count, material, fit, care,
  product_images ( role, storage_path, alt, aspect_ratio, sort_order ),
  product_variants ( size, available )
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
  product_images: ProductImageRow[];
  product_variants: ProductVariantRow[];
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

  // One variant row per size (no color dimension) — still de-dupe defensively
  // in case a future seed/import produces duplicate size rows for a product.
  const sizeMap = new Map<string, boolean>();
  for (const v of row.product_variants) {
    sizeMap.set(v.size, (sizeMap.get(v.size) ?? false) || v.available);
  }

  return {
    id: String(row.id),
    slug: row.slug,
    name: row.name,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price != null ? Number(row.compare_at_price) : undefined,
    description: row.description,
    images: {
      primary: mapImage(primary),
      secondary: mapImage(secondary),
      gallery: gallery.map((g) => mapImage(g))
    },
    sizes: [...sizeMap.entries()].map(([size, available]) => ({ size, available })),
    availability: row.availability,
    badges: row.badges as Product["badges"],
    rating: Number(row.rating),
    reviewCount: row.review_count,
    details: { material: row.material, fit: row.fit, care: row.care }
  };
}

export interface ShopFilters {
  size?: string;
  sort?: "newest" | "price-low" | "price-high" | "best-selling" | "alphabetical";
  limit?: number;
}

export async function getProducts(filters: ShopFilters = {}): Promise<Product[]> {
  const supabase = await createClient();

  let query = supabase.from("products").select(PRODUCT_SELECT);

  // Size filter resolves matching product ids from product_variants first,
  // rather than an inner-joined embed, so the product_variants array returned
  // for display still contains every size for that product (not just the match).
  if (filters.size) {
    const { data: variantRows } = await supabase
      .from("product_variants")
      .select("product_id")
      .eq("size", filters.size)
      .eq("available", true);
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

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).eq("slug", slug).maybeSingle<ProductRow>();
  if (error) throw error;
  return data ? mapProductRow(data) : null;
}

export async function getRelatedProducts(excludeSlug: string, limit = 4): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
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

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .or(`name.ilike.${term},description.ilike.${term}`)
    .returns<ProductRow[]>();
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

export async function getDistinctSizes(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("product_variants").select("size");
  if (error) throw error;
  return [...new Set((data ?? []).map((v) => v.size))];
}
