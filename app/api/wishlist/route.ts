import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProductsByIds } from "@/lib/catalog";
import type { Product } from "@/app/types";

export async function GET() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) {
    return NextResponse.json({ products: [] satisfies Product[] });
  }

  const { data: rows, error } = await supabase.from("wishlists").select("product_id");
  if (error || !rows || rows.length === 0) {
    return NextResponse.json({ products: [] satisfies Product[] });
  }

  const products = await getProductsByIds(rows.map((r) => r.product_id));
  return NextResponse.json({ products });
}
