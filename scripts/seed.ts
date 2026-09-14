// One-off local seed script. Run with: bun run scripts/seed.ts
// Uses SUPABASE_SECRET_KEY (bypasses RLS) — never import this file from app code.
import { createClient } from "@supabase/supabase-js";
import { mockProducts, mockCollections, mockCategories } from "../app/data/mockProducts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!url || !secretKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY must be set (see .env.local)");
}

const supabase = createClient(url, secretKey);

function slugifyCategory(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

async function main() {
  console.log("Seeding categories...");
  const categoryRows = mockCategories.map((c, i) => ({
    slug: c.slug,
    name: c.name,
    sort_order: i
  }));
  const { data: categories, error: catErr } = await supabase
    .from("categories")
    .insert(categoryRows)
    .select("id, slug");
  if (catErr) throw catErr;
  const categoryBySlug = new Map(categories!.map((c) => [c.slug, c.id]));

  console.log("Seeding collections...");
  const collectionRows = mockCollections.map((c, i) => ({
    slug: c.slug,
    title: c.title,
    subtitle: c.subtitle,
    description: c.description,
    sort_order: i
  }));
  const { data: collections, error: colErr } = await supabase
    .from("collections")
    .insert(collectionRows)
    .select("id, slug");
  if (colErr) throw colErr;
  const collectionBySlug = new Map(collections!.map((c) => [c.slug, c.id]));

  console.log(`Seeding ${mockProducts.length} products...`);
  for (const p of mockProducts) {
    const categorySlug = slugifyCategory(p.category);
    const collectionSlug = p.collection.toLowerCase().replace(/\s+/g, "-");
    const categoryId = categoryBySlug.get(categorySlug);
    if (!categoryId) throw new Error(`No category row for slug "${categorySlug}" (product ${p.slug})`);
    const collectionId = collectionBySlug.get(collectionSlug); // optional FK, may be undefined

    const { data: productRow, error: prodErr } = await supabase
      .from("products")
      .insert({
        slug: p.slug,
        name: p.name,
        price: p.price,
        compare_at_price: p.compareAtPrice ?? null,
        description: p.description,
        category_id: categoryId,
        collection_id: collectionId ?? null,
        availability: p.availability,
        badges: p.badges,
        rating: p.rating,
        review_count: p.reviewCount,
        material: p.details.material,
        fit: p.details.fit,
        care: p.details.care
      })
      .select("id")
      .single();
    if (prodErr) throw prodErr;

    // Mock data models sizes and colors as independent facets (no per-combination
    // availability/stock). Seed the full size x color cross product, inheriting
    // `available` from the size entry and assigning a synthetic stock_qty so
    // checkout stock-decrement has something real to work against.
    const variantRows = p.sizes.flatMap((s) =>
      p.colors.map((c) => ({
        product_id: productRow!.id,
        size: s.size,
        color_name: c.name,
        color_hex: c.hex,
        available: s.available,
        stock_qty: s.available ? 25 : 0
      }))
    );
    if (variantRows.length > 0) {
      const { error: varErr } = await supabase.from("product_variants").insert(variantRows);
      if (varErr) throw varErr;
    }

    // product_images intentionally NOT seeded: every mock image src is null today
    // (ProductImage.tsx already renders its styled placeholder for null src), so
    // seeding fabricated URLs here would misrepresent real product photography.
  }

  console.log("Seeding promo codes (replaces hardcoded client-side codes)...");
  const { error: promoErr } = await supabase.from("promo_codes").insert([
    { code: "ARWA15", discount_percent: 15 },
    { code: "GOTHIC15", discount_percent: 15 },
    { code: "DARK20", discount_percent: 20 }
  ]);
  if (promoErr) throw promoErr;

  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
