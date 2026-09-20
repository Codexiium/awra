import type { SupabaseClient } from "@supabase/supabase-js";

// Surfaces stock problems on the checkout page itself, before the customer
// submits — place_order() already re-validates this authoritatively at
// submit time (see supabase/migrations/20260919043808_*.sql), this is
// purely a better-UX early warning so a customer doesn't discover an item
// went out of stock only after clicking "place order".
export interface CartStockLine {
  productId: number;
  size: string;
  quantity: number;
  stockQty: number;
  available: boolean;
  ok: boolean;
}

export async function getCartStockStatus(supabase: SupabaseClient): Promise<CartStockLine[]> {
  const { data: cartRows } = await supabase.from("cart_items").select("product_id, size, quantity");
  if (!cartRows || cartRows.length === 0) return [];

  const productIds = [...new Set(cartRows.map((r) => r.product_id as number))];
  const { data: variants } = await supabase
    .from("product_variants")
    .select("product_id, size, stock_qty, available")
    .in("product_id", productIds);

  const variantMap = new Map((variants ?? []).map((v) => [`${v.product_id}::${v.size}`, v]));

  return cartRows.map((row) => {
    const variant = variantMap.get(`${row.product_id}::${row.size}`);
    const stockQty = variant?.stock_qty ?? 0;
    const available = variant?.available ?? false;
    return {
      productId: row.product_id as number,
      size: row.size as string,
      quantity: row.quantity as number,
      stockQty,
      available,
      ok: available && stockQty >= (row.quantity as number)
    };
  });
}
