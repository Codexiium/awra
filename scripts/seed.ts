// One-off local seed script. Run with: bun run scripts/seed.ts
// Uses SUPABASE_SECRET_KEY (bypasses RLS) — never import this file from app code.
import { createClient } from "@supabase/supabase-js";
import { mockProducts } from "../app/data/mockProducts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!url || !secretKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY must be set (see .env.local)");
}

const supabase = createClient(url, secretKey);

async function main() {
  console.log(`Seeding ${mockProducts.length} products...`);
  for (const p of mockProducts) {
    const { data: productRow, error: prodErr } = await supabase
      .from("products")
      .insert({
        slug: p.slug,
        name: p.name,
        price: p.price,
        compare_at_price: p.compareAtPrice ?? null,
        description: p.description,
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

    // A product has only sizes now (no color variants) — one row per size,
    // with a synthetic stock_qty so checkout stock-decrement has something
    // real to work against.
    const variantRows = p.sizes.map((s) => ({
      product_id: productRow!.id,
      size: s.size,
      available: s.available,
      stock_qty: s.available ? 50 : 0
    }));
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
