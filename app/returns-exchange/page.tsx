import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns & Exchange",
  description: "ARWA's returns and exchange policy."
};

export default function ReturnsExchangePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-zinc-200">RETURNS &amp; EXCHANGES</span>
      </nav>

      <div className="pb-8 border-b border-white/10 mb-8">
        <h1 className="font-gothic text-4xl sm:text-5xl text-white tracking-widest uppercase">
          RETURNS &amp; EXCHANGES
        </h1>
      </div>

      <div className="p-8 bg-[#0f0f0f] border border-white/10 space-y-6 font-mono text-xs text-zinc-300 leading-relaxed">
        <h3 className="text-white font-bold text-sm border-b border-white/10 pb-2">30-DAY COMPLIMENTARY POLICY</h3>
        <p>If your garment does not fit as intended, ARWA provides a 30-day window for returns or size exchanges.</p>
        <p><strong className="text-white">CONDITION REQUIREMENTS:</strong> Items must remain unworn with security ribbon intact.</p>
        <p><strong className="text-white">PRE-PAID LABELS:</strong> Contact concierge@arwawear.com to receive a printable return label.</p>
      </div>
    </div>
  );
}
