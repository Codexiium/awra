"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import ProductCard from "../components/ui/ProductCard";
import { useWishlistStore } from "../store/useWishlistStore";
import { useCartStore } from "../store/useCartStore";
import { useUser } from "@/lib/supabase/useUser";
import type { Product } from "../types";

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const { isLoggedIn } = useUser();

  const handleMoveToCart = (product: Product) => {
    const size = product.sizes?.find((s) => s.available)?.size || "M";
    const color = product.colors?.[0]?.name || "Obsidian Black";
    addItem(product, size, color, 1);
    toggleWishlist(product);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-zinc-200">WISHLIST</span>
      </nav>

      {/* Page Header */}
      <div className="pb-8 border-b border-white/10 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-gothic text-4xl sm:text-5xl text-white tracking-widest uppercase">
            SAVED ARCHIVE
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-2">
            {wishlist.length} GARMENTS SAVED TO WISHLIST
          </p>
        </div>

        {!isLoggedIn && (
          <div className="p-3 bg-[#121212] border border-white/15 text-xs font-mono text-zinc-400 max-w-sm">
            <span>SAVED LOCALLY · </span>
            <Link href="/login" className="text-white underline hover:text-zinc-200">
              SIGN IN TO SYNC WISHLIST
            </Link>
          </div>
        )}
      </div>

      {/* Wishlist Grid */}
      {wishlist.length === 0 ? (
        <div className="py-24 text-center border border-white/10 bg-[#0c0c0c] p-8 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-zinc-600" />
          </div>
          <h2 className="font-gothic text-2xl text-zinc-200 mb-2">SAVE GARMENTS YOU LOVE</h2>
          <p className="text-xs font-mono text-zinc-500 mb-6">
            Tap the heart icon on any garment across the catalog to save it to your personal wishlist.
          </p>
          <Link
            href="/shop"
            className="clay-button-primary px-8 py-3.5 text-xs font-mono uppercase tracking-widest inline-flex items-center gap-2"
          >
            <span>EXPLORE GARMENTS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((product) => (
            <div key={product.id} className="relative flex flex-col justify-between">
              <ProductCard product={product} />
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleMoveToCart(product)}
                  className="flex-1 clay-button-primary py-2.5 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> MOVE TO BAG
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className="clay-button-secondary p-2.5 text-zinc-400 hover:text-red-400"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
