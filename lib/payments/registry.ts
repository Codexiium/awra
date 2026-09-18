import type { PaymentProvider } from "./types";
import { codProvider } from "./providers/cod";

// Cash on Delivery is the only working payment method — online payment is a
// disabled "coming soon" option in the checkout UI with no backend behind
// it, so there's nothing else to register here yet.
const providers: Record<string, PaymentProvider> = {
  cod: codProvider
};

export function getProvider(key: string = "cod"): PaymentProvider {
  const provider = providers[key];
  if (!provider) throw new Error(`Unknown payment provider: ${key}`);
  return provider;
}
