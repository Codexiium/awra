"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import ProductImage from "../ui/ProductImage";
import { useCartStore } from "@/app/store/useCartStore";
import { formatPrice } from "@/lib/format";

export default function CartDrawer() {
  const {
    cart,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getDiscountAmount,
    getShippingCost,
    getGstAmount,
    getGrandTotal,
    discountPercent,
    applyPromoCode
  } = useCartStore();

  const [inputCode, setInputCode] = useState("");
  const [promoError, setPromoError] = useState("");

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingCost();
  const gst = getGstAmount();
  const grandTotal = getGrandTotal();

  const freeShippingThreshold = 250;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    const res = await applyPromoCode(inputCode);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setInputCode("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#0a0a0a] border-l border-white/15 h-full flex flex-col justify-between z-10 shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-zinc-100" />
            <h3 className="font-mono text-sm uppercase tracking-widest text-zinc-100 font-bold">
              YOUR BAG ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </h3>
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart drawer"
            className="p-1 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#121212] px-6 py-3 border-b border-white/5">
          <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
            {subtotal >= freeShippingThreshold ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> COMPLIMENTARY EXPRESS SHIPPING UNLOCKED
              </span>
            ) : (
              <span className="text-zinc-400">
                ADD <strong className="text-white">${freeShippingThreshold - subtotal}</strong> FOR FREE SHIPPING
              </span>
            )}
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-zinc-400 to-white transition-all duration-500"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Line Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 select-none">
              <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-zinc-600" />
              </div>
              <p className="font-gothic text-xl text-zinc-300 mb-1">Your bag is empty</p>
              <p className="text-xs text-zinc-500 font-mono mb-6 max-w-xs">
                Explore Drop 04 Nocturnal Disruption to discover dark heavy silhouettes.
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="clay-button-primary px-6 py-3 text-xs font-mono uppercase tracking-widest"
              >
                DISCOVER SHOP
              </Link>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex gap-4 pb-6 border-b border-white/5 group">
                {/* Thumbnail */}
                <div className="w-20 shrink-0">
                  <ProductImage
                    src={item.product.images?.primary?.src}
                    alt={item.product.name}
                    aspectRatio="1:1"
                    className="rounded-none border border-white/10"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={closeCart}
                        className="text-xs font-semibold text-zinc-100 hover:text-white line-clamp-1 tracking-wide font-sans"
                      >
                        {item.product.name}
                      </Link>

                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id, item.selectedSize)}
                        className="text-zinc-500 hover:text-red-400 p-0.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] font-mono text-zinc-400 mt-1 flex items-center gap-2">
                      <span>SIZE: {item.selectedSize}</span>
                    </div>
                  </div>

                  {/* Price & Quantity Stepper */}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs font-mono font-medium text-zinc-200">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>

                    {/* Stepper */}
                    <div className="flex items-center border border-white/15 bg-[#121212]">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)
                        }
                        className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-mono font-bold text-zinc-200">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)
                        }
                        className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#0d0d0d] space-y-4">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="PROMO CODE (ARWA15)"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="clay-input w-full pl-9 pr-3 py-2 text-xs font-mono uppercase"
                />
              </div>
              <button
                type="submit"
                className="clay-button-secondary px-3 py-2 text-xs font-mono uppercase"
              >
                APPLY
              </button>
            </form>

            {promoError && <p className="text-[10px] font-mono text-red-400">{promoError}</p>}

            {/* Calculations */}
            <div className="space-y-1.5 text-xs font-mono text-zinc-400">
              <div className="flex items-center justify-between">
                <span>SUBTOTAL</span>
                <span className="text-zinc-200">{formatPrice(subtotal)}</span>
              </div>

              {discountPercent > 0 && (
                <div className="flex items-center justify-between text-emerald-400">
                  <span>DISCOUNT ({discountPercent}%)</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>ESTIMATED SHIPPING</span>
                <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>GST (5%)</span>
                <span>{formatPrice(gst)}</span>
              </div>

              <div className="flex items-center justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                <span>ESTIMATED TOTAL</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                href="/cart"
                onClick={closeCart}
                className="clay-button-secondary py-3 text-center text-xs font-mono uppercase tracking-wider"
              >
                VIEW BAG
              </Link>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="clay-button-primary py-3 text-center text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                CHECKOUT <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
