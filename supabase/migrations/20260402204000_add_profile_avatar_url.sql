alter table public.profiles
  add column if not exists avatar_url text;

update public.profiles
set avatar_url = nullif(btrim(coalesce(avatar_url, '')), '');
