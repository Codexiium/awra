import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import ProductImage from "./components/ui/ProductImage";
import ProductCard from "./components/ui/ProductCard";
import HeroEntrance from "./components/home/HeroEntrance";
import { getProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export default async function Home() {
  const allProducts = await getProducts({ sort: "newest" });

  const featuredProducts = allProducts;
  const bestSellerProducts = [...allProducts].sort((a, b) => b.reviewCount - a.reviewCount);

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

            <h1 className="font-gothic text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.05] mb-6">
              ONE BRAND.
              <br />
              <span className="text-zinc-400 italic font-cinzel">EVERY SUBCULTURE</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-xl leading-relaxed mb-2">
              From oversized street staples to gothic edge
            </p>
            <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-xl leading-relaxed mb-2">
              Premium fabrics | Unfiltered style
            </p>
            <p className="text-sm sm:text-base text-zinc-300 font-sans max-w-xl leading-relaxed mb-8">
              📍 Made to stand out.
            </p>

            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <Link
                href="/shop"
                className="clay-button-primary px-8 py-4 text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                <span>🔗 Explore the catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/lookbook"
                className="clay-button-secondary px-8 py-4 text-xs font-mono uppercase tracking-widest text-center w-full sm:w-auto"
              >
                EXPLORE LOOKBOOK
              </Link>
            </div>

            <a
              href="tel:7439104842"
              className="mt-6 text-xs font-mono text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              📞 CALL / WHATSAPP: +91 74391 04842
            </a>
          </HeroEntrance>

          {/* Right Hero Image Card (PRD Section 3 Placeholder) */}
          <div className="lg:col-span-5 relative">
            <div className="relative p-2 bg-[#121212] border border-white/15 shadow-2xl">
              <ProductImage
                src={null}
                alt="ARWA Campaign Hero"
                aspectRatio="3:4"
                gothicSymbol="🕇"
                className="w-full"
              />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#080808]/90 border border-white/10 backdrop-blur-md">
                <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest">
                  FEATURED GARMENT
                </p>
                <p className="text-sm font-semibold text-zinc-100 font-sans">
                  {allProducts[0]?.name ?? "001"}
                </p>
                <p className="text-xs font-mono text-zinc-400 mt-1">
                  {formatPrice(allProducts[0]?.price ?? 0)} · LIMITED PIECES
                </p>
              </div>
            </div>
          </div>
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
            All orders are shipped via express air freight.
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
