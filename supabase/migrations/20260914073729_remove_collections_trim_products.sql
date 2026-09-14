-- Client decision: drop the "collections" concept entirely, and trim the
-- catalog down to exactly 4 numbered products (no descriptive names).
begin;

-- Trim to the 4 products being kept (cascades product_images, product_variants,
-- wishlists, cart_items; order_items.product_id is ON DELETE SET NULL so past
-- order snapshots are unaffected).
delete from public.products where id not in (1, 2, 3, 4);

update public.products set name = '001' where id = 1;
update public.products set name = '002' where id = 2;
update public.products set name = '003' where id = 3;
update public.products set name = '004' where id = 4;

alter table public.products drop column collection_id;

drop table public.collections;

commit;
