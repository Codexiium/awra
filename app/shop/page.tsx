import Link from "next/link";
import { X, RefreshCw } from "lucide-react";
import ProductCard from "../components/ui/ProductCard";
import SortSelect from "./SortSelect";
import MobileFilterDrawer from "./MobileFilterDrawer";
import { getProducts, getDistinctSizesAndColors } from "@/lib/catalog";

type SortOption = "newest" | "price-low" | "price-high" | "best-selling" | "alphabetical";

interface FilterOverrides {
  size?: string;
  sort?: string;
}

function firstParam(param: string | string[] | undefined): string | undefined {
  return Array.isArray(param) ? param[0] : param;
}

export default async function ShopPage(props: PageProps<"/shop">) {
  const sp = await props.searchParams;
  const selectedSize = firstParam(sp.size) ?? "all";
  const sortBy = (firstParam(sp.sort) as SortOption) ?? "newest";

  const [products, { sizes }] = await Promise.all([
    getProducts({
      size: selectedSize !== "all" ? selectedSize : undefined,
      sort: sortBy
    }),
    getDistinctSizesAndColors()
  ]);

  function buildHref(overrides: FilterOverrides) {
    const next = {
      size: selectedSize,
      sort: sortBy,
      ...overrides
    };
    const params = new URLSearchParams();
    if (next.size && next.size !== "all") params.set("size", next.size);
    if (next.sort && next.sort !== "newest") params.set("sort", next.sort);
    const qs = params.toString();
    return qs ? `/shop?${qs}` : "/shop";
  }

  const hasActiveFilters = selectedSize !== "all";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">
          HOME
        </Link>
        <span>/</span>
        <span className="text-zinc-200">SHOP</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-white/10 mb-8">
        <div>
          <h1 className="font-gothic text-4xl sm:text-5xl text-white tracking-widest uppercase">
            ARCHIVAL GARMENTS
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-2">
            EXPLORE {products.length} NOCTURNAL SILHOUETTES
          </p>
        </div>

        {/* Toolbar: Mobile filter trigger + Sort dropdown */}
        <div className="flex items-center gap-4">
          <MobileFilterDrawer
            sizes={sizes}
            selectedSize={selectedSize}
            sizeHrefs={Object.fromEntries(sizes.map((sz) => [sz, buildHref({ size: selectedSize === sz ? undefined : sz })]))}
            resultCount={products.length}
          />

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-500 uppercase hidden sm:inline">SORT BY:</span>
            <SortSelect value={sortBy} />
          </div>
        </div>
      </div>

      {/* Applied Filter Chips Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-8 p-4 bg-[#101010] border border-white/10">
          <span className="text-xs font-mono text-zinc-400 uppercase mr-2">ACTIVE FILTERS:</span>
          {selectedSize !== "all" && (
            <Link href={buildHref({ size: undefined })} className="clay-chip text-xs font-mono px-3 py-1 flex items-center gap-1.5 text-zinc-200">
              Size: {selectedSize}
              <X className="w-3 h-3" />
            </Link>
          )}
          <Link href="/shop" className="text-xs font-mono text-zinc-400 hover:text-white underline ml-auto">
            CLEAR ALL
          </Link>
        </div>
      )}

      {/* Main Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Desktop Filter Sidebar (PRD Section 9.2) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-8 pr-4 border-r border-white/10">
          {/* Size Selector Chips */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-200 mb-4 pb-1 border-b border-white/10 font-bold">
              SIZES
            </h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((sz) => (
                <Link
                  key={sz}
                  href={buildHref({ size: selectedSize === sz ? undefined : sz })}
                  className={`clay-chip text-xs font-mono px-3 py-1.5 ${
                    selectedSize === sz ? "clay-chip-active text-white border-white/40" : ""
                  }`}
                >
                  {sz}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Cards Grid */}
        <main className="lg:col-span-9">
          {products.length === 0 ? (
            <div className="py-24 text-center border border-white/10 bg-[#0c0c0c] p-8">
              <p className="font-gothic text-3xl text-zinc-300 mb-2">No matching garments</p>
              <p className="text-xs font-mono text-zinc-500 mb-6">
                Try clearing active size or color filters.
              </p>
              <Link
                href="/shop"
                className="clay-button-primary px-6 py-3 text-xs font-mono uppercase tracking-widest inline-flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" /> CLEAR FILTERS
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
