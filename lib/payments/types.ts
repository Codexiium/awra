import type { SupabaseClient } from "@supabase/supabase-js";

export interface CreatePaymentInput {
  // Request-scoped, RLS-respecting client authenticated as the buyer — NOT the
  // admin client. Creating the initial pending payment is something the owning
  // user is allowed to do (payments_insert_own policy); only the later status
  // transition (pending -> succeeded/failed) requires elevated trust.
  supabase: SupabaseClient;
  orderId: number;
  orderNumber: string;
  amount: number;
}

export interface CreatePaymentResult {
  redirectUrl: string;
}

export interface PaymentProvider {
  key: string;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
}
