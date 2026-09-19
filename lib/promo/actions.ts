"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface ApplyPromoResult {
  success: boolean;
  message: string;
  discountPercent: number;
}

// promo_codes has no anon/authenticated select policy (by design — codes
// aren't enumerable from the client), so the lookup itself uses the admin
// client rather than the per-request cookie-based one. Requiring a session
// removes the zero-friction anonymous brute-force case; real rate limiting
// (per-user and per-IP) is tracked in TODO.md as a follow-up, not yet wired.
// This is apply-time UX only — the authoritative check is inside
// place_order() itself (see the harden_promo_codes migration), so a code
// that passes here can still legitimately be rejected at checkout if its
// state changed in between (e.g. another order just used up the last slot).
export async function applyPromoCode(code: string, subtotal: number = 0): Promise<ApplyPromoResult> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) {
    return { success: false, message: "Sign in to apply a promo code", discountPercent: 0 };
  }

  const cleaned = code.trim().toUpperCase();
  if (!cleaned) {
    return { success: false, message: "Enter a promo code", discountPercent: 0 };
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("promo_codes")
    .select("discount_percent, active, expires_at, starts_at, max_uses, times_used, min_order_total")
    .eq("code", cleaned)
    .maybeSingle();

  const now = new Date();
  const isExpired = data?.expires_at ? new Date(data.expires_at) < now : false;
  const notStarted = data?.starts_at ? new Date(data.starts_at) > now : false;
  const usedUp = data?.max_uses != null ? data.times_used >= data.max_uses : false;

  if (!data || !data.active || isExpired || notStarted || usedUp) {
    // Deliberately generic — the old message ("Try ARWA15") handed out a
    // real, valid code to anyone who failed validation.
    return { success: false, message: "Invalid or expired promo code", discountPercent: 0 };
  }
  if (data.min_order_total != null && subtotal < data.min_order_total) {
    return { success: false, message: `This code requires a minimum order of ₹${data.min_order_total}/-`, discountPercent: 0 };
  }

  return {
    success: true,
    message: `${data.discount_percent}% promo code applied`,
    discountPercent: data.discount_percent
  };
}
