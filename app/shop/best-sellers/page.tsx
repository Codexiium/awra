import Link from "next/link";
import ProductCard from "../../components/ui/ProductCard";
import { getProducts } from "@/lib/catalog";

export default async function BestSellersPage() {
  const bestSellers = (await getProducts({ sort: "best-selling" })).slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-white transition-colors">SHOP</Link>
        <span>/</span>
        <span className="text-zinc-200">BEST SELLERS</span>
      </nav>

      <div className="pb-8 border-b border-white/10 mb-8">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1">
          MOST WANTED ARCHIVE
        </span>
        <h1 className="font-gothic text-4xl sm:text-5xl text-white tracking-widest uppercase">
          BEST SELLERS
        </h1>
        <p className="text-xs text-zinc-400 font-mono mt-2">
          {bestSellers.length} MOST REQUESTED PIECES
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bestSellers.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
