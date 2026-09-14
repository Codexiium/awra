"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowUpRight, Sparkles } from "lucide-react";
import { useSearchStore } from "@/app/store/useSearchStore";
import ProductCard from "../ui/ProductCard";
import type { Product } from "@/app/types";

interface SearchOverlayProps {
  products: Product[];
}

export default function SearchOverlay({ products }: SearchOverlayProps) {
  const router = useRouter();
  const { isOpen, query, closeSearch, setQuery, recentSearches, addRecentSearch } = useSearchStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    addRecentSearch(query.trim());
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    closeSearch();
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    addRecentSearch(tag);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#080808]/95 backdrop-blur-xl animate-fade-in overflow-y-auto">
      {/* Search Header Bar */}
      <div className="sticky top-0 z-10 bg-[#0a0a0a] border-b border-white/15 px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-3">
            <Search className="w-6 h-6 text-zinc-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH NOCTURNAL ARCHIVE..."
              className="w-full bg-transparent text-lg sm:text-2xl font-mono uppercase text-white placeholder:text-zinc-600 focus:outline-none"
            />
          </form>

          <button
            type="button"
            onClick={closeSearch}
            aria-label="Close search overlay"
            className="p-2 text-zinc-400 hover:text-white transition-colors clay-button-secondary rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto w-full px-6 py-8 flex-1">
        {/* Recent & Suggested Tags */}
        {!query && (
          <div className="space-y-8 animate-fade-in max-w-2xl">
            {recentSearches.length > 0 && (
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">
                  RECENT SEARCHES
                </h4>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleTagClick(term)}
                      className="clay-chip text-xs font-mono px-3.5 py-1.5 flex items-center gap-1.5 hover:text-white"
                    >
                      <span>{term}</span>
                      <ArrowUpRight className="w-3 h-3 text-zinc-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-zinc-400" /> POPULAR SEARCHES
              </h4>
              <div className="flex flex-wrap gap-2">
                {["Cathedral Trench", "Spiky Heavy Hoodie", "Cargo Pants", "Sterling Silver Ring", "Platform Boots"].map(
                  (term, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleTagClick(term)}
                      className="clay-chip text-xs font-mono px-3.5 py-1.5 hover:text-white"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Live Search Results Grid */}
        {query && (
          <div>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10">
              <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                SEARCH RESULTS FOR &quot;<span className="text-white">{query}</span>&quot; ({filteredProducts.length})
              </h4>
              {filteredProducts.length > 0 && (
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={closeSearch}
                  className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1"
                >
                  VIEW ALL RESULTS ({filteredProducts.length}) <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center">
                <p className="font-gothic text-2xl text-zinc-300 mb-2">No garments found</p>
                <p className="text-xs text-zinc-500 font-mono">
                  Try searching for &quot;Trench&quot;, &quot;Hoodie&quot;, &quot;Cargo&quot;, or &quot;Silver&quot;.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.slice(0, 4).map((product) => (
                  <div key={product.id} onClick={closeSearch}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
