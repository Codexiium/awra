import Link from "next/link";
import ProductImage from "../components/ui/ProductImage";
import { mockCollections } from "../data/mockProducts";
import { ArrowRight } from "lucide-react";

export default function CollectionsIndexPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-zinc-200">COLLECTIONS</span>
      </nav>

      <div className="pb-8 border-b border-white/10 mb-12">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1">
          ARCHIVAL DIRECTORY
        </span>
        <h1 className="font-gothic text-4xl sm:text-6xl text-white tracking-widest uppercase">
          CURATED COLLECTIONS
        </h1>
        <p className="text-xs text-zinc-400 font-mono mt-2">
          EXPLORE THE FOUR CONCEPTUAL CHAPTERS OF ARWA
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {mockCollections.map((col, idx) => (
          <Link
            key={col.slug}
            href={`/collections/${col.slug}`}
            className="group relative bg-[#0e0e0e] border border-white/10 overflow-hidden hover:border-white/30 transition-all flex flex-col justify-between p-6 sm:p-8"
          >
            <ProductImage
              src={null}
              alt={col.title}
              aspectRatio="16:9"
              gothicSymbol={idx % 2 === 0 ? "✦" : "🕇"}
              className="mb-6"
            />

            <div>
              <span className="text-[10px] font-mono text-zinc-500 tracking-widest block mb-1">
                {col.subtitle}
              </span>
              <h2 className="font-gothic text-3xl text-white tracking-wider mb-3 group-hover:text-zinc-200 transition-colors">
                {col.title}
              </h2>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-6">
                {col.description}
              </p>
              <span className="clay-button-primary py-2.5 px-5 text-xs font-mono uppercase tracking-widest inline-flex items-center gap-2">
                VIEW COLLECTION <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
