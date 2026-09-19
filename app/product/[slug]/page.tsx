import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import ProductDetailClient from "./ProductDetailClient";

// Every product page previously shared the single root metadata object —
// indistinguishable from each other in search results and social shares,
// which matters most exactly here since these are the pages that need to
// rank.
export async function generateMetadata(props: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const title = `${product.name} — ${formatPrice(product.price)}`;
  const description = product.description || `${product.name}, oversized cotton printed gothic streetwear from ARWA.`;
  const image = product.images?.primary?.src;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [image] : undefined
    }
  };
}

export default async function ProductDetailPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(slug, 4);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
