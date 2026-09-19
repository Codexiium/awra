import { headers } from "next/headers";

// Prefer an explicit NEXT_PUBLIC_SITE_URL (also used for metadataBase — see
// app/layout.tsx) and fall back to the incoming request's own host/proto.
// The fallback only works inside a request (Server Component/Action/Route
// Handler); email-redirect links generated there don't need the env var set,
// but anything generated outside a request (e.g. a future cron job) would.
export async function getSiteOrigin(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}
