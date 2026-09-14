import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductDetailPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categorySlug, slug, 4);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
