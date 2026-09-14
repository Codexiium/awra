-- orders.order_number defaults to nextval(order_number_seq), which requires
-- USAGE on the sequence for whichever role performs the INSERT — table-level
-- grants alone don't cover it. Only authenticated needs this (anon can't
-- insert into orders per the orders_insert_own policy anyway).
begin;

grant usage on sequence public.order_number_seq to authenticated;

commit;
