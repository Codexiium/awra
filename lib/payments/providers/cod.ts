import type { PaymentProvider, CreatePaymentInput, CreatePaymentResult } from "../types";

// Cash on Delivery — the only working payment method for now (online
// payment is a frontend-only "coming soon" option, no backend behind it).
// The `payments` row itself is created inside place_order() now —
// authenticated has no insert grant on payments directly (see
// supabase/migrations/20260919043809_lock_down_order_table_grants.sql) — so
// this provider's only remaining job is the redirect: payment is collected
// in person at delivery, so checkout goes straight to the success page.
export const codProvider: PaymentProvider = {
  key: "cod",

  async createPayment({ orderNumber }: CreatePaymentInput): Promise<CreatePaymentResult> {
    return { redirectUrl: `/checkout/success?order=${encodeURIComponent(orderNumber)}` };
  }
};
