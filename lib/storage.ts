import { publicEnv } from "@/lib/env";

// Pure helper, no server-only imports — safe to use from Client Components
// (lib/catalog.ts re-exports this for server-side callers to keep one import
// path for most of the app).
export function getPublicImageUrl(storagePath: string) {
  return `${publicEnv.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${storagePath}`;
}
