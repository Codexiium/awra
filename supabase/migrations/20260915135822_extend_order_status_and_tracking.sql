-- Extends orders.status for the admin fulfillment workflow, and adds
-- courier-tracking columns. See plan.md / AGENTS.md for context: previously
-- nothing in the app ever changed orders.status after insert.
--
-- The column default is deliberately left as 'processing' — placeOrder never
-- sets status explicitly, so new orders keep behaving exactly as they do
-- today. 'pending' is a valid value an admin can set manually (e.g. an order
-- parked awaiting some external check), it's just not where new orders start.
--
-- Tracking fields have no NOT NULL / check constraint requiring them when
-- status = 'shipped' — that rule is enforced in the admin Server Action
-- instead, so this migration's data remap (existing in_transit rows, which
-- have no tracking number) can't violate a DB constraint.
begin;

alter table public.orders drop constraint orders_status_check;

update public.orders set status = 'shipped' where status = 'in_transit';

alter table public.orders add constraint orders_status_check
  check (status in ('pending','accepted','processing','shipped','delivered','cancelled'));

alter table public.orders
  add column tracking_carrier text,
  add column tracking_number  text,
  add column tracking_url     text,
  add column shipped_at       timestamptz,
  add column delivered_at     timestamptz;

commit;
