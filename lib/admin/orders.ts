"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isOrderStatus } from "@/lib/orders/status";
import { sendShippingNotificationEmail } from "@/lib/email/send";

interface ShippingAddressSnapshot {
  email?: string;
}

export interface UpdateOrderStatusState {
  error: string | null;
  success: boolean;
}

export async function updateOrderStatus(
  _prevState: UpdateOrderStatusState,
  formData: FormData
): Promise<UpdateOrderStatusState> {
  await requireAdmin();

  const orderNumber = String(formData.get("orderNumber") || "").trim();
  const status = String(formData.get("status") || "").trim();
  const trackingCarrier = String(formData.get("trackingCarrier") || "").trim();
  const trackingNumber = String(formData.get("trackingNumber") || "").trim();
  const trackingUrl = String(formData.get("trackingUrl") || "").trim();

  if (!orderNumber || !isOrderStatus(status)) {
    return { error: "Invalid order or status.", success: false };
  }
  if (status === "shipped" && (!trackingCarrier || !trackingNumber)) {
    return { error: "Carrier and tracking number are required to mark an order as shipped.", success: false };
  }

  // orders has no UPDATE grant for authenticated by design (client-immutable
  // orders) — every admin write goes through the service-role client.
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("orders")
    .select("id, status, shipped_at, delivered_at, shipping_address")
    .eq("order_number", orderNumber)
    .single();
  if (!existing) {
    return { error: "Order not found.", success: false };
  }
  const wasAlreadyShipped = !!existing.shipped_at;

  const updates: Record<string, unknown> = {
    status,
    // Tracking inputs are always submitted (not just when status = shipped),
    // so switching e.g. shipped -> delivered doesn't blank out tracking data.
    tracking_carrier: trackingCarrier || null,
    tracking_number: trackingNumber || null,
    tracking_url: trackingUrl || null
  };
  if (status === "shipped" && !existing.shipped_at) updates.shipped_at = new Date().toISOString();
  if (status === "delivered" && !existing.delivered_at) updates.delivered_at = new Date().toISOString();

  const { error } = await admin.from("orders").update(updates).eq("order_number", orderNumber);
  if (error) {
    console.error("updateOrderStatus error", error);
    return { error: "Could not update the order. Please try again.", success: false };
  }

  // Cancelling never returned stock to inventory before — every cancellation
  // permanently shrank sellable stock until someone noticed and corrected it
  // by hand in the variant editor. Only restore on the transition *into*
  // cancelled (guarded by existing.status !== "cancelled" above via the
  // isOrderStatus/status checks having already run) so re-saving an already-
  // cancelled order can't double-restore.
  if (status === "cancelled" && existing.status !== "cancelled") {
    const { data: items, error: itemsError } = await admin
      .from("order_items")
      .select("product_id, size, qty")
      .eq("order_id", existing.id);
    if (itemsError) {
      console.error("updateOrderStatus restock read error", itemsError);
    } else {
      for (const item of items ?? []) {
        if (item.product_id == null) continue;
        const { error: restockError } = await admin.rpc("increment_stock", {
          p_product_id: item.product_id,
          p_size: item.size,
          p_qty: item.qty
        });
        if (restockError) console.error("updateOrderStatus restock error", restockError);
      }
    }
  }

  if (status === "shipped" && !wasAlreadyShipped) {
    const address = existing.shipping_address as unknown as ShippingAddressSnapshot | null;
    if (address?.email) {
      await sendShippingNotificationEmail({
        to: address.email,
        orderNumber,
        trackingCarrier,
        trackingNumber,
        trackingUrl: trackingUrl || null
      });
    }
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderNumber}`);
  revalidatePath("/account/orders");
  revalidatePath(`/account/orders/${orderNumber}`);

  return { error: null, success: true };
}
