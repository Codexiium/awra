import type { PaymentProvider } from "./types";
import { dummyProvider } from "./providers/dummy";

const providers: Record<string, PaymentProvider> = {
  dummy: dummyProvider
};

// No provider-choice UI exists yet (only "dummy" is implemented) — this is the
// seam a real provider plugs into later: add its module, register it here.
export function getProvider(key: string = "dummy"): PaymentProvider {
  const provider = providers[key];
  if (!provider) throw new Error(`Unknown payment provider: ${key}`);
  return provider;
}
