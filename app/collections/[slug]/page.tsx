import Link from "next/link";
import ProductCard from "../../components/ui/ProductCard";
import { getCollectionBySlug, getProducts } from "@/lib/catalog";

export default async function CollectionDetailPage(props: PageProps<"/collections/[slug]">) {
  const { slug } = await props.params;

  const collectionObj = (await getCollectionBySlug(slug)) || {
    slug,
    title: slug.replace(/-/g, " ").toUpperCase(),
    subtitle: "LIMITED ARCHIVE",
    description: "Architectural heavyweight dark garments.",
    itemCount: 0
  };

  const collectionProducts = await getProducts({ collectionSlug: slug });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <Link href="/collections" className="hover:text-white transition-colors">COLLECTIONS</Link>
        <span>/</span>
        <span className="text-zinc-200">{collectionObj.title}</span>
      </nav>

      <div className="pb-8 border-b border-white/10 mb-12">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1">
          {collectionObj.subtitle}
        </span>
        <h1 className="font-gothic text-4xl sm:text-6xl text-white tracking-widest uppercase">
          {collectionObj.title}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-2xl mt-3 leading-relaxed">
          {collectionObj.description}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {collectionProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
