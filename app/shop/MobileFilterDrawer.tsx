"use client";

import { useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";

interface MobileFilterDrawerProps {
  sizes: string[];
  selectedSize: string;
  sizeHrefs: Record<string, string>;
  resultCount: number;
}

export default function MobileFilterDrawer({ sizes, selectedSize, sizeHrefs, resultCount }: MobileFilterDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden clay-button-secondary px-4 py-2.5 text-xs font-mono uppercase tracking-wider flex items-center gap-2"
      >
        <SlidersHorizontal className="w-4 h-4" /> FILTERS
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-[#0d0d0d] border-t border-white/20 p-6 z-10 max-h-[85vh] overflow-y-auto space-y-6 animate-slide-up">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-mono text-sm uppercase tracking-widest text-white">FILTERS &amp; SORT</h3>
              <button type="button" onClick={() => setOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h4 className="text-xs font-mono text-zinc-400 mb-3">SIZES</h4>
              <div className="flex flex-wrap gap-2">
                {sizes.map((sz) => (
                  <Link
                    key={sz}
                    href={sizeHrefs[sz]}
                    className={`clay-chip text-xs font-mono px-3 py-1.5 ${
                      selectedSize === sz ? "clay-chip-active text-white" : ""
                    }`}
                  >
                    {sz}
                  </Link>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full clay-button-primary py-3.5 text-xs font-mono uppercase tracking-widest"
            >
              APPLY FILTERS ({resultCount})
            </button>
          </div>
        </div>
      )}
    </>
  );
}
