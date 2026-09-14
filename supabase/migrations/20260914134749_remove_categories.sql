-- Client decision: no category concept at all — just products. Drop it
-- entirely, same treatment as the earlier collections removal.
begin;

alter table public.products drop column category_id;

drop table public.categories;

commit;
