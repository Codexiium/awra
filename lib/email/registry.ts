import type { EmailProvider } from "./types";
import { supabaseSmtpProvider } from "./providers/supabase-smtp";

// Mirrors lib/payments/'s provider-registry shape on purpose: swapping to a
// real provider (e.g. Resend — see TODO.md) later is meant to be "add
// providers/resend.ts, change ACTIVE_PROVIDER" with no call-site changes
// anywhere order confirmation/shipping-notification/contact-form emails are
// sent from.
const providers: Record<string, EmailProvider> = {
  "supabase-smtp": supabaseSmtpProvider
};

const ACTIVE_PROVIDER = "supabase-smtp";

export function getEmailProvider(): EmailProvider {
  const provider = providers[ACTIVE_PROVIDER];
  if (!provider) throw new Error(`Unknown email provider: ${ACTIVE_PROVIDER}`);
  return provider;
}
