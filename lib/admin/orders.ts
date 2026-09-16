"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isOrderStatus } from "@/lib/orders/status";

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
    .select("shipped_at, delivered_at")
    .eq("order_number", orderNumber)
    .single();
  if (!existing) {
    return { error: "Order not found.", success: false };
  }

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
    return { error: "Could not update the order. Please try again.", success: false };
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderNumber}`);
  revalidatePath("/account/orders");
  revalidatePath(`/account/orders/${orderNumber}`);

  return { error: null, success: true };
}
