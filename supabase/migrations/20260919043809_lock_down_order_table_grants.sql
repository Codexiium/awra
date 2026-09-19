-- Closes the direct-PostgREST forgery hole: authenticated previously held
-- `insert` on orders/order_items/payments (grants.sql), with RLS policies
-- that only ever checked auth.uid() = user_id — RLS restricts *rows*, not
-- *values*, so any signed-in user could POST a fabricated total, arbitrary
-- order_items at any price with no stock check, and a payments row claiming
-- status = 'succeeded' (allowed on insert; only updates were ever locked
-- down). place_order() (see the migration alongside this one) is now the
-- only supported way to create an order, running as security definer with
-- its own validation — so the direct insert grants are no longer needed and
-- are revoked here. select stays untouched (customers still need to read
-- their own orders).
begin;

revoke insert on public.orders from authenticated;
revoke insert on public.order_items from authenticated;
revoke insert on public.payments from authenticated;

commit;
