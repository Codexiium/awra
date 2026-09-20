-- Lets an admin pick which product is shown in the homepage hero card
-- (previously hardcoded to "whichever product sorts first"). At most one
-- product can be the hero at a time — the partial unique index below
-- enforces that the same way addresses_one_default_per_user already does
-- for a per-user default address.
begin;

alter table public.products add column is_hero boolean not null default false;

create unique index products_is_hero_unique on public.products (is_hero) where is_hero;

commit;
