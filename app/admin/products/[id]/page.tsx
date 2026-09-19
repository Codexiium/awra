import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateProduct } from "@/lib/admin/products";
import ProductForm from "../ProductForm";
import ProductImagesSection from "../ProductImagesSection";
import VariantManager from "../VariantManager";
import DeleteProductButton from "../DeleteProductButton";

export default async function EditProductPage(props: PageProps<"/admin/products/[id]">) {
  await requireAdmin();
  const { id } = await props.params;
  const productId = Number(id);
  if (!productId) notFound();

  const admin = createAdminClient();
  const { data: product } = await admin
    .from("products")
    .select(
      "id, slug, name, price, compare_at_price, description, availability, badges, material, fit, care, rating, review_count, product_images(id, role, storage_path, alt), product_variants(id, size, stock_qty, available)"
    )
    .eq("id", productId)
    .maybeSingle();

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/products" className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> BACK TO ALL PRODUCTS
      </Link>

      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h2 className="font-mono text-sm uppercase tracking-widest text-zinc-200 font-bold">EDIT PRODUCT</h2>
        <DeleteProductButton productId={product.id} productName={product.name} />
      </div>

      <ProductForm
        action={updateProduct}
        productId={product.id}
        initialSlug={product.slug}
        initialName={product.name}
        initialPrice={Number(product.price)}
        initialCompareAtPrice={product.compare_at_price != null ? Number(product.compare_at_price) : null}
        initialDescription={product.description}
        initialAvailability={product.availability}
        initialBadges={product.badges}
        initialMaterial={product.material}
        initialFit={product.fit}
        initialCare={product.care}
        initialRating={Number(product.rating)}
        initialReviewCount={product.review_count}
        submitLabel="SAVE CHANGES"
      />

      <ProductImagesSection productId={product.id} slug={product.slug} images={product.product_images} />

      <VariantManager productId={product.id} variants={product.product_variants} />
    </div>
  );
}
