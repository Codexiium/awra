import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description: "About ARWA — dark gothic streetwear."
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <nav className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-zinc-200">ABOUT</span>
      </nav>

      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-[0.3em] block">
          ABOUT ARWA
        </span>
        <h1 className="font-gothic text-4xl sm:text-6xl text-white tracking-widest uppercase">
          REBELLIOUS ARCHITECTURE
        </h1>
        <p className="text-sm text-zinc-400 font-sans leading-relaxed">
          ARWA is a dark-gothic streetwear label built on one idea: garments should carry the weight and geometry of gothic architecture, cut for the way people actually move and dress today.
        </p>
      </div>

      <div className="relative p-12 bg-[#0d0d0d] border border-white/15 space-y-8 font-sans text-sm text-zinc-300 leading-relaxed overflow-hidden">
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="relative w-96 h-96">
            <Image src="/logo.png" alt="ARWA Watermark" fill sizes="384px" className="object-contain" />
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="font-cinzel text-2xl text-white font-bold tracking-wider">
            WHAT WE MAKE
          </h2>
          <p>
            We reject thin, disposable clothing. Every ARWA garment is cut from heavyweight organic cotton, gabardine wool, or coated technical canvas — built to hold its shape and outlast trend cycles, not one season.
          </p>

          <h2 className="font-cinzel text-2xl text-white font-bold tracking-wider pt-6">
            HARDWARE &amp; DETAILING
          </h2>
          <p>
            Zippers, drawstrings, and buckles are finished in oxidized silver-tone hardware with a deliberate aged patina — chosen to look like it has already lived a decade, not like it just left the factory.
          </p>

          <h2 className="font-cinzel text-2xl text-white font-bold tracking-wider pt-6">
            LIMITED, NUMBERED PIECES
          </h2>
          <p>
            We don&apos;t overproduce. Every piece in the archive is a numbered product, released in limited quantities, and once a piece sells out it stays retired rather than being restocked indefinitely.
          </p>

          <h2 className="font-cinzel text-2xl text-white font-bold tracking-wider pt-6">
            GET IN TOUCH
          </h2>
          <p>
            Questions about sizing, an order, or a custom request — reach us through{" "}
            <Link href="/contact" className="text-white underline hover:text-zinc-300">
              Concierge &amp; Inquiries
            </Link>{" "}
            or call/WhatsApp{" "}
            <a href="tel:+917439104842" className="text-white underline hover:text-zinc-300">
              +91 74391 04842
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
