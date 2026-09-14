import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import ProductImage from "./components/ui/ProductImage";
import ProductCard from "./components/ui/ProductCard";
import HeroEntrance from "./components/home/HeroEntrance";
import { getProducts, getCategories } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export default async function Home() {
  const [allProducts, categories] = await Promise.all([
    getProducts({ sort: "newest" }),
    getCategories()
  ]);

  const featuredProducts = allProducts.slice(0, 4);
  const bestSellerProducts = allProducts.slice(4, 8);

  return (
    <div className="w-full bg-[#080808]">
      {/* 1. HERO SECTION (PRD 8.1 #3) */}
      <section className="relative min-h-[85vh] flex items-center justify-center border-b border-white/10 overflow-hidden pt-12 pb-24">
        {/* Hero Background Placeholder & Subtle Radial Aura */}
        <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zinc-800/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Hero Background Architectural Grid Texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Asymmetric Left Text Block */}
          <HeroEntrance>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.04] border border-white/15 text-zinc-300 text-[11px] font-mono tracking-widest uppercase mb-6 rounded-none">
              <span className="text-zinc-400 font-gothic">✦</span>
              <span>DROP 04 — WINTER ARCHIVE 2026</span>
            </div>

            <h1 className="font-gothic text-5xl sm:text-7xl lg:text-8xl tracking-tight text-white leading-[0.9] mb-6">
              {/* Slogan*/}
              <br />
              <span className="text-zinc-400 italic font-cinzel">{/* Slogan */}</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-xl leading-relaxed mb-8">
              Floor-length technical canvas trench coats, 650 GSM double-walled spiky heavy hoodies, and hand-antiqued sterling silver hardware. Engineered without compromise.
            </p>

            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <Link
                href="/collections/nocturnal-disruption"
                className="clay-button-primary px-8 py-4 text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                <span>001</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/lookbook"
                className="clay-button-secondary px-8 py-4 text-xs font-mono uppercase tracking-widest text-center w-full sm:w-auto"
              >
                EXPLORE LOOKBOOK
              </Link>
            </div>
          </HeroEntrance>

          {/* Right Hero Image Card (PRD Section 3 Placeholder) */}
          <div className="lg:col-span-5 relative">
            <div className="relative p-2 bg-[#121212] border border-white/15 shadow-2xl">
              <ProductImage
                src={null}
                alt="Nocturnal Disruption Campaign Hero"
                aspectRatio="3:4"
                gothicSymbol="🕇"
                className="w-full"
              />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#080808]/90 border border-white/10 backdrop-blur-md">
                <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest">
                  FEATURED GARMENT
                </p>
                <p className="text-sm font-semibold text-zinc-100 font-sans">
                  CATHEDRAL OVERSIZED TRENCH
                </p>
                <p className="text-xs font-mono text-zinc-400 mt-1">{formatPrice(680)} · LIMITED 50 PIECES</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NEW COLLECTION EDITORIAL STATEMENT (PRD 8.1 #4) */}
      <section className="py-20 border-b border-white/10 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-[0.3em] block mb-3">
            ARCHIVAL MANIFESTO
          </span>
          <h2 className="font-cinzel text-2xl sm:text-4xl text-zinc-100 font-bold tracking-wider leading-snug mb-6">
            &quot;WHERE GOTHIC ARCHITECTURE MEETS TACTICAL REBELLION.&quot;
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-2xl mx-auto leading-relaxed mb-8">
            Every garment in Drop 04 is constructed with heavy 500-650 GSM cotton canvas, reinforced seams, and solid oxidized silver hardware meant to age with character over decades.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-300 hover:text-white border-b border-zinc-500 hover:border-white pb-1 transition-all"
          >
            <span>READ OUR BRAND PHILOSOPHY</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS GRID (PRD 8.1 #5) */}
      <section className="py-24 border-b border-white/10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1">
              CURATED SELECTION
            </span>
            <h2 className="font-gothic text-3xl sm:text-4xl tracking-wider text-white">
              FEATURED EDIT
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-mono text-zinc-400 hover:text-white uppercase tracking-widest flex items-center gap-1.5"
          >
            <span>VIEW ALL GARMENTS ({allProducts.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. VISUAL CATEGORY TILES (PRD 8.1 #6) */}
      <section className="py-24 border-b border-white/10 bg-[#060606]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-2">
              DISCOVER BY CATEGORY
            </span>
            <h2 className="font-gothic text-4xl text-white tracking-widest">
              ARCHIVAL TAXONOMY
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((cat, idx) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group relative block aspect-[3/4] bg-[#0f0f0f] border border-white/10 overflow-hidden hover:border-white/30 transition-all"
              >
                <ProductImage
                  src={null}
                  alt={cat.name}
                  aspectRatio="3:4"
                  gothicSymbol={idx % 2 === 0 ? "✦" : "🕇"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 flex flex-col justify-end">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1">
                    {cat.count} ITEMS
                  </span>
                  <h3 className="font-gothic text-2xl text-white tracking-wide group-hover:translate-x-1 transition-transform">
                    {cat.name}
                  </h3>
                  <span className="text-xs font-mono text-zinc-400 mt-2 flex items-center gap-1 group-hover:text-white">
                    EXPLORE <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. EDITORIAL CAMPAIGN SECTION (PRD 8.1 #7) */}
      <section className="py-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1 space-y-6">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block">
              EDITORIAL CAMPAIGN · LOOK 02
            </span>
            <h2 className="font-gothic text-4xl sm:text-5xl text-white leading-tight">
              HEAVYWEIGHT COTTON &amp; SPIKY HARDWARE
            </h2>
            <p className="text-sm text-zinc-400 font-sans leading-relaxed">
              Designed in NYC and constructed in Europe, the Nocturnal Heavy Hoodie features 650 GSM French Terry cotton with spiky metal drawstrings. Layered over wide-leg gabardine pleat trousers.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 font-mono text-xs text-zinc-300">
              <div>
                <span className="text-zinc-500 block">WEIGHT</span>
                <span className="font-bold">650 GSM ORGANIC COTTON</span>
              </div>
              <div>
                <span className="text-zinc-500 block">HARDWARE</span>
                <span className="font-bold">925 STERLING AG FINISH</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/product/nocturnal-spiky-heavy-hoodie"
                className="clay-button-primary px-8 py-3.5 text-xs font-mono uppercase tracking-widest inline-flex items-center gap-2"
              >
                <span>VIEW GARMENT DETAILS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="p-2 bg-[#121212] border border-white/15">
              <ProductImage
                src={null}
                alt="Editorial Campaign Look"
                aspectRatio="4:5"
                gothicSymbol="✦"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. BEST SELLERS GRID (PRD 8.1 #9) */}
      <section className="py-24 border-b border-white/10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-2">
            MOST WANTED
          </span>
          <h2 className="font-gothic text-4xl text-white tracking-widest">
            BEST SELLERS
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. PROMOTIONAL BANNER (PRD 8.1 #10) */}
      <section className="py-16 border-b border-white/10 bg-gradient-to-r from-[#0d0d0d] via-[#161616] to-[#0d0d0d] text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-[0.3em] block mb-2">
            GLOBAL LOGISTICS
          </span>
          <h3 className="font-gothic text-3xl sm:text-4xl text-white mb-4">
            COMPLIMENTARY EXPRESS SHIPPING OVER {formatPrice(250)}
          </h3>
          <p className="text-xs text-zinc-400 font-sans max-w-lg mx-auto mb-6">
            All orders are shipped via express DHL air freight in custom matte black collector box packaging with metallic seal certificate.
          </p>
          <Link
            href="/shipping-delivery"
            className="clay-button-secondary px-6 py-3 text-xs font-mono uppercase tracking-widest inline-flex items-center gap-2"
          >
            <span>SHIPPING INFO &amp; RETURNS</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
