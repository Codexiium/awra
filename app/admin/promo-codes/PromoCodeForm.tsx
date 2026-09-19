"use client";

import { useActionState } from "react";
import { createPromoCode, type PromoCodeActionState } from "@/lib/admin/promoCodes";

const initialState: PromoCodeActionState = { error: null };

export default function PromoCodeForm() {
  const [state, formAction, pending] = useActionState(createPromoCode, initialState);

  return (
    <form action={formAction} className="p-6 bg-[#0f0f0f] border border-white/10 space-y-4 font-mono text-xs">
      <h3 className="uppercase tracking-widest text-zinc-400 font-bold border-b border-white/10 pb-2">CREATE CODE</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="promo-code" className="block text-[11px] text-zinc-400 uppercase mb-1">CODE</label>
          <input id="promo-code" name="code" required className="clay-input w-full px-4 py-3 text-xs text-white uppercase" />
        </div>
        <div>
          <label htmlFor="promo-discount" className="block text-[11px] text-zinc-400 uppercase mb-1">DISCOUNT % (MAX 50)</label>
          <input
            id="promo-discount"
            name="discountPercent"
            type="number"
            min="1"
            max="50"
            required
            className="clay-input w-full px-4 py-3 text-xs text-white"
          />
        </div>
        <div>
          <label htmlFor="promo-expires" className="block text-[11px] text-zinc-400 uppercase mb-1">EXPIRES (OPTIONAL)</label>
          <input id="promo-expires" name="expiresAt" type="date" className="clay-input w-full px-4 py-3 text-xs text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="promo-starts" className="block text-[11px] text-zinc-400 uppercase mb-1">STARTS (OPTIONAL)</label>
          <input id="promo-starts" name="startsAt" type="date" className="clay-input w-full px-4 py-3 text-xs text-white" />
        </div>
        <div>
          <label htmlFor="promo-max-uses" className="block text-[11px] text-zinc-400 uppercase mb-1">MAX USES (OPTIONAL)</label>
          <input id="promo-max-uses" name="maxUses" type="number" min="1" className="clay-input w-full px-4 py-3 text-xs text-white" />
        </div>
        <div>
          <label htmlFor="promo-min-order" className="block text-[11px] text-zinc-400 uppercase mb-1">MIN ORDER ₹ (OPTIONAL)</label>
          <input
            id="promo-min-order"
            name="minOrderTotal"
            type="number"
            min="0"
            step="0.01"
            className="clay-input w-full px-4 py-3 text-xs text-white"
          />
        </div>
      </div>

      {state.error && (
        <p className="text-[10px] text-red-400 border border-red-500/30 bg-red-950/30 px-3 py-2">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="clay-button-primary px-6 py-3 text-xs uppercase tracking-widest disabled:opacity-60"
      >
        {pending ? "CREATING..." : "CREATE CODE"}
      </button>
    </form>
  );
}
