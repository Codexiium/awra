-- Adds a GST line to the order total. GST is computed as 5% of the
-- pre-tax bill (subtotal - discount_amount + shipping_cost) and added on
-- top to reach `total` — see lib/checkout/actions.ts for the computation.
begin;

alter table public.orders add column gst_amount numeric(10,2) not null default 0 check (gst_amount >= 0);

commit;
