-- Client decision: collapse the category taxonomy down to a single category
-- ("Special") that every product falls under, instead of 4 separate ones.
begin;

-- Repurpose category id 1 (was "Outerwear") as the one remaining category.
update public.categories set slug = 'special', name = 'Special', sort_order = 0 where id = 1;

-- Reassign every product to it before dropping the other category rows
-- (products.category_id is NOT NULL, so this must happen first).
update public.products set category_id = 1;

delete from public.categories where id != 1;

commit;
