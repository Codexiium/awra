"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Lock, CreditCard } from "lucide-react";
import ProductImage from "../components/ui/ProductImage";
import { useCartStore } from "../store/useCartStore";
import { formatPrice } from "@/lib/format";
import { placeOrder, type PlaceOrderState } from "@/lib/checkout/actions";

interface CheckoutFormProps {
  initialEmail: string;
  initialFirstName: string;
  initialLastName: string;
  initialAddress: string;
  initialCity: string;
  initialPostalCode: string;
  initialCountry: string;
}

interface ContactShippingData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

type FieldErrors = Partial<Record<keyof ContactShippingData, string>>;

const initialPlaceOrderState: PlaceOrderState = { error: null };

export default function CheckoutForm({
  initialEmail,
  initialFirstName,
  initialLastName,
  initialAddress,
  initialCity,
  initialPostalCode,
  initialCountry
}: CheckoutFormProps) {
  const { cart, promoCode, getSubtotal, getDiscountAmount, getShippingCost, getGrandTotal } = useCartStore();

  const [formData, setFormData] = useState<ContactShippingData>({
    email: initialEmail,
    firstName: initialFirstName,
    lastName: initialLastName,
    address: initialAddress,
    city: initialCity,
    postalCode: initialPostalCode,
    country: initialCountry
  });
  const [cardNumber, setCardNumber] = useState("4532 8920 1928 4812");
  const [cardExpiry, setCardExpiry] = useState("08/28");
  const [cardCvc, setCardCvc] = useState("894");
  const [errors, setErrors] = useState<FieldErrors>({});

  const [state, formAction, isSubmitting] = useActionState(placeOrder, initialPlaceOrderState);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingCost();
  const grandTotal = getGrandTotal();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errs: FieldErrors = {};
    if (!formData.email.includes("@")) errs.email = "Valid email is required";
    if (!formData.firstName.trim()) errs.firstName = "First name is required";
    if (!formData.lastName.trim()) errs.lastName = "Last name is required";
    if (!formData.address.trim()) errs.address = "Shipping address is required";
    if (!formData.city.trim()) errs.city = "City is required";
    if (!formData.postalCode.trim()) errs.postalCode = "Postal code is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!validateForm()) {
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
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">EMAIL ADDRESS</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
              />
              {errors.email && <p className="text-[10px] font-mono text-red-400 mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="p-6 bg-[#0f0f0f] border border-white/10 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-200 font-bold border-b border-white/10 pb-2">
              2. SHIPPING ADDRESS
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">FIRST NAME</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
                />
                {errors.firstName && <p className="text-[10px] font-mono text-red-400 mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">LAST NAME</label>
                <input
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
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">STREET ADDRESS</label>
              <input
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
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">CITY</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">POSTAL CODE</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">COUNTRY</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
                />
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

          {/* 4. Payment Method UI (Mock) */}
          <div className="p-6 bg-[#0f0f0f] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-200 font-bold">
                4. PAYMENT METHOD (DUMMY GATEWAY)
              </h3>
              <span className="text-[10px] font-mono text-amber-400">NO REAL CARD CHARGED</span>
            </div>
            <p className="text-[11px] font-mono text-zinc-500">
              Card details are cosmetic only — after placing your order you&apos;ll confirm payment on a dummy gateway screen.
            </p>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">CARD NUMBER</label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="clay-input w-full px-4 py-3 text-xs font-mono text-white tracking-widest"
                />
                <CreditCard className="w-4 h-4 text-zinc-500 absolute right-4 top-3.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">EXPIRY (MM/YY)</label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">CVC SECURITY CODE</label>
                <input
                  type="password"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  className="clay-input w-full px-4 py-3 text-xs font-mono text-white"
                />
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full clay-button-primary py-4 text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <span>PLACING ORDER...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" /> CONFIRM &amp; PLACE ORDER — {formatPrice(grandTotal)}
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
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-center text-xs font-mono text-zinc-300">
                  <div className="w-12 h-14 shrink-0 border border-white/10">
                    <ProductImage src={item.product.images?.primary?.src} alt={item.product.name} aspectRatio="1:1" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white line-clamp-1 font-semibold">{item.product.name}</p>
                    <p className="text-[10px] text-zinc-500">SIZE {item.selectedSize} · QTY {item.quantity}</p>
                  </div>
                  <span className="font-bold text-white">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
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
