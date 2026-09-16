"use client";

import { useActionState } from "react";
import type { ProductFormState } from "@/lib/admin/products";

interface ProductFormProps {
  action: (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  productId?: number;
  initialSlug?: string;
  initialName?: string;
  initialPrice?: number;
  initialCompareAtPrice?: number | null;
  initialDescription?: string;
  initialAvailability?: string;
  initialBadges?: string[];
  initialMaterial?: string;
  initialFit?: string;
  initialCare?: string;
  initialRating?: number;
  initialReviewCount?: number;
  submitLabel: string;
}

const DEFAULT_TAGLINE = "Cotton printed tshirt oversized gothic wear.";
const BADGE_OPTIONS = ["new", "limited", "sale"] as const;

const initialState: ProductFormState = { error: null };

export default function ProductForm({
  action,
  productId,
  initialSlug = "",
  initialName = "",
  initialPrice,
  initialCompareAtPrice,
  initialDescription = DEFAULT_TAGLINE,
  initialAvailability = "in_stock",
  initialBadges = [],
  initialMaterial = "",
  initialFit = "",
  initialCare = "",
  initialRating = 0,
  initialReviewCount = 0,
  submitLabel
}: ProductFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="p-6 bg-[#0f0f0f] border border-white/10 space-y-4 font-mono text-xs">
      {productId && <input type="hidden" name="id" value={productId} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] text-zinc-400 uppercase mb-1">SLUG</label>
          <input
            name="slug"
            defaultValue={initialSlug}
            required
            className="clay-input w-full px-4 py-3 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-[11px] text-zinc-400 uppercase mb-1">NAME</label>
          <input
            name="name"
            defaultValue={initialName}
            required
            className="clay-input w-full px-4 py-3 text-xs text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] text-zinc-400 uppercase mb-1">PRICE (NOW)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={initialPrice}
            required
            className="clay-input w-full px-4 py-3 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-[11px] text-zinc-400 uppercase mb-1">COMPARE-AT PRICE (ACTUAL, OPTIONAL)</label>
          <input
            name="compareAtPrice"
            type="number"
            step="0.01"
            min="0"
            defaultValue={initialCompareAtPrice ?? undefined}
            className="clay-input w-full px-4 py-3 text-xs text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] text-zinc-400 uppercase mb-1">DESCRIPTION</label>
        <textarea
          name="description"
          defaultValue={initialDescription}
          rows={3}
          className="clay-input w-full px-4 py-3 text-xs text-white"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] text-zinc-400 uppercase mb-1">AVAILABILITY</label>
          <select
            name="availability"
            defaultValue={initialAvailability}
            className="clay-input w-full px-4 py-3 text-xs text-white"
          >
            <option value="in_stock">IN STOCK</option>
            <option value="low_stock">LOW STOCK</option>
            <option value="out_of_stock">OUT OF STOCK</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] text-zinc-400 uppercase mb-1">BADGES</label>
          <div className="flex gap-4 pt-3">
            {BADGE_OPTIONS.map((badge) => (
              <label key={badge} className="flex items-center gap-1.5 text-zinc-300 uppercase cursor-pointer">
                <input
                  type="checkbox"
                  name="badges"
                  value={badge}
                  defaultChecked={initialBadges.includes(badge)}
                  className="accent-white"
                />
                {badge}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] text-zinc-400 uppercase mb-1">MATERIAL</label>
          <input
            name="material"
            defaultValue={initialMaterial}
            className="clay-input w-full px-4 py-3 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-[11px] text-zinc-400 uppercase mb-1">FIT</label>
          <input name="fit" defaultValue={initialFit} className="clay-input w-full px-4 py-3 text-xs text-white" />
        </div>
        <div>
          <label className="block text-[11px] text-zinc-400 uppercase mb-1">CARE</label>
          <input name="care" defaultValue={initialCare} className="clay-input w-full px-4 py-3 text-xs text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] text-zinc-400 uppercase mb-1">
            RATING (0-5, MANUALLY SET — NOT YET COMPUTED FROM REVIEWS)
          </label>
          <input
            name="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            defaultValue={initialRating}
            className="clay-input w-full px-4 py-3 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-[11px] text-zinc-400 uppercase mb-1">REVIEW COUNT (MANUALLY SET)</label>
          <input
            name="reviewCount"
            type="number"
            step="1"
            min="0"
            defaultValue={initialReviewCount}
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
        {pending ? "SAVING..." : submitLabel}
      </button>
    </form>
  );
}
