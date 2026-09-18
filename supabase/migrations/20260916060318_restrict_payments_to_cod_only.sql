-- Online payment is disabled for now (frontend-only "coming soon" label,
-- no backend provider wired up for it) — Cash on Delivery is the only
-- working payment method, so restrict the DB to match rather than keeping
-- unused provider values around. Existing dummy-paid orders are removed
-- first so they don't violate the tightened constraint.
begin;

delete from public.orders
where id in (select order_id from public.payments where provider = 'dummy');

alter table public.payments drop constraint payments_provider_check;
alter table public.payments add constraint payments_provider_check check (provider in ('cod'));
alter table public.payments alter column provider set default 'cod';

commit;
