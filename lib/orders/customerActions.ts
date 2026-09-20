"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { restockOrderItems } from "./restock";

export interface CancelOrderState {
  error: string | null;
  success: boolean;
}

// Customers can only self-cancel while an order is still "processing" — the
// window before an admin has accepted it for fulfillment. Past that, the
// order detail page instead shows a call/WhatsApp prompt (see
// CancelOrderSection.tsx), since fulfillment may already be underway and
// needs a human.
export async function cancelOwnOrder(_prevState: CancelOrderState, formData: FormData): Promise<CancelOrderState> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) {
    return { error: "You must be signed in to cancel an order.", success: false };
  }

  const orderNumber = String(formData.get("orderNumber") || "").trim();
  if (!orderNumber) {
    return { error: "Order not found.", success: false };
  }

  // orders_select_own RLS scopes this to the caller's own order — this read
  // is also how ownership is confirmed before the admin-client write below.
  const { data: order } = await supabase.from("orders").select("id, status").eq("order_number", orderNumber).maybeSingle();
  if (!order) {
    return { error: "Order not found.", success: false };
  }
  if (order.status !== "processing") {
    return {
      error: "This order can no longer be cancelled automatically — call or WhatsApp us to request cancellation.",
      success: false
    };
  }

  // orders has no UPDATE grant for authenticated by design — ownership was
  // already verified above via the RLS-scoped read.
  const admin = createAdminClient();
  const { error } = await admin.from("orders").update({ status: "cancelled" }).eq("id", order.id);
  if (error) {
    console.error("cancelOwnOrder error", error);
    return { error: "Could not cancel your order. Please try again.", success: false };
  }

  await restockOrderItems(admin, order.id);

  revalidatePath(`/account/orders/${orderNumber}`);
  revalidatePath("/account/orders");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderNumber}`);

  return { error: null, success: true };
}
