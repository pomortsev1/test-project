alter table public.profiles
  add column if not exists display_name text,
  add column if not exists email text;

update public.profiles
set
  display_name = nullif(btrim(coalesce(display_name, '')), ''),
  email = nullif(lower(btrim(coalesce(email, ''))), '');
