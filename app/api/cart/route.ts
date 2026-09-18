import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProductsByIds } from "@/lib/catalog";
import type { CartItem } from "@/app/types";

// Returns the current authenticated user's server-persisted cart, mapped back
// into the app's CartItem shape (embedding the full Product, matching how the
// zustand cart store already models items) so the client can hydrate directly.
export async function GET() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) {
    return NextResponse.json({ items: [] satisfies CartItem[] });
  }

  const { data: rows, error } = await supabase.from("cart_items").select("product_id, size, quantity");
  if (error || !rows || rows.length === 0) {
    return NextResponse.json({ items: [] satisfies CartItem[] });
  }

  const products = await getProductsByIds(rows.map((r) => r.product_id));
  const productById = new Map(products.map((p) => [p.id, p]));

  const items: CartItem[] = rows
    .map((r) => {
      const product = productById.get(String(r.product_id));
      if (!product) return null;
      return { product, selectedSize: r.size, quantity: r.quantity };
    })
    .filter((item): item is CartItem => item !== null);

  return NextResponse.json({ items });
}
