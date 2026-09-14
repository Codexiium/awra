"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import ProductImage from "../components/ui/ProductImage";
import { useCartStore } from "../store/useCartStore";
import { formatPrice } from "@/lib/format";

export default function FullCartPage() {
  const {
    cart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getDiscountAmount,
    getShippingCost,
    getGrandTotal,
    discountPercent,
    applyPromoCode
  } = useCartStore();

  const [inputCode, setInputCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingCost();
  const grandTotal = getGrandTotal();

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await applyPromoCode(inputCode);
    setPromoMessage(res.message);
    if (res.success) setInputCode("");
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-zinc-600" />
        </div>
        <h1 className="font-gothic text-4xl text-zinc-100 mb-2">YOUR BAG IS EMPTY</h1>
        <p className="text-xs font-mono text-zinc-500 max-w-md mx-auto mb-8">
          Explore Drop 04 Nocturnal Disruption to discover heavy cotton canvas trenches and spiky archival metal.
        </p>
        <Link
          href="/shop"
          className="clay-button-primary px-8 py-4 text-xs font-mono uppercase tracking-widest inline-flex items-center gap-2"
        >
          <span>DISCOVER SHOP CATALOG</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-zinc-200">SHOPPING BAG</span>
      </nav>

      <div className="pb-8 border-b border-white/10 mb-8">
        <h1 className="font-gothic text-4xl sm:text-5xl text-white tracking-widest uppercase">
          SHOPPING BAG
        </h1>
        <p className="text-xs text-zinc-400 font-mono mt-2">
          CONTAINING {cart.reduce((sum, i) => sum + i.quantity, 0)} GARMENTS
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Line Items List */}
        <div className="lg:col-span-8 space-y-6">
          {cart.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row gap-6 p-6 bg-[#0f0f0f] border border-white/10 items-start sm:items-center justify-between"
            >
              <div className="flex gap-4">
                <div className="w-24 shrink-0">
                  <ProductImage
                    src={item.product.images?.primary?.src}
                    alt={item.product.name}
                    aspectRatio="1:1"
                  />
                </div>

                <div>
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="font-semibold text-sm text-white hover:underline font-sans"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-xs font-mono text-zinc-400 mt-1">
                    SIZE: {item.selectedSize} · COLOR: {item.selectedColor}
                  </p>
                  <p className="text-xs font-mono text-zinc-200 mt-2 font-bold">
                    {formatPrice(item.product.price)}
                  </p>
                </div>
              </div>

              {/* Quantity Stepper & Price */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-8 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
                <div className="flex items-center border border-white/20 bg-[#141414]">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)
                    }
                    className="p-2 text-zinc-400 hover:text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-mono font-bold text-white">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)
                    }
                    className="p-2 text-zinc-400 hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-sm font-mono font-bold text-white">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                    className="text-xs font-mono text-zinc-500 hover:text-red-400 inline-flex items-center gap-1 mt-1"
                  >
                    <Trash2 className="w-3 h-3" /> REMOVE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sticky Panel (PRD 12.2) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 p-6 bg-[#0f0f0f] border border-white/15 space-y-6">
            <h3 className="font-mono text-sm uppercase tracking-widest text-white border-b border-white/10 pb-4 font-bold">
              ORDER SUMMARY
            </h3>

            {/* Promo code form */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="PROMO CODE"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="clay-input flex-1 px-3 py-2 text-xs font-mono uppercase"
                />
                <button type="submit" className="clay-button-secondary px-3 py-2 text-xs font-mono uppercase">
                  APPLY
                </button>
              </div>
              {promoMessage && <p className="text-[10px] font-mono text-zinc-300">{promoMessage}</p>}
            </form>

            <div className="space-y-3 text-xs font-mono text-zinc-300">
              <div className="flex justify-between">
                <span>BAG SUBTOTAL</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>PROMO DISCOUNT ({discountPercent}%)</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>EXPRESS SHIPPING</span>
                <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-white pt-4 border-t border-white/10">
                <span>ESTIMATED TOTAL</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="clay-button-primary w-full py-4 text-center text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2"
            >
              PROCEED TO CHECKOUT <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-[10px] font-mono text-zinc-500 text-center">
              TAXES &amp; CUSTOMS CALCULATED AT CHECKOUT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
