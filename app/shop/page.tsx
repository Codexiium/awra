"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { SlidersHorizontal, X, RefreshCw } from "lucide-react";
import ProductCard from "../components/ui/ProductCard";
import { mockProducts, mockCategories, mockCollections } from "../data/mockProducts";

type SortOption = "newest" | "price-low" | "price-high" | "best-selling" | "alphabetical";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCollection, setSelectedCollection] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];

    if (selectedCategory !== "all") {
      result = result.filter(
        (p) => p.category.toLowerCase().replace(/\s+/g, "-") === selectedCategory || p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedCollection !== "all") {
      result = result.filter(
        (p) => p.collection.toLowerCase().replace(/\s+/g, "-") === selectedCollection || p.collection.toLowerCase() === selectedCollection.toLowerCase()
      );
    }

    if (selectedSize !== "all") {
      result = result.filter((p) => p.sizes?.some((s) => s.size === selectedSize && s.available));
    }

    if (selectedColor !== "all") {
      result = result.filter((p) => p.colors?.some((c) => c.name.toLowerCase().includes(selectedColor.toLowerCase())));
    }

    // Sort Logic
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "best-selling") {
      result.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (sortBy === "alphabetical") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [selectedCategory, selectedCollection, selectedSize, selectedColor, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedCollection("all");
    setSelectedSize("all");
    setSelectedColor("all");
    setSortBy("newest");
  };

  const hasActiveFilters =
    selectedCategory !== "all" || selectedCollection !== "all" || selectedSize !== "all" || selectedColor !== "all";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">
          HOME
        </Link>
        <span>/</span>
        <span className="text-zinc-200">SHOP</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-white/10 mb-8">
        <div>
          <h1 className="font-gothic text-4xl sm:text-5xl text-white tracking-widest uppercase">
            ARCHIVAL GARMENTS
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-2">
            EXPLORE {filteredProducts.length} NOCTURNAL SILHOUETTES
          </p>
        </div>

        {/* Toolbar: Mobile filter trigger + Sort dropdown */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden clay-button-secondary px-4 py-2.5 text-xs font-mono uppercase tracking-wider flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" /> FILTERS
          </button>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-500 uppercase hidden sm:inline">SORT BY:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="clay-input px-3 py-2 text-xs font-mono uppercase cursor-pointer rounded-none"
            >
              <option value="newest">NEWEST ARRIVALS</option>
              <option value="price-low">PRICE: LOW TO HIGH</option>
              <option value="price-high">PRICE: HIGH TO LOW</option>
              <option value="best-selling">MOST WANTED</option>
              <option value="alphabetical">ALPHABETICAL</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applied Filter Chips Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-8 p-4 bg-[#101010] border border-white/10">
          <span className="text-xs font-mono text-zinc-400 uppercase mr-2">ACTIVE FILTERS:</span>
          {selectedCategory !== "all" && (
            <span className="clay-chip text-xs font-mono px-3 py-1 flex items-center gap-1.5 text-zinc-200">
              Category: {selectedCategory}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory("all")} />
            </span>
          )}
          {selectedCollection !== "all" && (
            <span className="clay-chip text-xs font-mono px-3 py-1 flex items-center gap-1.5 text-zinc-200">
              Collection: {selectedCollection}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCollection("all")} />
            </span>
          )}
          {selectedSize !== "all" && (
            <span className="clay-chip text-xs font-mono px-3 py-1 flex items-center gap-1.5 text-zinc-200">
              Size: {selectedSize}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedSize("all")} />
            </span>
          )}
          {selectedColor !== "all" && (
            <span className="clay-chip text-xs font-mono px-3 py-1 flex items-center gap-1.5 text-zinc-200">
              Color: {selectedColor}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedColor("all")} />
            </span>
          )}

          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs font-mono text-zinc-400 hover:text-white underline ml-auto"
          >
            CLEAR ALL
          </button>
        </div>
      )}

      {/* Main Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Desktop Filter Sidebar (PRD Section 9.2) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-8 pr-4 border-r border-white/10">
          {/* Category Group */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-200 mb-4 pb-1 border-b border-white/10 font-bold">
              CATEGORY
            </h3>
            <ul className="space-y-2 text-xs font-sans text-zinc-400">
              <li>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={`hover:text-white transition-colors ${selectedCategory === "all" ? "text-white font-bold" : ""}`}
                >
                  All Categories ({mockProducts.length})
                </button>
              </li>
              {mockCategories.map((cat) => (
                <li key={cat.slug}>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`hover:text-white transition-colors ${selectedCategory === cat.slug ? "text-white font-bold" : ""}`}
                  >
                    {cat.name} ({cat.count})
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Collection Group */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-200 mb-4 pb-1 border-b border-white/10 font-bold">
              COLLECTION
            </h3>
            <ul className="space-y-2 text-xs font-sans text-zinc-400">
              <li>
                <button
                  type="button"
                  onClick={() => setSelectedCollection("all")}
                  className={`hover:text-white transition-colors ${selectedCollection === "all" ? "text-white font-bold" : ""}`}
                >
                  All Collections
                </button>
              </li>
              {mockCollections.map((col) => (
                <li key={col.slug}>
                  <button
                    type="button"
                    onClick={() => setSelectedCollection(col.slug)}
                    className={`hover:text-white transition-colors ${selectedCollection === col.slug ? "text-white font-bold" : ""}`}
                  >
                    {col.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Size Selector Chips */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-200 mb-4 pb-1 border-b border-white/10 font-bold">
              SIZES
            </h3>
            <div className="flex flex-wrap gap-2">
              {["XS", "S", "M", "L", "XL"].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(selectedSize === sz ? "all" : sz)}
                  className={`clay-chip text-xs font-mono px-3 py-1.5 ${
                    selectedSize === sz ? "clay-chip-active text-white border-white/40" : ""
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color Swatch Filters */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-200 mb-4 pb-1 border-b border-white/10 font-bold">
              COLORS
            </h3>
            <div className="space-y-2 text-xs font-sans text-zinc-400">
              {["Obsidian", "Crimson", "Silver", "Charcoal"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(selectedColor === c.toLowerCase() ? "all" : c.toLowerCase())}
                  className={`block hover:text-white transition-colors ${
                    selectedColor === c.toLowerCase() ? "text-white font-bold" : ""
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Cards Grid */}
        <main className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center border border-white/10 bg-[#0c0c0c] p-8">
              <p className="font-gothic text-3xl text-zinc-300 mb-2">No matching garments</p>
              <p className="text-xs font-mono text-zinc-500 mb-6">
                Try clearing active category or size filters.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="clay-button-primary px-6 py-3 text-xs font-mono uppercase tracking-widest inline-flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" /> CLEAR FILTERS
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.slice(0, visibleCount).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More Pagination */}
              {visibleCount < filteredProducts.length && (
                <div className="mt-16 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 4)}
                    className="clay-button-secondary px-8 py-3.5 text-xs font-mono uppercase tracking-widest"
                  >
                    LOAD MORE GARMENTS ({filteredProducts.length - visibleCount} REMAINING)
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer (PRD 4.6) */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative bg-[#0d0d0d] border-t border-white/20 p-6 z-10 max-h-[85vh] overflow-y-auto space-y-6 animate-slide-up">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-mono text-sm uppercase tracking-widest text-white">FILTERS &amp; SORT</h3>
              <button type="button" onClick={() => setMobileFilterOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Size filter inside mobile drawer */}
            <div>
              <h4 className="text-xs font-mono text-zinc-400 mb-3">SIZES</h4>
              <div className="flex flex-wrap gap-2">
                {["XS", "S", "M", "L", "XL"].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(selectedSize === sz ? "all" : sz)}
                    className={`clay-chip text-xs font-mono px-3 py-1.5 ${
                      selectedSize === sz ? "clay-chip-active text-white" : ""
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="w-full clay-button-primary py-3.5 text-xs font-mono uppercase tracking-widest"
            >
              APPLY FILTERS ({filteredProducts.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
