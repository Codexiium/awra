import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { publicEnv, requireSupabaseSecretKey } from "@/lib/env";

// Service-role client — bypasses RLS. Server-only: never import this from a
// "use client" file or a file reachable from the browser bundle. Used for
// operations that must read/write tables with no anon/authenticated policy
// (e.g. promo_codes) or that must act with elevated trust (e.g. admin order
// management, stock restoration on cancellation).
export function createAdminClient() {
  return createSupabaseClient(publicEnv.NEXT_PUBLIC_SUPABASE_URL, requireSupabaseSecretKey(), {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}
