import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <nav className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-zinc-200">MANIFESTO</span>
      </nav>

      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-[0.3em] block">
          BRAND MANIFESTO
        </span>
        <h1 className="font-gothic text-4xl sm:text-6xl text-white tracking-widest uppercase">
          REBELLIOUS ARCHITECTURE
        </h1>
        <p className="text-sm text-zinc-400 font-sans leading-relaxed">
          ARWA was founded to bridge the gap between ancient gothic architectural geometry and high-platform tactical streetwear.
        </p>
      </div>

      <div className="relative p-12 bg-[#0d0d0d] border border-white/15 space-y-8 font-sans text-sm text-zinc-300 leading-relaxed overflow-hidden">
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="relative w-96 h-96">
            <Image src="/Pasted image.png" alt="ARWA Watermark" fill className="object-contain" />
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="font-cinzel text-2xl text-white font-bold tracking-wider">
            I. HEAVYWEIGHT SILHOUETTES &amp; RAW MATERIALS
          </h2>
          <p>
            We reject thin, disposable clothing. Every ARWA garment uses custom-milled 500 to 650 GSM organic cotton, gabardine wools, or coated technical canvas designed to withstand decades of wear.
          </p>

          <h2 className="font-cinzel text-2xl text-white font-bold tracking-wider pt-6">
            II. ARCHIVAL SILVER HARDWARE
          </h2>
          <p>
            Our metal fittings — zippers, spiky drawstrings, O-rings, and signet jewelry — are hand-cast in solid 925 sterling silver with an oxidized vintage patina.
          </p>

          <h2 className="font-cinzel text-2xl text-white font-bold tracking-wider pt-6">
            III. LIMITED ARCHIVAL DROPS
          </h2>
          <p>
            We do not overproduce. Each collection is released in numbered batches of 50 to 200 pieces globally. Once an archive is sold out, it is retired permanently.
          </p>
        </div>
      </div>
    </div>
  );
}
