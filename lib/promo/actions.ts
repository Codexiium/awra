"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export interface ApplyPromoResult {
  success: boolean;
  message: string;
  discountPercent: number;
}

// promo_codes has no anon/authenticated select policy (by design — codes
// aren't enumerable from the client), so this must use the admin client
// rather than the per-request cookie-based one.
export async function applyPromoCode(code: string): Promise<ApplyPromoResult> {
  const cleaned = code.trim().toUpperCase();
  if (!cleaned) {
    return { success: false, message: "Enter a promo code", discountPercent: 0 };
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("promo_codes")
    .select("discount_percent, active, expires_at")
    .eq("code", cleaned)
    .maybeSingle();

  const isExpired = data?.expires_at ? new Date(data.expires_at) < new Date() : false;
  if (!data || !data.active || isExpired) {
    return { success: false, message: "Invalid promo code. Try ARWA15", discountPercent: 0 };
  }

  return {
    success: true,
    message: `${data.discount_percent}% promo code applied`,
    discountPercent: data.discount_percent
  };
}
