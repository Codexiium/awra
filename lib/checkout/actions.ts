"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProvider } from "@/lib/payments/registry";
import { validateCheckoutFields } from "./validateAddress";
import { sendOrderConfirmationEmail, sendNewOrderAlertEmail } from "@/lib/email/send";

export interface PlaceOrderState {
  error: string | null;
}

export async function placeOrder(_prevState: PlaceOrderState, formData: FormData): Promise<PlaceOrderState> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const claims = auth?.claims;
  if (!claims) {
    redirect("/login?next=/checkout");
  }

  // Cash on Delivery is the only working payment method — online payment is
  // a disabled "coming soon" option in the UI, so reject anything else here
  // too in case a disabled radio was bypassed client-side.
  const paymentMethod = String(formData.get("paymentMethod") || "").trim();
  if (paymentMethod !== "cod") {
    return { error: "Online payment isn't available yet — please select Cash on Delivery." };
  }

  const fields = {
    email: String(formData.get("email") || "").trim(),
    firstName: String(formData.get("firstName") || "").trim(),
    lastName: String(formData.get("lastName") || "").trim(),
    address: String(formData.get("address") || "").trim(),
    city: String(formData.get("city") || "").trim(),
    postalCode: String(formData.get("postalCode") || "").trim(),
    country: String(formData.get("country") || "").trim(),
    phone: String(formData.get("phone") || "").trim()
  };
  const fieldErrors = validateCheckoutFields(fields);
  const firstError = Object.values(fieldErrors)[0];
  if (firstError) {
    return { error: firstError };
  }

  const shippingAddress = {
    firstName: fields.firstName,
    lastName: fields.lastName,
    email: fields.email,
    street: fields.address,
    city: fields.city,
    postalCode: fields.postalCode,
    country: fields.country
  };

  const promoCode = String(formData.get("promoCode") || "").trim().toUpperCase();

  // Everything from here down — re-reading the cart, validating stock,
  // recomputing totals, and writing orders/order_items/payments/stock — runs
  // inside one atomic Postgres function. See the migration comment in
  // supabase/migrations/20260919043808_add_order_phone_and_place_order_fn.sql
  // for why: this closes both the stock-decrement race and the
  // non-transactional partial-failure risk the old multi-step flow had, and
  // authenticated users no longer have direct insert access to these tables
  // at all (see the grants migration alongside it).
  const { data: orderNumber, error: rpcError } = await supabase.rpc("place_order", {
    p_shipping_address: shippingAddress,
    p_phone: fields.phone,
    p_promo_code: promoCode || null
  });

  if (rpcError || !orderNumber) {
    console.error("placeOrder rpc error", rpcError);
    const message = rpcError?.message ?? "";
    if (message.includes("insufficient_stock")) {
      return { error: "One or more items in your bag are no longer in stock in that quantity." };
    }
    if (message.includes("empty_cart")) {
      return { error: "Your bag is empty." };
    }
    return { error: "Could not place your order. Please try again." };
  }

  const { data: createdOrder } = await supabase.from("orders").select("total").eq("order_number", orderNumber).single();
  if (createdOrder) {
    await Promise.all([
      sendOrderConfirmationEmail({ to: fields.email, orderNumber, total: createdOrder.total }),
      sendNewOrderAlertEmail({ orderNumber, total: createdOrder.total })
    ]);
  }

  const provider = getProvider("cod");
  const { redirectUrl } = await provider.createPayment({ orderNumber });

  redirect(redirectUrl);
}
