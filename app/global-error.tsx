"use client";

import { useEffect } from "react";

// Only fires if the root layout itself throws (rare now that
// getAllProductsForNav degrades to [] instead of throwing — see
// lib/catalog.ts). Must render its own <html>/<body>: it replaces the root
// layout entirely when triggered, so none of app/layout.tsx's providers or
// styling are available here.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Unhandled root layout error", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-[#080808] text-[#f5f5f5] font-sans">
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold tracking-widest uppercase mb-2">SOMETHING WENT WRONG</h1>
          <p className="text-xs font-mono text-zinc-500 mb-6">
            The site hit an unexpected error. It&apos;s been logged — try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            className="px-6 py-3 text-xs font-mono uppercase border border-white/40 hover:bg-white hover:text-black transition-colors"
          >
            TRY AGAIN
          </button>
        </div>
      </body>
    </html>
  );
}
