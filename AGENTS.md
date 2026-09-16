<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ARWA — project knowledge for agents

ARWA is a dark-gothic streetwear storefront. It started as a fully mocked Next.js frontend (Create Next App scaffold) and has since been migrated onto a real Supabase backend (Auth + Postgres + Storage), with this Next.js app's own Route Handlers/Server Actions acting as the backend layer — no separate API service.

**Before making non-trivial changes, read these two files in full — this section is an index, not a replacement for them:**
- `plan.md` — the original design doc: full schema DDL with rationale, the phased rollout, the payment-provider architecture, and the reasoning behind every non-obvious decision (why `bigint identity` PKs, why `product_images`/`product_variants` are normalized tables not JSONB, why the dummy payment flow is shaped like a real webhook, etc.).
- `TODO.md` — the living log of trade-offs, known limitations, real bugs caught during live testing (and their fixes), and client decisions that changed scope mid-build (e.g. collections and categories were both fully removed after initially being built). Treat it as more current than `plan.md` where they disagree — `plan.md` is the original design, `TODO.md` tracks what actually happened afterward.

## Stack

- **Next.js 16** (App Router, Turbopack), **React 19**, TypeScript (strict), Tailwind 4.
- **Supabase**: Postgres (via `@supabase/ssr` + `@supabase/supabase-js`), Auth (email/password, email confirmation required), Storage (product images).
- **zustand** (+ `persist`) for client-side cart/wishlist state; **gsap** for the homepage hero entrance animation; **lucide-react** for icons.
- Package manager: **bun**. The Supabase CLI is a dev dependency, usable via `bunx supabase` (already linked to the project — see below).

## Environment

- Copy `.env.example` → `.env.local` and fill in real values from the Supabase dashboard. Never commit `.env.local` (already gitignored via `.env*`, with an explicit `!.env.example` exception so the template itself stays tracked).
- Required vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (client-safe), `SUPABASE_SECRET_KEY` (server-only, bypasses RLS — **never** import anything using this into a `"use client"` file), `SUPABASE_DB_DIRECT_URL` / `SUPABASE_DB_TRANSACTIONAL_URL` (local-only, used by `psql`/the seed script, not read by the app at runtime).
- Supabase now uses **publishable/secret** key naming, not the legacy **anon/service_role** naming — same privilege levels, different names. Use the current names in any new env var.
- The Supabase CLI is linked (`supabase link --project-ref lwzyjavrdbawgqpwrlme`) and its migration history is in sync with what's actually applied. **Use `bunx supabase migration new <name>` + `bunx supabase db push` for schema changes** — not raw `psql -f`. (The first several migrations in this repo *were* applied via raw `psql` before the CLI was linked, which is why `supabase/migrations/20260913200100_grants.sql` had to explicitly `GRANT` table privileges that Supabase's own tooling would normally set up automatically — see "Real bugs caught" below.)

## Commands

- `bun run dev` / `bun run build` — dev server / production build. Always run `bunx tsc --noEmit` and `bun run build` after any non-trivial change; both were kept clean throughout this project's history and should stay that way.
- `bun run scripts/seed.ts` — one-off local seed script (uses `SUPABASE_SECRET_KEY`, bypasses RLS). Seeds `app/data/mockProducts.ts` into `products`/`product_variants`, plus `promo_codes`. Reflects the *current* catalog shape (4 products, no categories/collections) — re-running it on a fresh project reproduces today's state, not the original 12-product mock catalog.
- `bunx supabase db push` — apply pending migrations to the linked project. `bunx supabase migration list` to check local/remote sync.

## Data model (current — see `plan.md` for the full original DDL and rationale)

Tables: `profiles` (extends `auth.users`, created by a DB trigger on signup), `products`, `product_images`, `product_variants`, `addresses`, `orders`, `order_items`, `payments`, `cart_items`, `wishlists`, `promo_codes`.

**There is no `categories` or `collections` table** — both existed at one point in this project's history and were fully removed by client decision (schema, routes, nav, filters, everything). Don't reintroduce either concept without being explicitly asked; see `TODO.md`'s "Catalog scope" section for the full history.

The catalog is deliberately small: **exactly 4 products**, named `001`–`004` (no descriptive names — client decision), each with a description ending in the fixed tagline "Cotton printed tshirt oversized gothic wear." `product_variants` models size × color as a full cross-product with synthetic `stock_qty` (not real inventory data — see `TODO.md`).

RLS is enabled on every table. The general pattern: catalog tables (`products`, `product_images`, `product_variants`) are publicly readable; everything user-owned (`addresses`, `orders`, `order_items`, `cart_items`, `wishlists`, `payments`) is scoped to `auth.uid()`; `promo_codes` has **no** client read policy at all (validated server-side only, via the admin client, so codes aren't enumerable).

## Auth & Supabase client architecture (`lib/supabase/`)

- `client.ts` — browser client (`createBrowserClient`), for Client Components.
- `server.ts` — per-request client (`createServerClient`, cookie-based), for Server Components/Actions/Route Handlers. Create a **new** one per request; never share across requests.
- `admin.ts` — service-role client (`SUPABASE_SECRET_KEY`, bypasses RLS). Server-only, used only where a regular user genuinely has no privilege by design (e.g. flipping `payments.status`, decrementing `product_variants.stock_qty` during checkout).
- `proxy.ts` + root `proxy.ts` — Next 16 renamed `middleware.ts` to `proxy.ts` (a real breaking change, not a typo — see `node_modules/next/dist/docs/`). Refreshes the session every request via `getClaims()` and redirects unauthenticated `/account/**` and `/checkout/**` requests to `/login?next=<path>`. **This does not protect Server Actions** — every mutating action independently re-checks `auth.uid()`/`getClaims()`.
- `actions.ts` — `signIn`/`signUp`/`signOut` Server Actions. Email confirmation is required (so `signUp` shows a "check your email" state, not instant login). `signIn` supports `next` for post-login redirect.
- `sync.ts` — client-side fire-and-forget writes to `cart_items`/`wishlists` for logged-in users, called from the zustand store actions.
- `useUser.ts` — client hook wrapping `getUser()` + `onAuthStateChange`, replacing what used to be a (fake) `useAuthStore`.

`app/components/CartWishlistSync.tsx` (mounted in the root layout) merges any local guest cart/wishlist into the server tables on login, then makes the server the source of truth; it also clears local state on logout so one user's cart/wishlist can't leak to the next guest on a shared browser.

## Catalog (`lib/catalog.ts`)

All product reads go through this file (`getProducts`, `getProductBySlug`, `getRelatedProducts`, `searchProducts`, `getProductsByIds`, `getAllProductsForNav`, `getDistinctSizesAndColors`) and a shared `mapProductRow` that reshapes a DB row into the app's `Product` type, resolving Storage paths to public URLs via `getPublicImageUrl`. Search is `ILIKE` substring matching (fine at 4 products, won't scale — see `TODO.md`). PostgREST's `or()` only filters a resource's own columns, not embedded-resource columns — worth remembering if you add filtering on a joined table again.

## Checkout & payments (`lib/checkout/`, `lib/payments/`)

`placeOrder` (`lib/checkout/actions.ts`) is the checkout Server Action: re-reads the cart server-side (never trusts client totals), validates stock, recomputes totals, creates `orders`/`order_items`, decrements stock via the **admin** client (regular users have no UPDATE grant on `product_variants` by design), clears the server cart, then hands off to a payment provider.

`lib/payments/` is a small provider-abstraction (`types.ts`, `registry.ts`, `providers/dummy.ts`) so a real gateway can be added later as one more provider module — only `dummy` exists today. The dummy flow is deliberately shaped like a real webhook: `/dummy_pay` is a same-app simulated gateway page; confirming it POSTs to `/api/payments/dummy/confirm`, a Route Handler using the **admin** client (payments has no client-writable update policy) that explicitly checks the order belongs to the caller before flipping `payments.status`/`orders.payment_status`. Swapping in a real provider later means adding a provider module + a real webhook Route Handler — not touching `placeOrder` or the checkout UI.

**Known limitation**: `placeOrder`'s several writes aren't wrapped in one DB transaction/RPC — a partial failure can leave inconsistent state. Acceptable for this dummy/demo flow; a real production checkout would want a Postgres function called via `.rpc()`.

## Account pages (`lib/account/actions.ts`)

Real CRUD: `createAddress`/`updateAddress`/`deleteAddress`/`setDefaultAddress`, `updateProfile`. Address default-switching is two sequential writes (unset old, then set new) matching the `addresses_one_default_per_user` partial unique index — not a single transaction. `updateProfile` persists `full_name`/`phone` to `profiles`, and if the submitted email differs from the session's, calls `supabase.auth.updateUser({ email })` to trigger Supabase's real re-confirmation flow (surfaced to the user, not silently treated as instant).

## Currency & formatting

All prices display as `₹<amount>/-` via `formatPrice()` in `lib/format.ts` — use it for every price, never format currency inline. This is a display-only convention; underlying `price`/`total`/etc. columns are still plain numeric values with no currency conversion applied.

## Content conventions (client decisions — don't casually revert these)

- No unverified brand/origin/courier claims in copy (no "Designed in NYC", no "DHL", no specific city claims) — these were all fabricated placeholder text and were deliberately stripped. If a real courier or manufacturing location is confirmed later, add it deliberately.
- Homepage hero carries a fixed punchline and a contact phone number (`tel:` link) — see `app/page.tsx` and `app/components/layout/Footer.tsx`.
- No categories, no collections, 4 numbered products, fixed description tagline — all covered above and in `TODO.md`.

## Testing approach used throughout this project

Server Actions have opaque, encrypted action IDs — they **cannot** be invoked directly via `curl`. The approach used successfully throughout (and which caught several real bugs, e.g. a missing `GRANT USAGE ON SEQUENCE` for `order_number_seq`, and a `wishlists` upsert needing `ignoreDuplicates: true` instead of the default merge-duplicates) was: replicate the *exact sequence* of Supabase REST calls a Server Action performs, using a real confirmed test user's access token (created via the Auth admin API, cleaned up afterward), and verify against the live Supabase project rather than assuming RLS/grants are correct. Prefer this over guessing when touching anything that writes to the database.

## Environment quirk

`next.config.ts` has `images.dangerouslyAllowLocalIP: true` — needed because this specific dev sandbox resolves the Supabase Storage hostname through NAT64 to an address Next 16's image-optimization SSRF guard flags as "private." `remotePatterns` already restricts fetches to the exact Supabase hostname+path, so this is safe here, but it may not be necessary on a normal deployment target (Vercel, etc.) — see `TODO.md` before removing or keeping it elsewhere.
