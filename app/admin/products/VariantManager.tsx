"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import {
  createVariant,
  updateVariant,
  deleteVariant,
  type VariantActionState
} from "@/lib/admin/products";

interface Variant {
  id: number;
  size: string;
  stock_qty: number;
  available: boolean;
}

interface VariantManagerProps {
  productId: number;
  variants: Variant[];
}

const initialState: VariantActionState = { error: null };

function VariantRow({ productId, variant }: { productId: number; variant: Variant }) {
  const [state, formAction, pending] = useActionState(updateVariant, initialState);

  return (
    <form
      action={formAction}
      className="flex flex-wrap items-center gap-3 p-3 bg-[#141414] border border-white/5"
    >
      <input type="hidden" name="id" value={variant.id} />
      <input type="hidden" name="productId" value={productId} />

      <span className="w-14 text-white font-bold">{variant.size}</span>

      <label className="flex items-center gap-1.5 text-zinc-400">
        STOCK
        <input
          name="stockQty"
          type="number"
          min="0"
          defaultValue={variant.stock_qty}
          className="clay-input w-20 px-2 py-1.5 text-xs text-white"
        />
      </label>

      <label className="flex items-center gap-1.5 text-zinc-400 cursor-pointer">
        <input type="checkbox" name="available" defaultChecked={variant.available} className="accent-white" />
        AVAILABLE
      </label>

      <button type="submit" disabled={pending} className="clay-button-secondary px-3 py-1.5 text-[10px] uppercase disabled:opacity-60">
        {pending ? "SAVING..." : "SAVE"}
      </button>

      <form action={deleteVariant}>
        <input type="hidden" name="id" value={variant.id} />
        <input type="hidden" name="productId" value={productId} />
        <button type="submit" className="p-1.5 border border-red-500/30 text-red-400 hover:bg-red-950/40">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </form>

      {state.error && <p className="w-full text-[10px] text-red-400">{state.error}</p>}
    </form>
  );
}

function AddVariantForm({ productId }: { productId: number }) {
  const [state, formAction, pending] = useActionState(createVariant, initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3 p-3 bg-[#141414] border border-white/5">
      <input type="hidden" name="productId" value={productId} />

      <div>
        <label className="block text-[10px] text-zinc-500 uppercase mb-1">SIZE</label>
        <input name="size" required className="clay-input w-20 px-2 py-1.5 text-xs text-white" />
      </div>
      <div>
        <label className="block text-[10px] text-zinc-500 uppercase mb-1">STOCK</label>
        <input name="stockQty" type="number" min="0" defaultValue={0} className="clay-input w-20 px-2 py-1.5 text-xs text-white" />
      </div>
      <label className="flex items-center gap-1.5 text-zinc-400 cursor-pointer pb-2">
        <input type="checkbox" name="available" defaultChecked className="accent-white" />
        AVAILABLE
      </label>

      <button type="submit" disabled={pending} className="clay-button-primary px-4 py-1.5 text-[10px] uppercase disabled:opacity-60">
        {pending ? "ADDING..." : "ADD SIZE"}
      </button>

      {state.error && <p className="w-full text-[10px] text-red-400">{state.error}</p>}
    </form>
  );
}

export default function VariantManager({ productId, variants }: VariantManagerProps) {
  return (
    <div className="p-6 bg-[#0f0f0f] border border-white/10 space-y-3 font-mono text-xs">
      <h3 className="uppercase tracking-widest text-zinc-400 font-bold border-b border-white/10 pb-2">
        SIZES ({variants.length})
      </h3>

      <div className="space-y-2">
        {variants.map((v) => (
          <VariantRow key={v.id} productId={productId} variant={v} />
        ))}
      </div>

      <AddVariantForm productId={productId} />
    </div>
  );
}
