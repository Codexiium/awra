import Link from "next/link";
import ProductCard from "../../components/ui/ProductCard";
import { getProducts } from "@/lib/catalog";

export default async function NewArrivalsPage() {
  const allProducts = await getProducts({ sort: "newest" });
  const newArrivals = allProducts.filter((p) => p.badges?.includes("new"));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-white transition-colors">SHOP</Link>
        <span>/</span>
        <span className="text-zinc-200">NEW ARRIVALS</span>
      </nav>

      <div className="pb-8 border-b border-white/10 mb-8">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1">
          DROP 04 RELEASE
        </span>
        <h1 className="font-gothic text-4xl sm:text-5xl text-white tracking-widest uppercase">
          NEW ARRIVALS
        </h1>
        <p className="text-xs text-zinc-400 font-mono mt-2">
          {newArrivals.length} RECENTLY UNVEILED SILHOUETTES
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {newArrivals.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
