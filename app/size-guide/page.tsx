"use client";

import Link from "next/link";
import SizeGuideModal from "../components/ui/SizeGuideModal";

export default function SizeGuideStandalonePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-zinc-200">SIZE GUIDE</span>
      </nav>

      <div className="pb-8 border-b border-white/10 mb-8">
        <h1 className="font-gothic text-4xl sm:text-5xl text-white tracking-widest uppercase">
          ARCHITECTURAL SIZE GUIDE
        </h1>
        <p className="text-xs text-zinc-400 font-mono mt-2">
          GARMENT SILHOUETTE PROPORTIONS &amp; MEASUREMENTS
        </p>
      </div>

      <div className="p-6 bg-[#0f0f0f] border border-white/10">
        <SizeGuideModal isOpen={true} onClose={() => {}} />
      </div>
    </div>
  );
}
