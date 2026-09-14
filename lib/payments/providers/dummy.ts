import type { PaymentProvider, CreatePaymentInput, CreatePaymentResult } from "../types";

// Same-app simulated gateway — no external call. A real provider (Razorpay,
// Stripe, ...) would call out here for a redirect/session id instead, but the
// shape (insert a pending `payments` row, return a redirectUrl) stays the same.
export const dummyProvider: PaymentProvider = {
  key: "dummy",

  async createPayment({ supabase, orderId, orderNumber, amount }: CreatePaymentInput): Promise<CreatePaymentResult> {
    const { error } = await supabase.from("payments").insert({
      order_id: orderId,
      provider: "dummy",
      status: "pending",
      amount
    });
    if (error) throw error;

    return { redirectUrl: `/dummy_pay?order=${encodeURIComponent(orderNumber)}` };
  }
};
