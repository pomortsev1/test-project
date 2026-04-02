create extension if not exists pgcrypto with schema extensions;

create type public.scope as enum ('system', 'user');
create type public.trip_mode as enum ('simple', 'multi_stop');
create type public.trip_status as enum ('draft', 'active', 'completed', 'archived');
create type public.stop_kind as enum ('home', 'stop');
create type public.leg_status as enum ('pending', 'active', 'completed', 'skipped');

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create function public.normalize_name(value text)
returns text
language sql
immutable
strict
as $$
  select lower(regexp_replace(btrim(value), '\s+', ' ', 'g'));
$$;

create function public.slugify(value text)
returns text
language sql
immutable
strict
as $$
  select trim(both '-' from regexp_replace(public.normalize_name(value), '[^a-z0-9]+', '-', 'g'));
$$;

create function public.prepare_category_fields()
returns trigger
language plpgsql
as $$
begin
  new.name = btrim(new.name);
  new.slug = public.slugify(coalesce(nullif(btrim(new.slug), ''), new.name));
  return new;
end;
$$;

create function public.prepare_catalog_item_fields()
returns trigger
language plpgsql
as $$
begin
  new.name = btrim(new.name);
  new.normalized_name = public.normalize_name(coalesce(nullif(btrim(new.normalized_name), ''), new.name));
  new.default_unit = nullif(btrim(coalesce(new.default_unit, '')), '');
  return new;
end;
$$;

create function public.prepare_snapshot_item_fields()
returns trigger
language plpgsql
as $$
begin
  new.item_name = btrim(new.item_name);
  new.item_normalized_name = public.normalize_name(
    coalesce(nullif(btrim(new.item_normalized_name), ''), new.item_name)
  );
  new.category_name = btrim(new.category_name);
  new.unit = btrim(new.unit);
  return new;
end;
$$;

create function public.prepare_named_fields()
returns trigger
language plpgsql
as $$
begin
  new.name = btrim(new.name);
  return new;
end;
$$;

create function public.sync_trip_leg_item_check_packed_at()
returns trigger
language plpgsql
as $$
begin
  if new.is_packed then
    new.packed_at = coalesce(new.packed_at, now());
  else
    new.packed_at = null;
  end if;

  return new;
end;
$$;

create function public.validate_catalog_item_scope()
returns trigger
language plpgsql
as $$
declare
  category_scope public.scope;
  category_profile_id uuid;
begin
  select categories.scope, categories.profile_id
  into category_scope, category_profile_id
  from public.categories
  where categories.id = new.category_id;

  if not found then
    raise exception 'Category % does not exist.', new.category_id;
  end if;

  if category_scope <> new.scope then
    raise exception 'Catalog item scope % must match category scope %.', new.scope, category_scope;
  end if;

  if new.scope = 'system' and category_profile_id is not null then
    raise exception 'System catalog items must belong to system categories.';
  end if;

  if new.scope = 'user' and category_profile_id is distinct from new.profile_id then
    raise exception 'User catalog items must belong to categories owned by the same profile.';
  end if;

  return new;
end;
$$;

create function public.validate_trip_leg_stops()
returns trigger
language plpgsql
as $$
declare
  from_trip_id uuid;
  from_position integer;
  to_trip_id uuid;
  to_position integer;
begin
  select trip_stops.trip_id, trip_stops.position
  into from_trip_id, from_position
  from public.trip_stops
  where trip_stops.id = new.from_stop_id;

  if not found then
    raise exception 'Trip leg from_stop_id % does not exist.', new.from_stop_id;
  end if;

  select trip_stops.trip_id, trip_stops.position
  into to_trip_id, to_position
  from public.trip_stops
  where trip_stops.id = new.to_stop_id;

  if not found then
    raise exception 'Trip leg to_stop_id % does not exist.', new.to_stop_id;
  end if;

  if from_trip_id <> new.trip_id or to_trip_id <> new.trip_id then
    raise exception 'Trip leg stops must belong to trip %.', new.trip_id;
  end if;

  if from_position >= to_position then
    raise exception 'Trip leg from_stop_id % must come before to_stop_id %.', new.from_stop_id, new.to_stop_id;
  end if;

  return new;
end;
$$;

create function public.validate_trip_leg_item_check_trip()
returns trigger
language plpgsql
as $$
declare
  leg_trip_id uuid;
  trip_item_trip_id uuid;
begin
  select trip_legs.trip_id
  into leg_trip_id
  from public.trip_legs
  where trip_legs.id = new.leg_id;

  if not found then
    raise exception 'Trip leg % does not exist.', new.leg_id;
  end if;

  select trip_items.trip_id
  into trip_item_trip_id
  from public.trip_items
  where trip_items.id = new.trip_item_id;

  if not found then
    raise exception 'Trip item % does not exist.', new.trip_item_id;
  end if;

  if leg_trip_id <> trip_item_trip_id then
    raise exception 'Trip leg item checks must reference rows from the same trip.';
  end if;

  return new;
end;
$$;

create table public.profiles (
  id uuid primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default extensions.gen_random_uuid(),
  scope public.scope not null,
  profile_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_scope_profile_check check (
    (scope = 'system' and profile_id is null)
    or (scope = 'user' and profile_id is not null)
  ),
  constraint categories_name_not_blank check (char_length(btrim(name)) > 0),
  constraint categories_slug_not_blank check (char_length(btrim(slug)) > 0)
);

create table public.catalog_items (
  id uuid primary key default extensions.gen_random_uuid(),
  scope public.scope not null,
  profile_id uuid references public.profiles(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null,
  normalized_name text not null,
  default_unit text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_items_scope_profile_check check (
    (scope = 'system' and profile_id is null)
    or (scope = 'user' and profile_id is not null)
  ),
  constraint catalog_items_name_not_blank check (char_length(btrim(name)) > 0),
  constraint catalog_items_normalized_name_not_blank check (char_length(btrim(normalized_name)) > 0),
  constraint catalog_items_default_unit_not_blank check (
    default_unit is null or char_length(btrim(default_unit)) > 0
  )
);

create table public.packing_templates (
  id uuid primary key default extensions.gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint packing_templates_name_not_blank check (char_length(btrim(name)) > 0)
);

create table public.packing_template_items (
  id uuid primary key default extensions.gen_random_uuid(),
  template_id uuid not null references public.packing_templates(id) on delete cascade,
  catalog_item_id uuid references public.catalog_items(id) on delete set null,
  item_name text not null,
  item_normalized_name text not null,
  category_name text not null,
  quantity numeric not null,
  unit text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint packing_template_items_item_name_not_blank check (char_length(btrim(item_name)) > 0),
  constraint packing_template_items_item_normalized_name_not_blank check (
    char_length(btrim(item_normalized_name)) > 0
  ),
  constraint packing_template_items_category_name_not_blank check (char_length(btrim(category_name)) > 0),
  constraint packing_template_items_quantity_positive check (quantity > 0),
  constraint packing_template_items_unit_not_blank check (char_length(btrim(unit)) > 0),
  constraint packing_template_items_sort_order_non_negative check (sort_order >= 0)
);

create table public.trips (
  id uuid primary key default extensions.gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  template_id uuid references public.packing_templates(id) on delete set null,
  name text not null,
  mode public.trip_mode not null,
  status public.trip_status not null default 'draft',
  current_leg_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trips_name_not_blank check (char_length(btrim(name)) > 0),
  constraint trips_current_leg_index_non_negative check (current_leg_index >= 0)
);

create table public.trip_stops (
  id uuid primary key default extensions.gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  position integer not null,
  name text not null,
  kind public.stop_kind not null,
  created_at timestamptz not null default now(),
  constraint trip_stops_position_non_negative check (position >= 0),
  constraint trip_stops_name_not_blank check (char_length(btrim(name)) > 0)
);

create table public.trip_items (
  id uuid primary key default extensions.gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  catalog_item_id uuid references public.catalog_items(id) on delete set null,
  template_item_id uuid references public.packing_template_items(id) on delete set null,
  item_name text not null,
  item_normalized_name text not null,
  category_name text not null,
  quantity numeric not null,
  unit text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint trip_items_item_name_not_blank check (char_length(btrim(item_name)) > 0),
  constraint trip_items_item_normalized_name_not_blank check (char_length(btrim(item_normalized_name)) > 0),
  constraint trip_items_category_name_not_blank check (char_length(btrim(category_name)) > 0),
  constraint trip_items_quantity_positive check (quantity > 0),
  constraint trip_items_unit_not_blank check (char_length(btrim(unit)) > 0),
  constraint trip_items_sort_order_non_negative check (sort_order >= 0)
);

create table public.trip_legs (
  id uuid primary key default extensions.gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  position integer not null,
  from_stop_id uuid not null references public.trip_stops(id) on delete restrict,
  to_stop_id uuid not null references public.trip_stops(id) on delete restrict,
  status public.leg_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trip_legs_position_non_negative check (position >= 0),
  constraint trip_legs_distinct_stops check (from_stop_id <> to_stop_id)
);

create table public.trip_leg_item_checks (
  id uuid primary key default extensions.gen_random_uuid(),
  leg_id uuid not null references public.trip_legs(id) on delete cascade,
  trip_item_id uuid not null references public.trip_items(id) on delete cascade,
  is_packed boolean not null default false,
  packed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index categories_system_name_key
  on public.categories (lower(name))
  where scope = 'system';

create unique index categories_system_slug_key
  on public.categories (lower(slug))
  where scope = 'system';

create unique index categories_user_profile_name_key
  on public.categories (profile_id, lower(name))
  where scope = 'user';

create unique index categories_user_profile_slug_key
  on public.categories (profile_id, lower(slug))
  where scope = 'user';

create unique index catalog_items_category_normalized_name_key
  on public.catalog_items (category_id, normalized_name);

create unique index packing_templates_default_per_profile_key
  on public.packing_templates (profile_id)
  where is_default;

create unique index trip_stops_trip_position_key
  on public.trip_stops (trip_id, position);

create unique index trip_legs_trip_position_key
  on public.trip_legs (trip_id, position);

create unique index trip_legs_active_per_trip_key
  on public.trip_legs (trip_id)
  where status = 'active';

create unique index trip_leg_item_checks_leg_item_key
  on public.trip_leg_item_checks (leg_id, trip_item_id);

create index categories_profile_scope_idx on public.categories (profile_id, scope, name);
create index catalog_items_profile_scope_idx on public.catalog_items (profile_id, scope, category_id);
create index catalog_items_name_search_idx on public.catalog_items (normalized_name, name);
create index packing_templates_profile_created_idx on public.packing_templates (profile_id, created_at);
create index packing_template_items_template_sort_idx on public.packing_template_items (template_id, sort_order, created_at);
create index trips_profile_status_idx on public.trips (profile_id, status, created_at);
create index trip_items_trip_sort_idx on public.trip_items (trip_id, sort_order, created_at);
create index trip_legs_trip_status_idx on public.trip_legs (trip_id, status, position);
create index trip_leg_item_checks_trip_item_idx on public.trip_leg_item_checks (trip_item_id);

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger categories_prepare_fields
before insert or update on public.categories
for each row
execute function public.prepare_category_fields();

create trigger categories_set_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();

create trigger catalog_items_prepare_fields
before insert or update on public.catalog_items
for each row
execute function public.prepare_catalog_item_fields();

create trigger catalog_items_validate_scope
before insert or update on public.catalog_items
for each row
execute function public.validate_catalog_item_scope();

create trigger catalog_items_set_updated_at
before update on public.catalog_items
for each row
execute function public.set_updated_at();

create trigger packing_templates_prepare_fields
before insert or update on public.packing_templates
for each row
execute function public.prepare_named_fields();

create trigger packing_templates_set_updated_at
before update on public.packing_templates
for each row
execute function public.set_updated_at();

create trigger packing_template_items_prepare_fields
before insert or update on public.packing_template_items
for each row
execute function public.prepare_snapshot_item_fields();

create trigger packing_template_items_set_updated_at
before update on public.packing_template_items
for each row
execute function public.set_updated_at();

create trigger trips_prepare_fields
before insert or update on public.trips
for each row
execute function public.prepare_named_fields();

create trigger trips_set_updated_at
before update on public.trips
for each row
execute function public.set_updated_at();

create trigger trip_stops_prepare_fields
before insert or update on public.trip_stops
for each row
execute function public.prepare_named_fields();

create trigger trip_items_prepare_fields
before insert or update on public.trip_items
for each row
execute function public.prepare_snapshot_item_fields();

create trigger trip_legs_validate_stops
before insert or update on public.trip_legs
for each row
execute function public.validate_trip_leg_stops();

create trigger trip_legs_set_updated_at
before update on public.trip_legs
for each row
execute function public.set_updated_at();

create trigger trip_leg_item_checks_validate_trip
before insert or update on public.trip_leg_item_checks
for each row
execute function public.validate_trip_leg_item_check_trip();

create trigger trip_leg_item_checks_sync_packed_at
before insert or update on public.trip_leg_item_checks
for each row
execute function public.sync_trip_leg_item_check_packed_at();

create trigger trip_leg_item_checks_set_updated_at
before update on public.trip_leg_item_checks
for each row
execute function public.set_updated_at();

create function public.set_default_packing_template(p_profile_id uuid, p_template_id uuid)
returns uuid
language plpgsql
as $$
begin
  if not exists (
    select 1
    from public.packing_templates
    where id = p_template_id
      and profile_id = p_profile_id
  ) then
    raise exception 'Template % does not belong to profile %.', p_template_id, p_profile_id;
  end if;

  update public.packing_templates
  set is_default = false
  where profile_id = p_profile_id
    and is_default;

  update public.packing_templates
  set is_default = true
  where id = p_template_id;

  return p_template_id;
end;
$$;

create function public.ensure_first_template_is_default()
returns trigger
language plpgsql
as $$
begin
  if not exists (
    select 1
    from public.packing_templates
    where profile_id = new.profile_id
  ) then
    new.is_default = true;
  end if;

  return new;
end;
$$;

create trigger packing_templates_ensure_first_default
before insert on public.packing_templates
for each row
execute function public.ensure_first_template_is_default();

create function public.promote_replacement_default_template()
returns trigger
language plpgsql
as $$
declare
  replacement_template_id uuid;
begin
  if not old.is_default then
    return null;
  end if;

  select packing_templates.id
  into replacement_template_id
  from public.packing_templates
  where packing_templates.profile_id = old.profile_id
  order by packing_templates.created_at, packing_templates.id
  limit 1;

  if replacement_template_id is not null then
    update public.packing_templates
    set is_default = true
    where id = replacement_template_id;
  end if;

  return null;
end;
$$;

create trigger packing_templates_promote_default_after_delete
after delete on public.packing_templates
for each row
execute function public.promote_replacement_default_template();

create function public.seed_packing_system_defaults()
returns void
language plpgsql
as $$
begin
  insert into public.categories (id, scope, profile_id, name, slug)
  values
    ('00000000-0000-0000-0000-000000000101', 'system', null, 'Documents', 'documents'),
    ('00000000-0000-0000-0000-000000000102', 'system', null, 'Tech', 'tech'),
    ('00000000-0000-0000-0000-000000000103', 'system', null, 'Clothes', 'clothes'),
    ('00000000-0000-0000-0000-000000000104', 'system', null, 'Toiletries', 'toiletries'),
    ('00000000-0000-0000-0000-000000000105', 'system', null, 'Health', 'health'),
    ('00000000-0000-0000-0000-000000000106', 'system', null, 'Misc', 'misc')
  on conflict (id) do update
  set name = excluded.name,
      slug = excluded.slug,
      updated_at = now();

  insert into public.catalog_items (id, scope, profile_id, category_id, name, normalized_name, default_unit)
  values
    ('00000000-0000-0000-0000-000000000201', 'system', null, '00000000-0000-0000-0000-000000000101', 'Passport', 'passport', 'document'),
    ('00000000-0000-0000-0000-000000000202', 'system', null, '00000000-0000-0000-0000-000000000101', 'Boarding pass', 'boarding pass', 'document'),
    ('00000000-0000-0000-0000-000000000203', 'system', null, '00000000-0000-0000-0000-000000000101', 'Wallet', 'wallet', 'wallet'),
    ('00000000-0000-0000-0000-000000000204', 'system', null, '00000000-0000-0000-0000-000000000102', 'Mobile phone', 'mobile phone', 'phone'),
    ('00000000-0000-0000-0000-000000000205', 'system', null, '00000000-0000-0000-0000-000000000102', 'Phone charger', 'phone charger', 'charger'),
    ('00000000-0000-0000-0000-000000000206', 'system', null, '00000000-0000-0000-0000-000000000102', 'Power bank', 'power bank', 'battery'),
    ('00000000-0000-0000-0000-000000000207', 'system', null, '00000000-0000-0000-0000-000000000102', 'Headphones', 'headphones', 'pair'),
    ('00000000-0000-0000-0000-000000000208', 'system', null, '00000000-0000-0000-0000-000000000103', 'T-shirts', 't-shirts', 'shirt'),
    ('00000000-0000-0000-0000-000000000209', 'system', null, '00000000-0000-0000-0000-000000000103', 'Socks', 'socks', 'pair'),
    ('00000000-0000-0000-0000-000000000210', 'system', null, '00000000-0000-0000-0000-000000000103', 'Underwear', 'underwear', 'pair'),
    ('00000000-0000-0000-0000-000000000211', 'system', null, '00000000-0000-0000-0000-000000000103', 'Trousers', 'trousers', 'pair'),
    ('00000000-0000-0000-0000-000000000212', 'system', null, '00000000-0000-0000-0000-000000000104', 'Toothbrush', 'toothbrush', 'toothbrush'),
    ('00000000-0000-0000-0000-000000000213', 'system', null, '00000000-0000-0000-0000-000000000104', 'Toothpaste', 'toothpaste', 'tube'),
    ('00000000-0000-0000-0000-000000000214', 'system', null, '00000000-0000-0000-0000-000000000104', 'Deodorant', 'deodorant', 'deodorant'),
    ('00000000-0000-0000-0000-000000000215', 'system', null, '00000000-0000-0000-0000-000000000105', 'Medication', 'medication', 'pack'),
    ('00000000-0000-0000-0000-000000000216', 'system', null, '00000000-0000-0000-0000-000000000106', 'Keys', 'keys', 'set'),
    ('00000000-0000-0000-0000-000000000217', 'system', null, '00000000-0000-0000-0000-000000000106', 'Water bottle', 'water bottle', 'bottle')
  on conflict (id) do update
  set category_id = excluded.category_id,
      name = excluded.name,
      normalized_name = excluded.normalized_name,
      default_unit = excluded.default_unit,
      updated_at = now();
end;
$$;

create function public.get_starter_template_blueprint()
returns table (
  category_name text,
  catalog_item_id uuid,
  item_name text,
  quantity numeric,
  unit text,
  sort_order integer
)
language sql
stable
as $$
  with starter_items (category_slug, item_name, quantity, unit, sort_order) as (
    values
      ('documents', 'Passport', 1::numeric, 'document', 10),
      ('documents', 'Boarding pass', 1::numeric, 'document', 20),
      ('documents', 'Wallet', 1::numeric, 'wallet', 30),
      ('tech', 'Mobile phone', 1::numeric, 'phone', 40),
      ('tech', 'Phone charger', 1::numeric, 'charger', 50),
      ('tech', 'Power bank', 1::numeric, 'battery', 60),
      ('tech', 'Headphones', 1::numeric, 'pair', 70),
      ('clothes', 'T-shirts', 4::numeric, 'shirts', 80),
      ('clothes', 'Socks', 4::numeric, 'pairs', 90),
      ('clothes', 'Underwear', 4::numeric, 'pairs', 100),
      ('clothes', 'Trousers', 2::numeric, 'pairs', 110),
      ('toiletries', 'Toothbrush', 1::numeric, 'toothbrush', 120),
      ('toiletries', 'Toothpaste', 1::numeric, 'tube', 130),
      ('toiletries', 'Deodorant', 1::numeric, 'deodorant', 140),
      ('health', 'Medication', 1::numeric, 'pack', 150),
      ('misc', 'Keys', 1::numeric, 'set', 160),
      ('misc', 'Water bottle', 1::numeric, 'bottle', 170)
  )
  select
    categories.name as category_name,
    catalog_items.id as catalog_item_id,
    starter_items.item_name,
    starter_items.quantity,
    starter_items.unit,
    starter_items.sort_order
  from starter_items
  join public.categories
    on categories.scope = 'system'
   and categories.slug = starter_items.category_slug
  join public.catalog_items
    on catalog_items.category_id = categories.id
   and catalog_items.normalized_name = public.normalize_name(starter_items.item_name)
  order by starter_items.sort_order;
$$;

create function public.copy_starter_template_for_profile(
  p_profile_id uuid,
  p_template_name text default 'Starter Template'
)
returns uuid
language plpgsql
as $$
declare
  new_template_id uuid;
begin
  perform public.seed_packing_system_defaults();

  if not exists (
    select 1
    from public.profiles
    where profiles.id = p_profile_id
  ) then
    raise exception 'Profile % does not exist.', p_profile_id;
  end if;

  insert into public.packing_templates (profile_id, name, is_default)
  values (
    p_profile_id,
    coalesce(nullif(btrim(p_template_name), ''), 'Starter Template'),
    not exists (
      select 1
      from public.packing_templates
      where packing_templates.profile_id = p_profile_id
        and packing_templates.is_default
    )
  )
  returning id into new_template_id;

  insert into public.packing_template_items (
    template_id,
    catalog_item_id,
    item_name,
    item_normalized_name,
    category_name,
    quantity,
    unit,
    sort_order
  )
  select
    new_template_id,
    starter.catalog_item_id,
    starter.item_name,
    public.normalize_name(starter.item_name),
    starter.category_name,
    starter.quantity,
    starter.unit,
    starter.sort_order
  from public.get_starter_template_blueprint() as starter;

  return new_template_id;
end;
$$;

create function public.ensure_profile_starter_template(
  p_profile_id uuid,
  p_template_name text default 'Starter Template'
)
returns uuid
language plpgsql
as $$
declare
  default_template_id uuid;
begin
  insert into public.profiles (id)
  values (p_profile_id)
  on conflict (id) do nothing;

  select packing_templates.id
  into default_template_id
  from public.packing_templates
  where packing_templates.profile_id = p_profile_id
    and packing_templates.is_default
  order by packing_templates.created_at, packing_templates.id
  limit 1;

  if default_template_id is not null then
    return default_template_id;
  end if;

  select packing_templates.id
  into default_template_id
  from public.packing_templates
  where packing_templates.profile_id = p_profile_id
  order by packing_templates.created_at, packing_templates.id
  limit 1;

  if default_template_id is not null then
    perform public.set_default_packing_template(p_profile_id, default_template_id);
    return default_template_id;
  end if;

  return public.copy_starter_template_for_profile(p_profile_id, p_template_name);
end;
$$;

select public.seed_packing_system_defaults();
