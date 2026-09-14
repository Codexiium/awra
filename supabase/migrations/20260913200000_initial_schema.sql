-- ARWA initial schema: profiles, catalog, addresses, orders, payments, cart/wishlist, promo codes
-- See /plan.md for full design rationale.

begin;

-- ============ profiles ============
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

-- ============ categories ============
create table public.categories (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.categories enable row level security;
create policy "categories_public_read" on public.categories for select to anon, authenticated using (true);

-- ============ collections ============
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

-- ============ products ============
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

-- ============ product_images ============
create table public.product_images (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  role text not null check (role in ('primary','secondary','gallery')),
  sort_order int not null default 0,
  storage_path text not null,
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

-- ============ product_variants ============
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

-- ============ addresses ============
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

-- ============ orders ============
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
  shipping_address jsonb not null,
  created_at timestamptz not null default now()
);
create index orders_user_id_idx on public.orders(user_id);
alter table public.orders enable row level security;
create policy "orders_select_own" on public.orders for select to authenticated using ((select auth.uid()) = user_id);
create policy "orders_insert_own" on public.orders for insert to authenticated with check ((select auth.uid()) = user_id);

-- ============ order_items ============
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

-- ============ wishlists ============
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

-- ============ cart_items ============
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

-- ============ payments ============
create table public.payments (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders(id) on delete cascade,
  provider text not null default 'dummy' check (provider in ('dummy','razorpay','stripe')),
  provider_reference text,
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
-- deliberately no update policy: status transitions only via service-role Route Handler (see plan.md §5a)

-- ============ promo_codes ============
create table public.promo_codes (
  id bigint generated always as identity primary key,
  code text not null unique,
  discount_percent int not null check (discount_percent between 1 and 100),
  active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.promo_codes enable row level security;
-- deliberately no select policy: validated only inside server-side code using the secret key

-- ============ updated_at trigger ============
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

-- ============ handle_new_user trigger ============
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

commit;
