// Validates required env vars once at import time instead of the bare `!`
// non-null assertions previously scattered across every Supabase client file
// (server.ts, client.ts, admin.ts, proxy.ts) and the un-asserted string
// interpolation in storage.ts. A missing or misnamed var now fails loudly
// the first time this module is imported, instead of silently producing
// `"undefined"` in an image URL or surfacing as an opaque Supabase error the
// first time checkout or the admin panel is actually hit.
function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Copy .env.example to .env.local and fill in real values from the Supabase dashboard.`
    );
  }
  return value;
}

// Safe to import from Client Components — both are NEXT_PUBLIC_* and get
// inlined into the browser bundle at build time.
export const publicEnv = {
  NEXT_PUBLIC_SUPABASE_URL: requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: requiredEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
};

// Server-only, and lazy (a function, not a top-level constant): never call
// this from a "use client" file. SUPABASE_SECRET_KEY bypasses RLS and has no
// NEXT_PUBLIC_ prefix, so it's undefined in the browser bundle — evaluating
// it eagerly at module load the way publicEnv does above would throw for
// every visitor the moment any file that imports this module reaches the
// browser. Only lib/supabase/admin.ts calls this.
export function requireSupabaseSecretKey(): string {
  return requiredEnv("SUPABASE_SECRET_KEY");
}
