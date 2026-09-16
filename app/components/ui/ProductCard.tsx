"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Check } from "lucide-react";
import ProductImage from "./ProductImage";
import { useWishlistStore } from "@/app/store/useWishlistStore";
import { useCartStore } from "@/app/store/useCartStore";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/app/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [addedQuick, setAddedQuick] = useState(false);

  const { wishlist, toggleWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const isSaved = wishlist.some((item) => item.id === product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const isOutOfStock = product.availability === "out_of_stock";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    // Default to first available size
    const availableSizeObj = product.sizes?.find((s) => s.available) || { size: "M", available: true };
    const defaultColor = product.colors?.[0]?.name || "Obsidian Black";

    addItem(product, availableSizeObj.size, defaultColor, 1);
    setAddedQuick(true);
    setTimeout(() => setAddedQuick(false), 1800);
  };

  const primaryBadge = product.badges?.[0];

  return (
    <div
      className="group relative flex flex-col w-full bg-[#0d0d0d] border border-white/5 hover:border-white/20 transition-all duration-300 rounded-none overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Box */}
      <Link href={`/product/${product.slug}`} className="relative block w-full overflow-hidden">
        <ProductImage
          src={isHovered ? product.images?.secondary?.src || product.images?.primary?.src : product.images?.primary?.src}
          alt={product.name}
          aspectRatio="4:5"
          className="transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
          {primaryBadge && (
            <span className="clay-chip text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 text-zinc-200">
              {primaryBadge}
            </span>
          )}
          {product.availability === "low_stock" && (
            <span className="bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[9px] uppercase font-mono tracking-widest px-2 py-0.5">
              Low Stock
            </span>
          )}
          {product.availability === "out_of_stock" && (
            <span className="bg-red-950/80 border border-red-500/40 text-red-300 text-[9px] uppercase font-mono tracking-widest px-2 py-0.5">
              Out of Stock
            </span>
          )}
        </div>

        {/* Top Right Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${
            isSaved
              ? "bg-red-950/90 border border-red-500/50 text-red-400 scale-105"
              : "clay-button-secondary text-zinc-400 hover:text-white opacity-90 group-hover:opacity-100"
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
        </button>

        {/* Hover Quick Add Bar (Desktop) */}
        <div
          className={`absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent transition-all duration-300 flex items-center justify-between z-10 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none md:pointer-events-none"
          }`}
        >
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="w-full clay-button-primary py-2 px-3 text-xs uppercase font-mono tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isOutOfStock ? (
              "Out of Stock"
            ) : addedQuick ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added to Bag
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-[#0e0e0e]">
        <div>
          {/* Title */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors line-clamp-1 tracking-wide mb-1 font-sans">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Sizes */}
        <div className="mt-3 pt-2 border-t border-white/5 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-mono font-medium text-zinc-100">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs font-mono text-zinc-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Persistent size indicators */}
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            {product.sizes?.filter((s) => s.available).map((s) => s.size).join(" · ")}
          </div>
        </div>
      </div>
    </div>
  );
}
