"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Check, Ruler, Star } from "lucide-react";
import ProductImage from "../../components/ui/ProductImage";
import ProductCard from "../../components/ui/ProductCard";
import SizeGuideModal from "../../components/ui/SizeGuideModal";
import { useCartStore } from "../../store/useCartStore";
import { useWishlistStore } from "../../store/useWishlistStore";
import { formatPrice } from "@/lib/format";
import type { Product, ProductImageAsset } from "../../types";

type SpecTab = "description" | "details" | "shipping" | "reviews";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const router = useRouter();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes?.find((s) => s.available)?.size || "M"
  );
  // No customer-facing color selection — each variant row still tracks its
  // own color/stock internally, so default to the product's first color.
  const selectedColor = product.colors?.[0]?.name || "Obsidian Black";
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<SpecTab>("description");

  const { addItem } = useCartStore();
  const { wishlist, toggleWishlist } = useWishlistStore();

  const isSaved = wishlist.some((item) => item.id === product.id);
  const isOutOfStock = product.availability === "out_of_stock";

  // Gallery array
  const galleryImages: ProductImageAsset[] = [
    product.images?.primary,
    product.images?.secondary,
    ...(product.images?.gallery || [])
  ].filter((img): img is ProductImageAsset => Boolean(img));

  const activeImage = galleryImages[selectedImageIndex] || product.images?.primary;

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, selectedSize, selectedColor, quantity);
    router.push("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-white transition-colors">SHOP</Link>
        <span>/</span>
        <span className="text-zinc-200 line-clamp-1">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
        {/* Left Gallery Section (PRD 11.2) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Vertical Thumbnail Rail (Desktop) */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shrink-0 md:w-20">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-16 h-20 md:w-20 md:h-24 border transition-all ${
                  selectedImageIndex === idx ? "border-white scale-105" : "border-white/10 opacity-60 hover:opacity-100"
                }`}
              >
                <ProductImage src={img?.src} alt={img?.alt || "Thumbnail"} aspectRatio="3:4" />
              </button>
            ))}
          </div>

          {/* Main Large Image Canvas (3:4 Ratio) */}
          <div className="flex-1 border border-white/15 bg-[#121212] overflow-hidden relative">
            <ProductImage
              src={activeImage?.src}
              alt={activeImage?.alt || product.name}
              aspectRatio="3:4"
              className="w-full h-full object-cover"
            />
            {product.badges?.[0] && (
              <span className="absolute top-4 left-4 clay-chip text-xs font-mono uppercase tracking-widest px-3 py-1 text-zinc-200">
                {product.badges[0]}
              </span>
            )}
          </div>
        </div>

        {/* Right Product Info Panel (PRD 11.3) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div>
            {/* Rating */}
            <div className="flex items-center justify-end text-xs font-mono text-zinc-500 mb-2">
              <div className="flex items-center gap-1 text-zinc-300">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-zinc-500">({product.reviewCount})</span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="font-gothic text-3xl sm:text-4xl text-white tracking-wide uppercase leading-tight mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-white/10">
              <span className="text-2xl font-mono font-bold text-white">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-base font-mono text-zinc-500 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              <span
                className={`text-xs font-mono ml-auto uppercase ${
                  product.availability === "out_of_stock"
                    ? "text-red-400"
                    : product.availability === "low_stock"
                    ? "text-amber-400"
                    : "text-emerald-400"
                }`}
              >
                {product.availability === "out_of_stock"
                  ? "OUT OF STOCK"
                  : product.availability === "low_stock"
                  ? "LOW STOCK"
                  : "IN STOCK · READY TO SHIP"}
              </span>
            </div>

            {/* Description Paragraph */}
            <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Size Selector Grid Chips (PRD 11.3) */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest mb-2">
                <span className="text-zinc-400">SELECT SIZE</span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-zinc-300 hover:text-white flex items-center gap-1 underline"
                >
                  <Ruler className="w-3.5 h-3.5" /> SIZE GUIDE
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {product.sizes?.map((s) => (
                  <button
                    key={s.size}
                    type="button"
                    disabled={!s.available}
                    onClick={() => setSelectedSize(s.size)}
                    className={`py-3 text-xs font-mono uppercase border transition-all ${
                      !s.available
                        ? "opacity-30 line-through border-white/5 cursor-not-allowed bg-black"
                        : selectedSize === s.size
                        ? "clay-button-primary text-black font-bold border-white"
                        : "clay-button-secondary text-zinc-200"
                    }`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper & CTAs */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-white/20 bg-[#121212] px-3 py-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="text-zinc-400 hover:text-white text-sm font-mono px-2"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-mono font-bold text-white">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="text-zinc-400 hover:text-white text-sm font-mono px-2"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  aria-label="Save to Wishlist"
                  className={`flex-1 clay-button-secondary py-3.5 px-4 text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 ${
                    isSaved ? "text-red-400 border-red-500/40" : ""
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? "fill-red-500" : ""}`} />
                  <span>{isSaved ? "SAVED" : "ADD TO WISHLIST"}</span>
                </button>
              </div>

              {/* Primary Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full clay-button-primary py-4 text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isOutOfStock ? (
                  "OUT OF STOCK"
                ) : added ? (
                  <>
                    <Check className="w-4 h-4" /> ADDED TO BAG
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> ADD TO BAG — {formatPrice(product.price * quantity)}
                  </>
                )}
              </button>

              {/* Secondary Buy Now */}
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full clay-button-secondary py-3.5 text-xs font-mono uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              >
                BUY NOW (EXPRESS CHECKOUT)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Specification Tabs (PRD 11.5) */}
      <div className="mb-24 border-t border-white/10 pt-12">
        <div className="flex items-center gap-8 border-b border-white/10 text-xs font-mono tracking-widest uppercase mb-8 overflow-x-auto">
          {(["description", "details", "shipping", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`pb-4 border-b-2 font-bold transition-all ${
                activeTab === tab ? "border-white text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="max-w-3xl text-xs sm:text-sm font-sans leading-relaxed text-zinc-300">
          {activeTab === "description" && (
            <div className="space-y-4">
              <p>{product.description}</p>
              <p>
                Engineered with heavy organic cotton canvas, architectural floor-sweeping silhouettes, and custom oxidized silver metal hardware. Hand-distressed in limited drop batches.
              </p>
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-3 font-mono text-xs text-zinc-300">
              <p><strong className="text-white">MATERIAL:</strong> {product.details?.material}</p>
              <p><strong className="text-white">FIT:</strong> {product.details?.fit}</p>
              <p><strong className="text-white">CARE:</strong> {product.details?.care}</p>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-3 font-mono text-xs text-zinc-300">
              <p>All orders are dispatched within 24 hours.</p>
              <p>Express Air Freight: 2–4 Business Days ({formatPrice(25)} or Free over {formatPrice(250)}).</p>
              <p>Returns: 30-day complimentary return window with pre-paid return labels included.</p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6 font-sans">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h4 className="font-gothic text-xl text-white">CLIENT REVIEWS ({product.reviewCount})</h4>
                  <p className="text-xs font-mono text-zinc-400">RATED 4.9/5 BY ARCHIVAL COLLECTORS</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[#121212] border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span className="text-white font-bold">VANCE K.</span>
                    <span>VERIFIED BUYER</span>
                  </div>
                  <div className="flex text-amber-400 text-xs">★★★★★</div>
                  <p className="text-xs text-zinc-300">
                    &quot;The weight of the cotton canvas is unmatched. Floor length drape feels extremely high-fashion.&quot;
                  </p>
                </div>

                <div className="p-4 bg-[#121212] border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span className="text-white font-bold">AURA M.</span>
                    <span>VERIFIED BUYER</span>
                  </div>
                  <div className="flex text-amber-400 text-xs">★★★★★</div>
                  <p className="text-xs text-zinc-300">
                    &quot;Silver spiky hardware detail is unreal. Worth every cent.&quot;
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-white/10 pt-16">
          <h3 className="font-gothic text-3xl text-white tracking-widest mb-8 uppercase">
            COMPLETING THE LOOK
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
}
