-- Table-level privilege grants. RLS policies restrict *rows*; Postgres GRANTs
-- separately restrict *table access* at all, and creating tables via a direct
-- psql connection (instead of Supabase's own migration tooling) doesn't set
-- these automatically the way the dashboard/CLI flow does.
begin;

grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;

-- publicly readable catalog tables
grant select on public.categories, public.collections, public.products,
  public.product_images, public.product_variants to anon, authenticated;

-- user-owned tables: RLS policies already restrict to auth.uid() = user_id,
-- these grants just allow the operations that policies exist for
grant select, insert, update, delete on public.addresses to authenticated;
grant select, insert on public.orders to authenticated; -- no update/delete policy exists
grant select, insert on public.order_items to authenticated;
grant select, insert, delete on public.wishlists to authenticated;
grant select, insert, update, delete on public.cart_items to authenticated;
grant select, insert on public.payments to authenticated; -- no update policy exists (see plan.md §5a)

-- profiles: select/update only (rows created by the handle_new_user trigger, never client-inserted)
grant select, update on public.profiles to authenticated;

-- promo_codes: intentionally NO grant to anon/authenticated — validated server-side only
-- (service_role already covered by the blanket grant above)

alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;

commit;
