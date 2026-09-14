# ARWA → Supabase Backend Migration

## Context

The ARWA storefront (`/home/immortal/code/codexiium/arronda`, Next.js 16 App Router) currently runs entirely on mock, client-only data: a static `mockProducts.ts` array, zustand stores persisted to `localStorage`, and forms that don't actually validate or persist anything (`useAuthStore.login()` never checks a password; checkout clears the cart and redirects without ever writing an order anywhere; `/account/settings` save is a no-op). The goal is to give this app a real backend using Supabase — email/password Auth, Storage for product images, and a Postgres DB — with this Next.js app's own Route Handlers/Server Actions acting as the backend layer. Every mocked flow (auth, catalog, cart, wishlist, checkout, account) is replaced with real, persisted, RLS-secured data, while reusing the existing UI components (`ProductImage`, `ProductCard`, `CartDrawer`, etc.) largely as-is.

A fresh, empty Supabase project has already been created (no schema, no config yet). Cart/wishlist are **server-synced** for logged-in users (not local-only), and signup **requires email confirmation**.

This repo is on **Next.js 16**, which has real breaking changes from training-data Next.js — confirmed directly against `node_modules/next/dist/docs/`:
- `middleware.ts` is deprecated → use **`proxy.ts`** at the repo root, exporting a `proxy(request)` function.
- `images.domains` is deprecated in `next.config.ts` → use `images.remotePatterns` with explicit `protocol`/`hostname`/`pathname`.
- `params`/`searchParams` are Promises (already used this way in `app/search/page.tsx` via `PageProps<"/search">` + `use()`) — any new dynamic route must follow the same pattern.
- Proxy does **not** reliably guard Server Actions called from other routes — every mutating Server Action must independently check `auth.uid()`/`getClaims()`, never rely on proxy-level gating alone.

Implementers should (re-)read the relevant `node_modules/next/dist/docs/` pages for Route Handlers, Server Actions, and Proxy before coding each phase, per this repo's own AGENTS.md instruction.

---

## Design decisions

- **Images → `product_images` table** (not JSONB). Models "N images per product with a role (`primary`/`secondary`/`gallery`) + sort order" exactly, matches the existing `ProductImages` shape, and keeps rows individually addressable for future image management.
- **Sizes/colors → `product_variants` table** (not JSONB). Today's `/shop` size filter hardcodes `["XS","S","M","L","XL"]` client-side, which silently excludes numeric sizes like pants' "30"/"32" — a real variants table fixes this by making filters real `DISTINCT`/`WHERE` queries, and gives checkout real stock to decrement.
- **`category`/`collection` → real FKs**, not the current free-text/slug-matched strings (removes silent-typo/orphan risk).
- **PKs**: `bigint generated always as identity` for internal tables (better index locality than random UUIDs). `orders` gets a separate human-readable `order_number` (format `ARWA-#####`, matching existing mock data) generated from a sequence, decoupled from its internal PK. `profiles`/`addresses`/user-owned tables reference `auth.users.id` (uuid), which is fixed by Supabase Auth.
- **Reviews**: **not built now** — UI only displays static `rating`/`review_count` today and has hardcoded fake review text; a real submission/moderation flow is out of scope unless requested later.
- **Payment**: pluggable-provider architecture, dummy provider only for now. A `payments` table (one row per payment attempt, referencing `orders`) plus a code-level `PaymentProvider` interface (`lib/payments/`) means adding Razorpay/Stripe/etc. later is "add a new provider module + register it," not a checkout rework. `placeOrder` creates the order as `payment_status = 'pending'`, creates a `payments` row (`provider = 'dummy'`), and redirects to `/dummy_pay?order=<order_number>` — a fake gateway page. Confirming there flips the payment to `succeeded` and the order to `payment_status = 'paid'`, then continues to `/checkout/success`. See §5a for the full flow.
- **Auth store**: remove `useAuthStore` (zustand) entirely — it currently bakes a fake logged-in user into `localStorage`, exactly the anti-pattern to eliminate. Replace with Supabase's own session (httpOnly cookies) + a thin `useUser()` hook using `onAuthStateChange`, so there's one source of truth for identity, not two that can drift.
- **Cart/wishlist**: keep `useCartStore`/`useWishlistStore` as zustand (they hold real UI-relevant data, not identity), but back them with `cart_items`/`wishlists` tables for logged-in users. Guest (logged-out) users keep today's localStorage-only behavior; on login, the local cart/wishlist merges into the server tables (upsert, summing cart quantities on conflict) and localStorage is cleared.

---

## 1. Postgres schema

Apply as versioned Supabase migration files (`supabase migration new <name>`), not ad-hoc SQL-editor runs. Full DDL:

```sql
-- profiles: one row per auth.users row, created by trigger (see Auth section)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text not null default '',
  member_since timestamptz not null default now(),
  tier text not null default 'Member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- categories
create table public.categories (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.categories enable row level security;
create policy "categories_public_read" on public.categories for select to anon, authenticated using (true);
-- no insert/update/delete policy for anon/authenticated: writes are service_role only (seed/admin script)

-- collections
create table public.collections (
  id bigint generated always as identity primary key,
  slug text not null unique,
  title text not null,
  subtitle text not null default '',
  description text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.collections enable row level security;
create policy "collections_public_read" on public.collections for select to anon, authenticated using (true);

-- products
create table public.products (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  price numeric(10,2) not null check (price >= 0),
  compare_at_price numeric(10,2) check (compare_at_price is null or compare_at_price >= 0),
  description text not null default '',
  category_id bigint not null references public.categories(id),
  collection_id bigint references public.collections(id),
  availability text not null default 'in_stock'
    check (availability in ('in_stock','low_stock','out_of_stock')),
  badges text[] not null default '{}',
  rating numeric(2,1) not null default 0 check (rating between 0 and 5),
  review_count int not null default 0 check (review_count >= 0),
  material text not null default '',
  fit text not null default '',
  care text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint badges_valid check (badges <@ array['new','limited','sale']::text[])
);
create index products_category_id_idx on public.products(category_id);
create index products_collection_id_idx on public.products(collection_id);
alter table public.products enable row level security;
create policy "products_public_read" on public.products for select to anon, authenticated using (true);

-- product_images
create table public.product_images (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  role text not null check (role in ('primary','secondary','gallery')),
  sort_order int not null default 0,
  storage_path text not null, -- key inside the bucket, not a full URL
  alt text not null default '',
  aspect_ratio text not null default '4:5'
    check (aspect_ratio in ('4:5','3:4','1:1','16:9','21:9','hero')),
  created_at timestamptz not null default now(),
  unique (product_id, role, sort_order)
);
create index product_images_product_id_idx on public.product_images(product_id);
create unique index product_images_primary_unique on public.product_images(product_id) where role = 'primary';
create unique index product_images_secondary_unique on public.product_images(product_id) where role = 'secondary';
alter table public.product_images enable row level security;
create policy "product_images_public_read" on public.product_images for select to anon, authenticated using (true);

-- product_variants
create table public.product_variants (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  size text not null,
  color_name text not null,
  color_hex text not null,
  available boolean not null default true,
  stock_qty int not null default 0 check (stock_qty >= 0),
  created_at timestamptz not null default now(),
  unique (product_id, size, color_name)
);
create index product_variants_product_id_idx on public.product_variants(product_id);
create index product_variants_size_idx on public.product_variants(size);
create index product_variants_color_idx on public.product_variants(color_name);
alter table public.product_variants enable row level security;
create policy "product_variants_public_read" on public.product_variants for select to anon, authenticated using (true);

-- addresses (supports multiple per user, unlike today's single-address model)
create table public.addresses (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Home',
  street text not null,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index addresses_user_id_idx on public.addresses(user_id);
create unique index addresses_one_default_per_user on public.addresses(user_id) where is_default;
alter table public.addresses enable row level security;
create policy "addresses_select_own" on public.addresses for select to authenticated using ((select auth.uid()) = user_id);
create policy "addresses_insert_own" on public.addresses for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "addresses_update_own" on public.addresses for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "addresses_delete_own" on public.addresses for delete to authenticated using ((select auth.uid()) = user_id);

-- orders
create sequence public.order_number_seq start 10000;
create table public.orders (
  id bigint generated always as identity primary key,
  order_number text not null unique default ('ARWA-' || nextval('public.order_number_seq')::text),
  user_id uuid not null references auth.users(id),
  status text not null default 'processing' check (status in ('processing','in_transit','delivered','cancelled')),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  subtotal numeric(10,2) not null check (subtotal >= 0),
  discount_amount numeric(10,2) not null default 0 check (discount_amount >= 0),
  shipping_cost numeric(10,2) not null default 0 check (shipping_cost >= 0),
  total numeric(10,2) not null check (total >= 0),
  promo_code text,
  shipping_address jsonb not null, -- snapshot at order time, not a live FK
  created_at timestamptz not null default now()
);
create index orders_user_id_idx on public.orders(user_id);
alter table public.orders enable row level security;
create policy "orders_select_own" on public.orders for select to authenticated using ((select auth.uid()) = user_id);
create policy "orders_insert_own" on public.orders for insert to authenticated with check ((select auth.uid()) = user_id);
-- no update/delete policy for authenticated: once placed, orders are immutable from the client

-- order_items (snapshots purchased name/price/size/color — must survive product changes/deletion)
create table public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders(id) on delete cascade,
  product_id bigint references public.products(id) on delete set null,
  product_name text not null,
  size text not null,
  color_name text not null,
  unit_price numeric(10,2) not null check (unit_price >= 0),
  qty int not null check (qty > 0)
);
create index order_items_order_id_idx on public.order_items(order_id);
create index order_items_product_id_idx on public.order_items(product_id);
alter table public.order_items enable row level security;
create policy "order_items_select_own" on public.order_items for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_items.order_id and o.user_id = (select auth.uid())));
create policy "order_items_insert_own" on public.order_items for insert to authenticated
  with check (exists (select 1 from public.orders o where o.id = order_items.order_id and o.user_id = (select auth.uid())));

-- wishlists (join table — replaces localStorage full-Product-object array)
create table public.wishlists (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id bigint not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);
create index wishlists_product_id_idx on public.wishlists(product_id);
alter table public.wishlists enable row level security;
create policy "wishlists_select_own" on public.wishlists for select to authenticated using ((select auth.uid()) = user_id);
create policy "wishlists_insert_own" on public.wishlists for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "wishlists_delete_own" on public.wishlists for delete to authenticated using ((select auth.uid()) = user_id);

-- cart_items (server-persisted cart for logged-in users)
create table public.cart_items (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id bigint not null references public.products(id) on delete cascade,
  size text not null,
  color_name text not null,
  quantity int not null check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id, size, color_name)
);
create index cart_items_user_id_idx on public.cart_items(user_id);
alter table public.cart_items enable row level security;
create policy "cart_items_select_own" on public.cart_items for select to authenticated using ((select auth.uid()) = user_id);
create policy "cart_items_insert_own" on public.cart_items for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "cart_items_update_own" on public.cart_items for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "cart_items_delete_own" on public.cart_items for delete to authenticated using ((select auth.uid()) = user_id);

-- payments (one row per payment attempt; supports multiple providers over time)
create table public.payments (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders(id) on delete cascade,
  provider text not null default 'dummy' check (provider in ('dummy','razorpay','stripe')),
  provider_reference text, -- external gateway's payment/session id, null for dummy
  status text not null default 'pending' check (status in ('pending','succeeded','failed')),
  amount numeric(10,2) not null check (amount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index payments_order_id_idx on public.payments(order_id);
alter table public.payments enable row level security;
create policy "payments_select_own" on public.payments for select to authenticated
  using (exists (select 1 from public.orders o where o.id = payments.order_id and o.user_id = (select auth.uid())));
create policy "payments_insert_own" on public.payments for insert to authenticated
  with check (exists (select 1 from public.orders o where o.id = payments.order_id and o.user_id = (select auth.uid())));
-- deliberately NO update policy for anon/authenticated: a payment's status (pending -> succeeded/failed)
-- must never be settable by the paying user's own session, even for the dummy provider now, because
-- that's the pattern that will matter once a real provider is added (status must come from a trusted
-- server context -- a webhook verified against the provider's signature -- not a client-invoked action).
-- The dummy flow's "confirm" step therefore also goes through a server-only path (service_role client),
-- modeling the real webhook shape from day one. See §5a.

-- promo_codes (replaces hardcoded ARWA15/GOTHIC15/DARK20 client logic)
create table public.promo_codes (
  id bigint generated always as identity primary key,
  code text not null unique,
  discount_percent int not null check (discount_percent between 1 and 100),
  active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.promo_codes enable row level security;
-- no select policy for anon/authenticated: validated only inside a server-side Action, never exposed to the client directly

-- updated_at trigger, applied to profiles / products / addresses / cart_items / payments
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.addresses for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.cart_items for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.payments for each row execute function public.set_updated_at();
```

After applying migrations: verify each table is exposed to the Data API (Table Editor → confirm, or reload PostgREST's schema cache) since new tables aren't always auto-exposed depending on project settings.

---

## 2. Supabase Storage

- One **public** bucket: `product-images` (public is fine — these are marketing assets meant to be hotlinked, no auth check needed).
- Key convention: `product-images/{product_slug}/{role}-{sort_order}.{ext}` (e.g. `.../cathedral-oversized-trench/primary.jpg`). Store the **path** in `product_images.storage_path`, resolve to a public URL via `supabase.storage.from('product-images').getPublicUrl(path)`.
- `next.config.ts` needs:
  ```ts
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '<project-ref>.supabase.co', pathname: '/storage/v1/object/public/product-images/**' },
    ],
  }
  ```
- `ProductImage.tsx` needs **no changes** — it already handles `src: string | null` with a placeholder fallback; it just starts receiving real URLs.
- Since there's no admin UI yet, seed images via a one-off script using the `service_role` key (bypasses RLS/storage policies, never shipped to the client, run locally only).

---

## 3. Auth integration

- `lib/supabase/client.ts` — `createBrowserClient` singleton (Client Components).
- `lib/supabase/server.ts` — per-request `createServerClient` reading/writing cookies via `getAll()`/`setAll()` (Server Components/Actions/Route Handlers).
- `useUser()` hook — Client Component hook wrapping `supabase.auth.getUser()` + `onAuthStateChange`, used by `Header.tsx` for the login/account icon and cart/wishlist badges.
- `proxy.ts` (repo root) — runs on every request except static assets; calls `supabase.auth.getClaims()` to validate/refresh the JWT, propagates cookies to both `request.cookies` and the response; redirects to `/login` if a `/account/**` path has no valid session. Keep `app/account/layout.tsx`'s existing client-side check too as cheap defense-in-depth. **Every Server Action touching orders/addresses/cart/wishlist must independently verify `auth.uid()`** — proxy-level gating alone is not sufficient per the Next 16 docs.
- `profiles` row creation: **DB trigger on `auth.users` insert** (not app-level insert-after-signup, which would risk an orphaned auth user if the follow-up insert fails):
  ```sql
  create or replace function public.handle_new_user()
  returns trigger language plpgsql security definer set search_path = public as $$
  begin
    insert into public.profiles (id, full_name)
    values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
    return new;
  end;
  $$;
  revoke execute on function public.handle_new_user() from public, anon, authenticated;
  create trigger on_auth_user_created after insert on auth.users
    for each row execute function public.handle_new_user();
  ```
  (`full_name` from `raw_user_meta_data` is safe here — used only as a display default, never for authorization.)
- `/login`, `/register` → Server Actions:
  - `signIn(formData)`: `supabase.auth.signInWithPassword(...)`, then trigger the guest cart/wishlist merge (see §4), then redirect to `/account`. On failure, return a typed error for inline display (real validation, replacing today's no-op).
  - `signUp(formData)`: `supabase.auth.signUp(...)` with **email confirmation required** — `/register` shows a "check your email" state instead of the current instant-login mock.
  - `logout()`: `supabase.auth.signOut()`, redirect to `/login`.
- Remove `useAuthStore` entirely once `useUser()` + Server Component auth reads replace it everywhere.

---

## 4. API surface (Route Handlers vs. Server Actions)

| Concern | Mechanism | Notes |
|---|---|---|
| `/shop` list/filter/sort | Server Component, direct query | Real `WHERE`/`ORDER BY`/`LIMIT`-`OFFSET` against `products`+`product_variants`+`categories`+`collections`, replacing client `.filter()`/`.slice()`. Fixes the numeric-size filter bug. |
| `/product/[slug]` | Server Component, direct query (join images+variants) | Missing slug → real `notFound()`, replacing today's `mockProducts[0]` fallback bug. |
| `/search` | Server Component, `ILIKE` query on name/description + joined category/collection names | Same `PageProps<"/search">` + `searchParams.q` shape as today, just swap the data source. |
| Cart ops | Server Actions: `addCartItem`, `removeCartItem`, `updateCartItemQty`, `mergeGuestCart` | Logged-in: read/write `cart_items`. Logged-out: unchanged localStorage/zustand. `mergeGuestCart` runs right after successful `signIn`. |
| Wishlist ops | Server Actions: `toggleWishlistItem`, read via Server Component | Same guest/logged-in split as cart; replaces the "SAVED LOCALLY · SIGN IN TO SYNC" banner with real sync. |
| Promo code | Server Action `applyPromoCode(code)` | Looks up `promo_codes` server-side only — replaces tamperable client-side `ARWA15`/`GOTHIC15`/`DARK20` logic. |
| Checkout | Server Action `placeOrder(formData)` | Re-reads the user's `cart_items` server-side (never trusts client totals/cart), recomputes subtotal/discount/shipping/total, checks `product_variants.stock_qty`, inserts `orders` (`payment_status = 'pending'`) + `order_items`, decrements stock, clears `cart_items`, creates a `payments` row via the chosen provider (`dummy` for now), and redirects to that provider's redirect URL — `/dummy_pay?order=<order_number>` today. See §5a. |
| Dummy payment confirm | Route Handler `POST /api/payments/dummy/confirm` | Server-only (service_role client): verifies the order/payment exist and are still `pending`, flips `payments.status = 'succeeded'` and `orders.payment_status = 'paid'`, redirects to `/checkout/success?order=<order_number>`. Shaped like a real provider's webhook on purpose — see §5a. |
| `/checkout/success` | Server Component reading `?order=`, querying the real order (RLS-scoped) | Replaces today's fully hardcoded static page. |
| `/account`, `/account/orders`, `/account/orders/[id]` | Server Components, RLS-scoped queries | Fixes the `orders[0]` fallback bug — unknown/foreign order id → 404. Drop the hardcoded fake tracking block. |
| `/account/addresses` | Server Actions: `createAddress`, `updateAddress`, `deleteAddress`, `setDefaultAddress` | Becomes real CRUD (today is read-only, single-address). Setting a new default: unset the old default row, then set the new one, in one action. |
| `/account/settings` | Server Action `updateProfile(formData)` | Fixes today's no-op save; updates `profiles.full_name`/`phone`. Email change (if allowed) goes through `auth.updateUser({ email })` separately, since it requires re-confirmation. |
| Checkout address prefill | Server Component passes the user's default `addresses` row into the checkout form | Fixes checkout currently ignoring the logged-in user's saved address. |

Verify exact Route Handler/Server Action syntax (`RouteContext<'/path/[param]'>` typing, `'use server'` placement) against `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md` and the Server Actions guide before implementing each one.

---

## 5a. Payment flow (dummy provider, pluggable architecture)

Checkout must not hardcode a single fake-card form as the only "payment" path forever — it's built so a real gateway (Razorpay, etc.) can be dropped in later as one more provider, with only a **dummy** provider actually wired up right now.

**Code structure:**
- `lib/payments/types.ts` — a `PaymentProvider` interface: `createPayment(order): Promise<{ redirectUrl: string }>` (called by `placeOrder` right after the order is inserted) and `handleCallback(request): Promise<{ orderId, status }>` (called by that provider's confirm/webhook Route Handler).
- `lib/payments/providers/dummy.ts` — the only implementation for now. `createPayment` inserts the `payments` row (`provider: 'dummy'`, `status: 'pending'`) and returns `redirectUrl: /dummy_pay?order=<order_number>`. No external call — it's a same-app simulated gateway.
- `lib/payments/registry.ts` — maps a provider key (`'dummy'`, later `'razorpay'`, ...) to its module, so `placeOrder` calls `getProvider(selectedProviderKey).createPayment(order)` without knowing which provider it is. For now the checkout form has no real provider choice UI (only dummy exists), but the plumbing already supports adding one.

**User-facing flow:**
1. User submits checkout → `placeOrder` creates `orders` (`payment_status: 'pending'`) + `order_items`, decrements stock, clears cart, creates a `payments` row via the dummy provider, redirects to `/dummy_pay?order=<order_number>`.
2. `/dummy_pay/page.tsx` — a simple simulated-gateway screen ("ARWA DUMMY PAY — this is not a real charge") showing the order total and a "Simulate Successful Payment" button (and, for realism/testability, a "Simulate Failed Payment" option too).
3. Submitting posts to `POST /api/payments/dummy/confirm` (Route Handler, using the **service_role** client, not the user's session — see the "no client update policy" note on `payments` in §1) which validates the order belongs to a real pending payment, flips `payments.status`/`orders.payment_status`, and redirects to `/checkout/success?order=<order_number>` (or an error state on simulated failure).

**Why a Route Handler + service_role instead of a plain client-invoked Server Action:** this deliberately mirrors how a *real* gateway integration will work later — a real provider calls back via a signed server-to-server webhook, never lets the paying browser directly assert "payment succeeded." Building the dummy flow the same way means swapping in Razorpay later is: add `lib/payments/providers/razorpay.ts` (real `createPayment` calling Razorpay's API for a redirect/order id, real `handleCallback` verifying Razorpay's webhook signature) and a `POST /api/payments/razorpay/webhook` Route Handler — no change to `placeOrder`, the `payments` table, or the checkout UI's call site.

---

## 5. Phased rollout

0. **Phase 0 — Project wiring.** Write this plan to `plan.md` at the repo root. Install `@supabase/supabase-js` + `@supabase/ssr` (pinned exact versions). Add `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` (server-only — Supabase's current naming; supersedes the legacy "service_role key" JWT, though it grants the same RLS-bypassing privilege) from the existing empty project. No other app code changes yet.
1. **Phase 1 — Schema + seed.** Apply the DDL above as Supabase migrations; enable RLS/policies; verify Data API exposure. Seed script (run with `service_role`, local-only) imports `app/data/mockProducts.ts`/`mockCollections`/`mockCategories` into `categories`/`collections`/`products`/`product_variants`; upload product photography to the `product-images` bucket + insert `product_images` rows. App still reads mock data — no behavior change yet.
2. **Phase 2 — Auth.** `lib/supabase/{client,server}.ts`, `proxy.ts`, `handle_new_user` trigger, `useUser()` hook. Rewire `/login`/`/register`/logout. Remove `useAuthStore`. Update `Header.tsx`.
3. **Phase 3 — Catalog from DB.** Swap `/shop`, `/search`, `/product/[slug]`, `/category/[slug]`, `/collections/[slug]` to real queries. Update `next.config.ts` `images.remotePatterns`. Retire `mockProducts.ts` once unused.
4. **Phase 4 — Cart/wishlist sync.** `cart_items`/`wishlists` Server Actions, guest→user merge-on-login, real `applyPromoCode`.
5. **Phase 5 — Checkout/orders/payment.** `placeOrder`, address prefill, the `payments` table + `lib/payments/` provider abstraction, the dummy provider, `/dummy_pay`, the dummy confirm Route Handler, real `/checkout/success`, stock decrement, order numbers. Highest-risk phase (money-shaped logic) — test stale-cart/out-of-stock-at-checkout and both the simulated-success and simulated-failure dummy-pay paths explicitly.
6. **Phase 6 — Account pages.** Real orders/order-detail/addresses CRUD/settings persistence; drop the hardcoded fake tracking block.

Each phase is a natural checkpoint to review before moving to the next.

---

## Verification

- After Phase 1: query each table directly (Supabase SQL editor or `psql`) to confirm seeded rows match `mockProducts.ts` counts (12 products, 4 collections, 5 categories) and that RLS blocks an anonymous client from reading `orders`/`addresses`/`cart_items`/`wishlists`/`promo_codes` while allowing `products`/`categories`/`collections`/`product_images`/`product_variants` reads.
- After Phase 2: sign up a test account (confirm the email flow works end-to-end), confirm a `profiles` row was created by the trigger, sign in/out, and confirm `/account/**` redirects to `/login` when logged out (via `proxy.ts`) and renders when logged in.
- After Phase 3: browse `/shop` with each filter (including a numeric pants size like "32") and confirm results match real `product_variants` data; visit a real and a bogus `/product/[slug]` and confirm the bogus one 404s.
- After Phase 4: add items to cart/wishlist as a guest, log in, confirm the guest items appear merged in `cart_items`/`wishlists` and localStorage is cleared; try an invalid promo code and confirm it's rejected server-side.
- After Phase 5: place a full order end-to-end through `/dummy_pay`, confirm `orders`+`order_items`+`payments` rows exist and `payments.status`/`orders.payment_status` both end at `succeeded`/`paid`; confirm `product_variants.stock_qty` decremented correctly and the success page shows the real order number. Also test the simulated-failure path (`orders.payment_status` stays unpaid, no false "success"). Try checking out with a cart item whose stock is 0 and confirm it's rejected before the order is created. Confirm an anonymous/other-user request to the dummy confirm endpoint for someone else's order is rejected.
- After Phase 6: edit settings/addresses and confirm changes persist across a page reload; view an order in `/account/orders/[id]` and confirm it's the correct one (not the `orders[0]` fallback bug).
- Run `bun run build` and `bunx tsc --noEmit` after each phase to catch type errors early (both currently pass cleanly on the unmodified app).
