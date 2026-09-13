"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ChevronDown } from "lucide-react";
import { mockCategories, mockCollections } from "@/app/data/mockProducts";

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xs bg-[#0a0a0a] border-r border-white/15 h-full flex flex-col justify-between p-6 z-10 shadow-2xl overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
            <Link href="/" onClick={onClose} className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-full border border-white/20 p-0.5 bg-black">
                <Image src="/Pasted image.png" alt="ARWA Logo" fill className="object-contain" />
              </div>
              <span className="font-gothic text-xl tracking-widest text-white">ARWA</span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items Accordion */}
          <nav className="space-y-4 font-mono text-sm uppercase tracking-wider text-zinc-300">
            <div>
              <Link href="/shop" onClick={onClose} className="block py-2 hover:text-white">
                SHOP ALL
              </Link>
            </div>

            {/* Categories Accordion */}
            <div className="border-t border-white/5 pt-3">
              <button
                type="button"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="w-full flex items-center justify-between py-2 text-left hover:text-white"
              >
                <span>CATEGORIES</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${categoriesOpen ? "rotate-180" : ""}`} />
              </button>
              {categoriesOpen && (
                <div className="pl-4 py-2 space-y-2 text-xs font-sans normal-case text-zinc-400">
                  {mockCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      onClick={onClose}
                      className="block py-1 hover:text-white"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Collections Accordion */}
            <div className="border-t border-white/5 pt-3">
              <button
                type="button"
                onClick={() => setCollectionsOpen(!collectionsOpen)}
                className="w-full flex items-center justify-between py-2 text-left hover:text-white"
              >
                <span>COLLECTIONS</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${collectionsOpen ? "rotate-180" : ""}`} />
              </button>
              {collectionsOpen && (
                <div className="pl-4 py-2 space-y-2 text-xs font-sans normal-case text-zinc-400">
                  {mockCollections.map((col) => (
                    <Link
                      key={col.slug}
                      href={`/collections/${col.slug}`}
                      onClick={onClose}
                      className="block py-1 hover:text-white"
                    >
                      {col.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-white/5 pt-3">
              <Link href="/shop/new-arrivals" onClick={onClose} className="block py-2 hover:text-white">
                NEW ARRIVALS
              </Link>
            </div>

            <div>
              <Link href="/lookbook" onClick={onClose} className="block py-2 hover:text-white">
                LOOKBOOK
              </Link>
            </div>

            <div>
              <Link href="/about" onClick={onClose} className="block py-2 hover:text-white">
                MANIFESTO
              </Link>
            </div>
          </nav>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-white/10 text-xs text-zinc-500 font-mono space-y-2">
          <p>© 2026 ARWA ARCHIVE</p>
          <p className="text-[10px]">ALL RIGHTS RESERVED</p>
        </div>
      </div>
    </div>
  );
}
