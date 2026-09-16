"use client";

import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/lib/admin/products";

export default function DeleteProductButton({ productId, productName }: { productId: number; productName: string }) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(e) => {
        if (!confirm(`Delete "${productName}"? This removes its images and variants and cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={productId} />
      <button
        type="submit"
        className="clay-button-secondary px-4 py-2 text-xs font-mono uppercase flex items-center gap-2 border-red-500/30 text-red-400"
      >
        <Trash2 className="w-3.5 h-3.5" /> DELETE PRODUCT
      </button>
    </form>
  );
}
