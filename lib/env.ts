// Validates required env vars once at import time instead of the bare `!`
// non-null assertions previously scattered across every Supabase client file
// (server.ts, client.ts, admin.ts, proxy.ts) and the un-asserted string
// interpolation in storage.ts. A missing or misnamed var now fails loudly
// the first time this module is imported, instead of silently producing
// `"undefined"` in an image URL or surfacing as an opaque Supabase error the
// first time checkout or the admin panel is actually hit.
//
// IMPORTANT: each NEXT_PUBLIC_* var below must be accessed as a literal
// `process.env.NEXT_PUBLIC_X` expression, not through a helper that reads
// `process.env[name]` with a dynamic key. Next.js inlines NEXT_PUBLIC_* vars
// into the client bundle via a build-time *textual* find-and-replace of that
// exact literal expression — it can't see through bracket/dynamic access.
// Wrapping it in `requiredEnv(name)` (name: string) previously broke this:
// process.env in the browser bundle doesn't actually contain these keys, so
// every client component that imported publicEnv threw
// "Missing required environment variable" immediately, even with a correct
// .env.local, because the value was simply never inlined into that bundle.
function required(name: string, value: string | undefined): string {
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
  NEXT_PUBLIC_SUPABASE_URL: required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: required(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )
};

// Server-only, and lazy (a function, not a top-level constant): never call
// this from a "use client" file. SUPABASE_SECRET_KEY bypasses RLS and has no
// NEXT_PUBLIC_ prefix, so it's undefined in the browser bundle — evaluating
// it eagerly at module load the way publicEnv does above would throw for
// every visitor the moment any file that imports this module reaches the
// browser. Only lib/supabase/admin.ts calls this.
export function requireSupabaseSecretKey(): string {
  return required("SUPABASE_SECRET_KEY", process.env.SUPABASE_SECRET_KEY);
}
