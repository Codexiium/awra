"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import ProductImage from "../components/ui/ProductImage";
import { useCartStore } from "../store/useCartStore";
import { formatPrice } from "@/lib/format";
import { placeOrder, type PlaceOrderState } from "@/lib/checkout/actions";
import { validateCheckoutFields, type CheckoutFormFields } from "@/lib/checkout/validateAddress";
import type { CartStockLine } from "@/lib/checkout/stockCheck";

interface CheckoutFormProps {
  initialEmail: string;
  initialFirstName: string;
  initialLastName: string;
  initialAddress: string;
  initialCity: string;
  initialPostalCode: string;
  initialCountry: string;
  initialPhone: string;
  stockStatus: CartStockLine[];
}

const initialPlaceOrderState: PlaceOrderState = { error: null };

export default function CheckoutForm({
  initialEmail,
  initialFirstName,
  initialLastName,
  initialAddress,
  initialCity,
  initialPostalCode,
  initialCountry,
  initialPhone,
  stockStatus
}: CheckoutFormProps) {
  const { cart, promoCode, getSubtotal, getDiscountAmount, getShippingCost, getGstAmount, getGrandTotal } = useCartStore();

  // Server-fetched at checkout page load — a better-UX early warning before
  // place_order() authoritatively re-validates stock at submit time anyway.
  const stockByKey = new Map(stockStatus.map((s) => [`${s.productId}::${s.size}`, s]));
  const hasStockIssues = cart.some((item) => !stockByKey.get(`${item.product.id}::${item.selectedSize}`)?.ok);

  const [formData, setFormData] = useState<CheckoutFormFields>({
    email: initialEmail,
    firstName: initialFirstName,
    lastName: initialLastName,
    address: initialAddress,
    city: initialCity,
    postalCode: initialPostalCode,
    country: initialCountry,
    phone: initialPhone
  });
  const [errors, setErrors] = useState<ReturnType<typeof validateCheckoutFields>>({});

  const [state, formAction, isSubmitting] = useActionState(placeOrder, initialPlaceOrderState);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingCost();
  const gst = getGstAmount();
  const grandTotal = getGrandTotal();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Mirrors the server-side check in lib/checkout/actions.ts exactly (both
  // call validateCheckoutFields) — previously these were two independent,
  // hand-written checks that had drifted (the server never required
  // lastName/country even though the client did), so a request that skipped
  // the browser entirely could create an order missing them.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const fieldErrors = validateCheckoutFields(formData);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      e.preventDefault();
      window.scrollTo({ top: 200, behavior: "smooth" });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="font-gothic text-3xl text-white mb-2">NO ITEMS TO CHECKOUT</h1>
        <p className="text-xs font-mono text-zinc-500 mb-6">Your bag is currently empty.</p>
        <Link href="/shop" className="clay-button-primary px-6 py-3 text-xs font-mono uppercase">
          RETURN TO SHOP
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-white transition-colors">BAG</Link>
        <span>/</span>
        <span className="text-zinc-200">EXPRESS CHECKOUT</span>
      </nav>

      <div className="pb-8 border-b border-white/10 mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-gothic text-4xl text-white tracking-widest uppercase">
            EXPRESS CHECKOUT
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">SECURE ENCRYPTED TRANSACTION</p>
        </div>
        <div className="flex items-center gap-1 text-xs font-mono text-emerald-400">
          <Lock className="w-4 h-4" /> SSL 256-BIT MOCK
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Form Flow (PRD Section 15.1) */}
        <form action={formAction} onSubmit={handleSubmit} className="lg:col-span-7 space-y-10">
          <input type="hidden" name="promoCode" value={promoCode} />

          {state.error && (
            <p className="text-xs font-mono text-red-400 border border-red-500/30 bg-red-950/30 px-4 py-3">
              {state.error}
            </p>
          )}

          {/* 1. Contact Info */}
          <div className="p-6 bg-[#0f0f0f] border border-white/10 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-200 font-bold border-b border-white/10 pb-2">
              1. CONTACT INFORMATION
            </h3>
            <div>
              <label htmlFor="checkout-email" className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">EMAIL ADDRESS</label>
              <input
                id="checkout-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
              />
              {errors.email && <p className="text-[10px] font-mono text-red-400 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="checkout-phone" className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">PHONE NUMBER</label>
              <input
                id="checkout-phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="REQUIRED FOR COD DELIVERY"
                className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
              />
              {errors.phone && <p className="text-[10px] font-mono text-red-400 mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="p-6 bg-[#0f0f0f] border border-white/10 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-200 font-bold border-b border-white/10 pb-2">
              2. SHIPPING ADDRESS
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="checkout-firstName" className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">FIRST NAME</label>
                <input
                  id="checkout-firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
                />
                {errors.firstName && <p className="text-[10px] font-mono text-red-400 mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="checkout-lastName" className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">LAST NAME</label>
                <input
                  id="checkout-lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
                />
                {errors.lastName && <p className="text-[10px] font-mono text-red-400 mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="checkout-address" className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">STREET ADDRESS</label>
              <input
                id="checkout-address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
              />
              {errors.address && <p className="text-[10px] font-mono text-red-400 mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="checkout-city" className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">CITY</label>
                <input
                  id="checkout-city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
                />
                {errors.city && <p className="text-[10px] font-mono text-red-400 mt-1">{errors.city}</p>}
              </div>
              <div>
                <label htmlFor="checkout-postalCode" className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">POSTAL CODE</label>
                <input
                  id="checkout-postalCode"
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
                />
                {errors.postalCode && <p className="text-[10px] font-mono text-red-400 mt-1">{errors.postalCode}</p>}
              </div>
              <div>
                <label htmlFor="checkout-country" className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">COUNTRY</label>
                <input
                  id="checkout-country"
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
                />
                {errors.country && <p className="text-[10px] font-mono text-red-400 mt-1">{errors.country}</p>}
              </div>
            </div>
          </div>

          {/* 3. Delivery Method */}
          <div className="p-6 bg-[#0f0f0f] border border-white/10 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-200 font-bold border-b border-white/10 pb-2">
              3. DELIVERY METHOD
            </h3>
            <div className="space-y-3 font-mono text-xs">
              <label className="flex items-center justify-between p-4 border border-white/15 bg-[#141414] cursor-pointer">
                <div className="flex items-center gap-3">
                  <input type="radio" name="deliveryOption" value="express" checked readOnly className="accent-white" />
                  <div>
                    <span className="font-bold text-white block">EXPRESS AIR FREIGHT</span>
                    <span className="text-[10px] text-zinc-400">2–3 BUSINESS DAYS WITH TRACKING</span>
                  </div>
                </div>
                <span className="text-white font-bold">{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
              </label>
            </div>
          </div>

          {/* 4. Payment Method */}
          <div className="p-6 bg-[#0f0f0f] border border-white/10 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-200 font-bold border-b border-white/10 pb-2">
              4. PAYMENT METHOD
            </h3>

            <input type="hidden" name="paymentMethod" value="cod" />

            <div className="space-y-3 font-mono text-xs">
              <label className="flex items-center justify-between p-4 border border-white/40 bg-[#141414] cursor-pointer">
                <div className="flex items-center gap-3">
                  <input type="radio" name="paymentMethodDisplay" checked readOnly className="accent-white" />
                  <div>
                    <span className="font-bold text-white block">CASH ON DELIVERY (COD)</span>
                    <span className="text-[10px] text-zinc-400">PAY IN CASH WHEN YOUR ORDER ARRIVES</span>
                  </div>
                </div>
              </label>

              <div className="flex items-center justify-between p-4 border border-white/10 bg-[#0d0d0d] opacity-50">
                <div className="flex items-center gap-3">
                  <input type="radio" name="paymentMethodDisplay" disabled className="accent-white" />
                  <div>
                    <span className="font-bold text-zinc-400 block">ONLINE PAYMENT</span>
                    <span className="text-[10px] text-zinc-500">CARD / UPI / NETBANKING</span>
                  </div>
                </div>
                <span className="px-2 py-1 bg-amber-950/60 border border-amber-500/30 text-amber-400 text-[10px] uppercase font-bold">
                  COMING SOON
                </span>
              </div>
            </div>
          </div>

          {hasStockIssues && (
            <p className="text-xs font-mono text-red-400 border border-red-500/30 bg-red-950/30 px-4 py-3">
              One or more items in your bag are no longer available in the requested quantity. Update your bag before placing this order.
            </p>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting || hasStockIssues}
            className="w-full clay-button-primary py-4 text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <span>PLACING ORDER...</span>
            ) : hasStockIssues ? (
              <span>RESOLVE STOCK ISSUES TO CONTINUE</span>
            ) : (
              <>
                <Lock className="w-4 h-4" /> PLACE COD ORDER — {formatPrice(grandTotal)}
              </>
            )}
          </button>
        </form>

        {/* Right Sticky Order Summary (PRD 15.1 #6) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 p-6 bg-[#0f0f0f] border border-white/15 space-y-6">
            <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-200 font-bold border-b border-white/10 pb-3">
              YOUR ORDER SUMMARY ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>

            {/* Item list */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {cart.map((item, idx) => {
                const stock = stockByKey.get(`${item.product.id}::${item.selectedSize}`);
                const outOfStock = !stock?.ok;
                return (
                  <div key={idx} className="flex gap-3 items-center text-xs font-mono text-zinc-300">
                    <div className="w-12 h-14 shrink-0 border border-white/10">
                      <ProductImage src={item.product.images?.primary?.src} alt={item.product.name} aspectRatio="1:1" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white line-clamp-1 font-semibold">{item.product.name}</p>
                      <p className="text-[10px] text-zinc-500">SIZE {item.selectedSize} · QTY {item.quantity}</p>
                      {outOfStock && (
                        <p className="text-[10px] text-red-400 font-bold mt-0.5">
                          {stock && stock.stockQty > 0 ? `ONLY ${stock.stockQty} LEFT` : "OUT OF STOCK"}
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-white">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                );
              })}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs font-mono text-zinc-400 pt-4 border-t border-white/10">
              <div className="flex justify-between">
                <span>SUBTOTAL</span>
                <span className="text-zinc-200">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>DISCOUNT</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>EXPRESS SHIPPING</span>
                <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span>{formatPrice(gst)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                <span>TOTAL DUE</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
