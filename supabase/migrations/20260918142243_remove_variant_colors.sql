-- Removes color as a product-variant dimension entirely — going forward a
-- product has only sizes, not size x color combinations. Client decision:
-- colors will eventually become separate standalone products, not variants
-- of one (see TODO.md), but that split isn't happening yet — this migration
-- only collapses the existing size x color cross-product down to one row
-- per size.
begin;

-- product_variants: merge the (up to) two color rows per size into one —
-- available if any color was available, stock summed across colors (both
-- colors of a given size always carried the same synthetic stock/availability
-- except one row nudged by earlier manual testing, so summing is the correct
-- "combine the inventory pools" move either way).
create temp table merged_variants as
select product_id, size, bool_or(available) as available, sum(stock_qty)::int as stock_qty
from public.product_variants
group by product_id, size;

delete from public.product_variants;

-- Dropping color_name/color_hex also drops the unique(product_id, size,
-- color_name) constraint and the color index automatically (no FK from
-- another table references them, so no CASCADE is needed).
alter table public.product_variants drop column color_name;
alter table public.product_variants drop column color_hex;

insert into public.product_variants (product_id, size, available, stock_qty)
select product_id, size, available, stock_qty from merged_variants;

alter table public.product_variants add constraint product_variants_product_id_size_key unique (product_id, size);

drop table merged_variants;

-- cart_items: no real cart data exists to preserve (checked live before
-- writing this migration) — clear the table rather than trying to merge
-- same-product-different-color rows under the new tighter unique constraint.
delete from public.cart_items;
alter table public.cart_items drop column color_name;
alter table public.cart_items add constraint cart_items_user_id_product_id_size_key unique (user_id, product_id, size);

-- order_items: no orders exist yet (checked live) — safe to drop outright
-- rather than leaving a column that would need to go nullable to keep
-- future inserts from needing a fabricated color value.
alter table public.order_items drop column color_name;

commit;
