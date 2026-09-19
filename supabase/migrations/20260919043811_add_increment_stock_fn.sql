-- BUG-3: cancelling an order never returned stock to inventory — every
-- cancellation permanently shrank sellable stock until someone noticed and
-- corrected it by hand in the admin variant editor. lib/admin/orders.ts's
-- updateOrderStatus now calls this on the transition into 'cancelled'.
--
-- A tiny atomic-increment function rather than a plain admin-client
-- `.update({ stock_qty: value })` for the same reason place_order() decrements
-- atomically: reading stock_qty in application code and writing back a
-- computed value is a race if anything else touches the same row
-- concurrently, where `stock_qty = stock_qty + qty` in one statement isn't.
-- Execute is restricted to service_role — this is called only from admin
-- Server Actions via the admin client, gated by requireAdmin() at the
-- application layer, the same trust model as every other admin write in
-- this codebase (see lib/supabase/admin.ts).
begin;

create or replace function public.increment_stock(p_product_id bigint, p_size text, p_qty int)
returns void
language sql
security definer
set search_path = public
as $$
  update public.product_variants
  set stock_qty = stock_qty + p_qty
  where product_id = p_product_id and size = p_size;
$$;

revoke all on function public.increment_stock(bigint, text, int) from public, anon, authenticated;
grant execute on function public.increment_stock(bigint, text, int) to service_role;

commit;
