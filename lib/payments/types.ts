export interface CreatePaymentInput {
  orderNumber: string;
}

export interface CreatePaymentResult {
  redirectUrl: string;
}

export interface PaymentProvider {
  key: string;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
}
