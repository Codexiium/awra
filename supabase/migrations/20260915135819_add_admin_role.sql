-- Adds an admin role flag to profiles, for the new /admin panel.
--
-- SECURITY: profiles_update_own (initial_schema.sql) only checks row ownership
-- (auth.uid() = id), not which columns change. RLS cannot express a column-level
-- rule. Without narrowing the grant below, any authenticated user could self-
-- promote with a direct PostgREST call: PATCH /rest/v1/profiles?id=eq.<own uid>
-- {"is_admin": true} — never touching application code at all. So the blanket
-- `grant update on public.profiles to authenticated` (grants.sql) is replaced
-- with a column-level grant covering only the two columns the app's own
-- updateProfile action writes (full_name, phone). service_role is unaffected
-- (blanket grant in grants.sql), so admin writes via the admin client still work.
--
-- Any future migration that does `grant update on public.profiles to authenticated`
-- (without a column list) will silently reopen this hole — don't do that.
begin;

alter table public.profiles add column is_admin boolean not null default false;

revoke update on public.profiles from authenticated;
grant update (full_name, phone) on public.profiles to authenticated;

commit;
