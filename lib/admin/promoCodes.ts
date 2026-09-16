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

  if (!code) return { error: "Code is required." };
  if (!Number.isFinite(discountPercent) || discountPercent < 1 || discountPercent > 100) {
    return { error: "Discount percent must be between 1 and 100." };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("promo_codes").insert({
    code,
    discount_percent: discountPercent,
    expires_at: expiresAtRaw ? new Date(expiresAtRaw).toISOString() : null
  });

  if (error) {
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
  await admin.from("promo_codes").update({ active }).eq("id", id);
  revalidatePath("/admin/promo-codes");
}

export async function deletePromoCode(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!id) return;

  const admin = createAdminClient();
  await admin.from("promo_codes").delete().eq("id", id);
  revalidatePath("/admin/promo-codes");
}
