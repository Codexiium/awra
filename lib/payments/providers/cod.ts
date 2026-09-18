import type { PaymentProvider, CreatePaymentInput, CreatePaymentResult } from "../types";

// Cash on Delivery — the only working payment method for now (online
// payment is a frontend-only "coming soon" option, no backend behind it).
// No gateway redirect: payment is collected in person at delivery, so the
// payments row is created and left "pending", and checkout goes straight
// to the success page.
export const codProvider: PaymentProvider = {
  key: "cod",

  async createPayment({ supabase, orderId, orderNumber, amount }: CreatePaymentInput): Promise<CreatePaymentResult> {
    const { error } = await supabase.from("payments").insert({
      order_id: orderId,
      provider: "cod",
      status: "pending",
      amount
    });
    if (error) throw error;

    return { redirectUrl: `/checkout/success?order=${encodeURIComponent(orderNumber)}` };
  }
};
