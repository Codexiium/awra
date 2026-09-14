import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client — bypasses RLS. Server-only: never import this from a
// "use client" file or a file reachable from the browser bundle. Used for
// operations that must read/write tables with no anon/authenticated policy
// (e.g. promo_codes) or that must act with elevated trust (e.g. the dummy
// payment confirm route in a later phase).
export function createAdminClient() {
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}
