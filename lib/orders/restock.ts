import type { SupabaseClient } from "@supabase/supabase-js";

// Shared by every path that can transition an order into "cancelled"
// (admin status changes, admin quick-cancel, and customer self-cancel) so
// the restock logic — and its atomic increment_stock() call, which avoids
// the same read-modify-write race place_order()'s stock decrement guards
// against — lives in exactly one place.
export async function restockOrderItems(admin: SupabaseClient, orderId: number): Promise<void> {
  const { data: items, error: itemsError } = await admin
    .from("order_items")
    .select("product_id, size, qty")
    .eq("order_id", orderId);
  if (itemsError) {
    console.error("restockOrderItems read error", itemsError);
    return;
  }

  for (const item of items ?? []) {
    if (item.product_id == null) continue;
    const { error } = await admin.rpc("increment_stock", {
      p_product_id: item.product_id,
      p_size: item.size,
      p_qty: item.qty
    });
    if (error) console.error("restockOrderItems increment error", error);
  }
}
