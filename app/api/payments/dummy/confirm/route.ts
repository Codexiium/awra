import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Deliberately shaped like a real provider's webhook: the status transition
// (pending -> succeeded/failed) runs through the admin client, not the
// caller's own session, because payments has no client-writable update
// policy. The ownership check below is what a real webhook would get for
// free (the provider only ever reports on payments/orders it itself created);
// here we have to verify it explicitly since the "gateway" is same-app.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const claims = auth?.claims;
  if (!claims) {
    return NextResponse.redirect(new URL("/login", request.url), 303);
  }

  const formData = await request.formData();
  const orderNumber = String(formData.get("orderNumber") || "");
  const outcome = String(formData.get("outcome") || "succeeded") === "failed" ? "failed" : "succeeded";

  if (!orderNumber) {
    return NextResponse.redirect(new URL("/dummy_pay?error=not_found", request.url), 303);
  }

  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("id, user_id, payment_status")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (!order || order.user_id !== claims.sub) {
    return NextResponse.redirect(new URL("/dummy_pay?error=not_found", request.url), 303);
  }

  if (order.payment_status !== "pending") {
    const dest = order.payment_status === "paid" ? `/checkout/success?order=${orderNumber}` : `/dummy_pay?order=${orderNumber}&error=already_settled`;
    return NextResponse.redirect(new URL(dest, request.url), 303);
  }

  const { data: payment } = await admin
    .from("payments")
    .select("id")
    .eq("order_id", order.id)
    .eq("status", "pending")
    .maybeSingle();

  if (!payment) {
    return NextResponse.redirect(new URL(`/dummy_pay?order=${orderNumber}&error=not_found`, request.url), 303);
  }

  if (outcome === "succeeded") {
    await admin.from("payments").update({ status: "succeeded" }).eq("id", payment.id);
    await admin.from("orders").update({ payment_status: "paid" }).eq("id", order.id);
    return NextResponse.redirect(new URL(`/checkout/success?order=${orderNumber}`, request.url), 303);
  }

  await admin.from("payments").update({ status: "failed" }).eq("id", payment.id);
  await admin.from("orders").update({ payment_status: "failed" }).eq("id", order.id);
  return NextResponse.redirect(new URL(`/dummy_pay?order=${orderNumber}&error=declined`, request.url), 303);
}
