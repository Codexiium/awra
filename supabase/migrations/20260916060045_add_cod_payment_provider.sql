-- Adds Cash on Delivery as a payment provider. Online payment ("dummy",
-- standing in for a future real gateway) is disabled at checkout for now —
-- see lib/payments/registry.ts and CheckoutForm.tsx's "COMING SOON" option —
-- but the constraint keeps 'dummy'/'razorpay'/'stripe' too so re-enabling
-- online payment later needs no further migration.
begin;

alter table public.payments drop constraint payments_provider_check;
alter table public.payments add constraint payments_provider_check
  check (provider in ('dummy','razorpay','stripe','cod'));

commit;
