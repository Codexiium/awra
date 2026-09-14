-- Client decision: append a fixed tagline to the end of every product
-- description.
begin;

update public.products
set description = description || ' Cotton printed tshirt oversized gothic wear.';

commit;
