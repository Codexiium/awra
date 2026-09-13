"use client";

import { useEffect } from "react";
import { Heart, ShoppingBag, X } from "lucide-react";
import { useCartStore } from "@/app/store/useCartStore";
import { useWishlistStore } from "@/app/store/useWishlistStore";

export default function Toast() {
  const { toastMessage: cartToast, clearToast: clearCartToast } = useCartStore();
  const { toastMessage: wishlistToast, clearToast: clearWishlistToast } = useWishlistStore();

  const activeToast = cartToast || wishlistToast;

  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        clearCartToast();
        clearWishlistToast();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [activeToast, clearCartToast, clearWishlistToast]);

  if (!activeToast) return null;

  const isCart = Boolean(cartToast);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className="clay-surface px-4 py-3 rounded-lg flex items-center gap-3 border border-white/20 shadow-2xl backdrop-blur-md max-w-sm">
        {isCart ? (
          <ShoppingBag className="w-5 h-5 text-emerald-400 shrink-0" />
        ) : (
          <Heart className="w-5 h-5 text-red-400 shrink-0" />
        )}
        <p className="text-xs font-sans text-zinc-100 font-medium">{activeToast}</p>
        <button
          type="button"
          onClick={() => {
            clearCartToast();
            clearWishlistToast();
          }}
          className="text-zinc-400 hover:text-white p-1 ml-auto"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
