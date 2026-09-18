"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { applyPromoCode } from "@/lib/promo/actions";
import { getProvider } from "@/lib/payments/registry";

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
  const userId = claims.sub;

  // Cash on Delivery is the only working payment method — online payment is
  // a disabled "coming soon" option in the UI, so reject anything else here
  // too in case a disabled radio was bypassed client-side.
  const paymentMethod = String(formData.get("paymentMethod") || "").trim();
  if (paymentMethod !== "cod") {
    return { error: "Online payment isn't available yet — please select Cash on Delivery." };
  }

  // Never trust a client-submitted cart or totals — re-read the user's
  // server-persisted cart and recompute everything from it.
  const { data: cartRows, error: cartErr } = await supabase.from("cart_items").select("product_id, size, quantity");
  if (cartErr) {
    return { error: "Could not load your bag. Please try again." };
  }
  if (!cartRows || cartRows.length === 0) {
    return { error: "Your bag is empty." };
  }

  const productIds = [...new Set(cartRows.map((r) => r.product_id))];

  const { data: products, error: prodErr } = await supabase
    .from("products")
    .select("id, name, price")
    .in("id", productIds);
  if (prodErr || !products) {
    return { error: "Could not verify products in your bag. Please try again." };
  }
  const productById = new Map(products.map((p) => [p.id, p]));

  const { data: variants, error: varErr } = await supabase
    .from("product_variants")
    .select("product_id, size, available, stock_qty")
    .in("product_id", productIds);
  if (varErr || !variants) {
    return { error: "Could not verify stock. Please try again." };
  }
  const variantKey = (productId: number, size: string) => `${productId}::${size}`;
  const variantByKey = new Map(variants.map((v) => [variantKey(v.product_id, v.size), v]));

  for (const row of cartRows) {
    const variant = variantByKey.get(variantKey(row.product_id, row.size));
    const product = productById.get(row.product_id);
    if (!variant || !variant.available || variant.stock_qty < row.quantity) {
      return { error: `${product?.name ?? "An item"} (size ${row.size}) is no longer in stock in that quantity.` };
    }
  }

  const subtotal = cartRows.reduce((sum, row) => sum + (productById.get(row.product_id)?.price ?? 0) * row.quantity, 0);

  const promoCode = String(formData.get("promoCode") || "").trim().toUpperCase();
  let discountPercent = 0;
  if (promoCode) {
    const promoResult = await applyPromoCode(promoCode);
    if (promoResult.success) discountPercent = promoResult.discountPercent;
  }
  const discountAmount = Math.round(((subtotal * discountPercent) / 100) * 100) / 100;
  const shippingCost = subtotal >= 250 ? 0 : 25;
  const preTaxTotal = Math.max(0, subtotal - discountAmount + shippingCost);
  const GST_RATE = 0.05;
  const gstAmount = Math.round(preTaxTotal * GST_RATE * 100) / 100;
  const total = preTaxTotal + gstAmount;

  const shippingAddress = {
    firstName: String(formData.get("firstName") || "").trim(),
    lastName: String(formData.get("lastName") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    street: String(formData.get("address") || "").trim(),
    city: String(formData.get("city") || "").trim(),
    postalCode: String(formData.get("postalCode") || "").trim(),
    country: String(formData.get("country") || "").trim()
  };
  if (
    !shippingAddress.email.includes("@") ||
    !shippingAddress.firstName ||
    !shippingAddress.street ||
    !shippingAddress.city ||
    !shippingAddress.postalCode
  ) {
    return { error: "Please fill in all required contact and shipping fields." };
  }

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      subtotal,
      discount_amount: discountAmount,
      shipping_cost: shippingCost,
      gst_amount: gstAmount,
      total,
      promo_code: promoCode || null,
      shipping_address: shippingAddress
    })
    .select("id, order_number")
    .single();
  if (orderErr || !order) {
    return { error: "Could not create your order. Please try again." };
  }

  const orderItemRows = cartRows.map((row) => {
    const product = productById.get(row.product_id)!;
    return {
      order_id: order.id,
      product_id: row.product_id,
      product_name: product.name,
      size: row.size,
      unit_price: product.price,
      qty: row.quantity
    };
  });
  const { error: itemsErr } = await supabase.from("order_items").insert(orderItemRows);
  if (itemsErr) {
    return { error: "Could not save your order items. Please try again." };
  }

  // Stock decrement needs elevated privilege: authenticated users have no
  // UPDATE grant on product_variants by design (nobody should edit stock
  // directly via the REST API) — only this trusted server-side path can.
  const admin = createAdminClient();
  for (const row of cartRows) {
    const variant = variantByKey.get(variantKey(row.product_id, row.size))!;
    await admin
      .from("product_variants")
      .update({ stock_qty: variant.stock_qty - row.quantity })
      .eq("product_id", row.product_id)
      .eq("size", row.size);
  }

  await supabase.from("cart_items").delete().eq("user_id", userId);

  const provider = getProvider("cod");
  const { redirectUrl } = await provider.createPayment({
    supabase,
    orderId: order.id,
    orderNumber: order.order_number,
    amount: total
  });

  redirect(redirectUrl);
}
