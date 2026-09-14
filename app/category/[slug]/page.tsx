import Link from "next/link";
import ProductCard from "../../components/ui/ProductCard";
import { getCategoryBySlug, getProducts } from "@/lib/catalog";

export default async function CategoryPage(props: PageProps<"/category/[slug]">) {
  const { slug } = await props.params;

  const categoryObj = (await getCategoryBySlug(slug)) || { slug, name: slug.toUpperCase(), count: 0 };
  const categoryProducts = await getProducts({ categorySlug: slug });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-white transition-colors">SHOP</Link>
        <span>/</span>
        <span className="text-zinc-200">{categoryObj.name.toUpperCase()}</span>
      </nav>

      <div className="pb-8 border-b border-white/10 mb-8">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1">
          CATEGORY ARCHIVE
        </span>
        <h1 className="font-gothic text-4xl sm:text-5xl text-white tracking-widest uppercase">
          {categoryObj.name}
        </h1>
        <p className="text-xs text-zinc-400 font-mono mt-2">
          SHOWING {categoryProducts.length} GARMENTS
        </p>
      </div>

      {categoryProducts.length === 0 ? (
        <div className="py-24 text-center border border-white/10 bg-[#0c0c0c] p-8">
          <p className="font-gothic text-2xl text-zinc-300 mb-2">No garments in this category</p>
          <Link href="/shop" className="clay-button-primary px-6 py-3 text-xs font-mono uppercase tracking-widest inline-block mt-4">
            EXPLORE ALL GARMENTS
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
