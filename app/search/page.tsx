import Link from "next/link";
import { Search } from "lucide-react";
import ProductCard from "../components/ui/ProductCard";
import { searchProducts } from "@/lib/catalog";

export default async function SearchResultsPage(props: PageProps<"/search">) {
  const resolvedSearchParams = await props.searchParams;
  const queryParam = resolvedSearchParams.q;
  const query = Array.isArray(queryParam) ? queryParam[0] || "" : queryParam || "";

  const searchResults = await searchProducts(query);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-zinc-200">SEARCH</span>
      </nav>

      <div className="pb-8 border-b border-white/10 mb-12">
        <h1 className="font-gothic text-4xl sm:text-5xl text-white tracking-widest uppercase mb-6">
          SEARCH RESULTS
        </h1>

        {/* Input box */}
        <form action="/search" method="GET" className="max-w-xl flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-3.5" />
            <input
              type="text"
              name="q"
              key={query}
              defaultValue={query}
              placeholder="SEARCH CATALOG..."
              className="clay-input w-full pl-11 pr-4 py-3 text-xs font-mono uppercase text-white"
            />
          </div>
          <button type="submit" className="clay-button-primary px-6 py-3 text-xs font-mono uppercase">
            SEARCH
          </button>
        </form>
      </div>

      <div>
        <p className="text-xs font-mono text-zinc-400 mb-8 uppercase">
          FOUND {searchResults.length} GARMENTS MATCHING &quot;{query}&quot;
        </p>

        {searchResults.length === 0 ? (
          <div className="py-24 text-center border border-white/10 bg-[#0c0c0c] p-8 max-w-xl mx-auto">
            <p className="font-gothic text-2xl text-zinc-300 mb-2">NO GARMENTS FOUND</p>
            <p className="text-xs font-mono text-zinc-500 mb-6">
              Try searching for &quot;Trench&quot;, &quot;Hoodie&quot;, &quot;Cargo&quot;, or &quot;Silver&quot;.
            </p>
            <Link href="/shop" className="clay-button-primary px-6 py-3 text-xs font-mono uppercase">
              VIEW ALL GARMENTS
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
