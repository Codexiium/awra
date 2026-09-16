import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { createProduct } from "@/lib/admin/products";
import ProductForm from "../ProductForm";

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <Link href="/admin/products" className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> BACK TO ALL PRODUCTS
      </Link>

      <h2 className="font-mono text-sm uppercase tracking-widest text-zinc-200 font-bold border-b border-white/10 pb-3">
        ADD PRODUCT
      </h2>

      <p className="text-[10px] font-mono text-zinc-500">
        Save the product first — images and size/color variants are added on the edit page afterward.
      </p>

      <ProductForm action={createProduct} submitLabel="CREATE PRODUCT" />
    </div>
  );
}
