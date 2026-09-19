"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export interface PromoCodeActionState {
  error: string | null;
}

export async function createPromoCode(
  _prevState: PromoCodeActionState,
  formData: FormData
): Promise<PromoCodeActionState> {
  await requireAdmin();

  // applyPromoCode (lib/promo/actions.ts) uppercases input before lookup —
  // codes must be stored uppercase or they'll never match at checkout.
  const code = String(formData.get("code") || "").trim().toUpperCase();
  const discountPercent = Number(formData.get("discountPercent"));
  const expiresAtRaw = String(formData.get("expiresAt") || "").trim();
  const startsAtRaw = String(formData.get("startsAt") || "").trim();
  const maxUsesRaw = String(formData.get("maxUses") || "").trim();
  const minOrderTotalRaw = String(formData.get("minOrderTotal") || "").trim();

  if (!code) return { error: "Code is required." };
  // Capped at 50 (not the schema's old 100) — a leaked or guessed code
  // should cost at most half an order, not the entire thing.
  if (!Number.isFinite(discountPercent) || discountPercent < 1 || discountPercent > 50) {
    return { error: "Discount percent must be between 1 and 50." };
  }

  const maxUses = maxUsesRaw ? Number(maxUsesRaw) : null;
  if (maxUses !== null && (!Number.isFinite(maxUses) || maxUses < 1)) {
    return { error: "Max uses must be a positive number." };
  }
  const minOrderTotal = minOrderTotalRaw ? Number(minOrderTotalRaw) : null;
  if (minOrderTotal !== null && (!Number.isFinite(minOrderTotal) || minOrderTotal < 0)) {
    return { error: "Minimum order total must be zero or more." };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("promo_codes").insert({
    code,
    discount_percent: discountPercent,
    expires_at: expiresAtRaw ? new Date(expiresAtRaw).toISOString() : null,
    starts_at: startsAtRaw ? new Date(startsAtRaw).toISOString() : null,
    max_uses: maxUses,
    min_order_total: minOrderTotal
  });

  if (error) {
    console.error("createPromoCode error", error);
    return { error: error.code === "23505" ? "That code already exists." : "Could not create promo code." };
  }

  revalidatePath("/admin/promo-codes");
  return { error: null };
}

export async function togglePromoCodeActive(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const active = formData.get("active") === "true";
  if (!id) return;

  const admin = createAdminClient();
  const { error } = await admin.from("promo_codes").update({ active }).eq("id", id);
  if (error) console.error("togglePromoCodeActive error", error);
  revalidatePath("/admin/promo-codes");
}

export async function deletePromoCode(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!id) return;

  const admin = createAdminClient();
  const { error } = await admin.from("promo_codes").delete().eq("id", id);
  if (error) console.error("deletePromoCode error", error);
  revalidatePath("/admin/promo-codes");
}
