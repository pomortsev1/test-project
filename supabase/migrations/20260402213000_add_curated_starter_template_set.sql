create or replace function public.get_starter_template_blueprints()
returns table (
  template_slug text,
  template_name text,
  template_sort_order integer,
  is_default boolean,
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
  with starter_items (
    template_slug,
    template_name,
    template_sort_order,
    is_default,
    category_slug,
    item_name,
    quantity,
    unit,
    sort_order
  ) as (
    values
      ('two-hour-trip', '2-hour trip', 1, false, 'misc', 'Keys', null::numeric, null::text, 10),
      ('two-hour-trip', '2-hour trip', 1, false, 'documents', 'Wallet', null::numeric, null::text, 20),
      ('two-hour-trip', '2-hour trip', 1, false, 'tech', 'Mobile phone', null::numeric, null::text, 30),
      ('two-hour-trip', '2-hour trip', 1, false, 'misc', 'Water bottle', null::numeric, null::text, 40),

      ('one-day-trip', '1-day trip essentials', 2, true, 'documents', 'Wallet', null::numeric, null::text, 10),
      ('one-day-trip', '1-day trip essentials', 2, true, 'documents', 'ID card', null::numeric, null::text, 20),
      ('one-day-trip', '1-day trip essentials', 2, true, 'tech', 'Mobile phone', null::numeric, null::text, 30),
      ('one-day-trip', '1-day trip essentials', 2, true, 'tech', 'Phone charger', 1::numeric, 'charger'::text, 40),
      ('one-day-trip', '1-day trip essentials', 2, true, 'misc', 'Keys', null::numeric, null::text, 50),
      ('one-day-trip', '1-day trip essentials', 2, true, 'misc', 'Water bottle', null::numeric, null::text, 60),
      ('one-day-trip', '1-day trip essentials', 2, true, 'health', 'Medication', 1::numeric, 'pack'::text, 70),
      ('one-day-trip', '1-day trip essentials', 2, true, 'misc', 'Sunglasses', null::numeric, null::text, 80),

      ('one-night-trip', '1-night light pack', 3, false, 'documents', 'Wallet', null::numeric, null::text, 10),
      ('one-night-trip', '1-night light pack', 3, false, 'documents', 'ID card', null::numeric, null::text, 20),
      ('one-night-trip', '1-night light pack', 3, false, 'tech', 'Mobile phone', null::numeric, null::text, 30),
      ('one-night-trip', '1-night light pack', 3, false, 'tech', 'Phone charger', 1::numeric, 'charger'::text, 40),
      ('one-night-trip', '1-night light pack', 3, false, 'misc', 'Keys', null::numeric, null::text, 50),
      ('one-night-trip', '1-night light pack', 3, false, 'clothes', 'T-shirts', 1::numeric, 't-shirt'::text, 60),
      ('one-night-trip', '1-night light pack', 3, false, 'clothes', 'Underwear', 1::numeric, 'pair'::text, 70),
      ('one-night-trip', '1-night light pack', 3, false, 'clothes', 'Socks', 1::numeric, 'pair'::text, 80),
      ('one-night-trip', '1-night light pack', 3, false, 'toiletries', 'Toothbrush', null::numeric, null::text, 90),
      ('one-night-trip', '1-night light pack', 3, false, 'toiletries', 'Toothpaste', 1::numeric, 'tube'::text, 100),
      ('one-night-trip', '1-night light pack', 3, false, 'toiletries', 'Deodorant', null::numeric, null::text, 110),
      ('one-night-trip', '1-night light pack', 3, false, 'clothes', 'Pajamas', 1::numeric, 'set'::text, 120),

      ('one-week-carry-on', '1-week carry-on', 4, false, 'documents', 'Passport', null::numeric, null::text, 10),
      ('one-week-carry-on', '1-week carry-on', 4, false, 'documents', 'Wallet', null::numeric, null::text, 20),
      ('one-week-carry-on', '1-week carry-on', 4, false, 'tech', 'Mobile phone', null::numeric, null::text, 30),
      ('one-week-carry-on', '1-week carry-on', 4, false, 'tech', 'Phone charger', 1::numeric, 'charger'::text, 40),
      ('one-week-carry-on', '1-week carry-on', 4, false, 'tech', 'Power bank', null::numeric, null::text, 50),
      ('one-week-carry-on', '1-week carry-on', 4, false, 'clothes', 'T-shirts', 5::numeric, 't-shirts'::text, 60),
      ('one-week-carry-on', '1-week carry-on', 4, false, 'clothes', 'Underwear', 7::numeric, 'pairs'::text, 70),
      ('one-week-carry-on', '1-week carry-on', 4, false, 'clothes', 'Socks', 7::numeric, 'pairs'::text, 80),
      ('one-week-carry-on', '1-week carry-on', 4, false, 'clothes', 'Trousers', 2::numeric, 'pairs'::text, 90),
      ('one-week-carry-on', '1-week carry-on', 4, false, 'clothes', 'Shorts', 2::numeric, 'pairs'::text, 100),
      ('one-week-carry-on', '1-week carry-on', 4, false, 'clothes', 'Hoodie', 1::numeric, 'hoodie'::text, 110),
      ('one-week-carry-on', '1-week carry-on', 4, false, 'clothes', 'Lightweight jacket', 1::numeric, 'jacket'::text, 120),
      ('one-week-carry-on', '1-week carry-on', 4, false, 'toiletries', 'Toothbrush', null::numeric, null::text, 130),
      ('one-week-carry-on', '1-week carry-on', 4, false, 'toiletries', 'Toothpaste', 1::numeric, 'tube'::text, 140),
      ('one-week-carry-on', '1-week carry-on', 4, false, 'toiletries', 'Deodorant', null::numeric, null::text, 150),
      ('one-week-carry-on', '1-week carry-on', 4, false, 'toiletries', 'Travel-size Shampoo', 1::numeric, 'bottle'::text, 160),
      ('one-week-carry-on', '1-week carry-on', 4, false, 'health', 'Medication', 1::numeric, 'pack'::text, 170),
      ('one-week-carry-on', '1-week carry-on', 4, false, 'misc', 'Laundry bag', null::numeric, null::text, 180),

      ('extended-trip-with-baggage', '1+ week with baggage', 5, false, 'documents', 'Passport', null::numeric, null::text, 10),
      ('extended-trip-with-baggage', '1+ week with baggage', 5, false, 'documents', 'Boarding pass', null::numeric, null::text, 20),
      ('extended-trip-with-baggage', '1+ week with baggage', 5, false, 'documents', 'Wallet', null::numeric, null::text, 30),
      ('extended-trip-with-baggage', '1+ week with baggage', 5, false, 'tech', 'Mobile phone', null::numeric, null::text, 40),
      ('extended-trip-with-baggage', '1+ week with baggage', 5, false, 'tech', 'Phone charger', 1::numeric, 'charger'::text, 50),
      ('extended-trip-with-baggage', '1+ week with baggage', 5, false, 'tech', 'Power bank', null::numeric, null::text, 60),
      ('extended-trip-with-baggage', '1+ week with baggage', 5, false, 'tech', 'Laptop', null::numeric, null::text, 70),
      ('extended-trip-with-baggage', '1+ week with baggage', 5, false, 'tech', 'Laptop charger', 1::numeric, 'charger'::text, 80),
      ('extended-trip-with-baggage', '1+ week with baggage', 5, false, 'tech', 'Travel adapter', 1::numeric, 'adapter'::text, 90),
      ('extended-trip-with-baggage', '1+ week with baggage', 5, false, 'clothes', 'T-shirts', 7::numeric, 't-shirts'::text, 100),
      ('extended-trip-with-baggage', '1+ week with baggage', 5, false, 'clothes', 'Underwear', 10::numeric, 'pairs'::text, 110),
      ('extended-trip-with-baggage', '1+ week with baggage', 5, false, 'clothes', 'Socks', 10::numeric, 'pairs'::text, 120),
      ('extended-trip-with-baggage', '1+ week with baggage', 5, false, 'clothes', 'Trousers', 3::numeric, 'pairs'::text, 130),
      ('extended-trip-with-baggage', '1+ week with baggage', 5, false, 'clothes', 'Shorts', 3::numeric, 'pairs'::text, 140),
      ('extended-trip-with-baggage', '1+ week with baggage', 5, false, 'clothes', 'Hoodie', 1::numeric, 'hoodie'::text, 150),
      ('extended-trip-with-baggage', '1+ week with baggage', 5, false, 'clothes', 'Lightweight jacket', 1::numeric, 'jacket'::text, 160),
      ('extended-trip-with-baggage', '1+ week with baggage', 5, false, 'clothes', 'Pajamas', 1::numeric, 'set'::text, 170),
      ('extended-trip-with-baggage', '1+ week with baggage', 5, false, 'clothes', 'Walking shoes', 1::numeric, 'pair'::text, 180),
      ('extended-trip-with-baggage', '1+ week with baggage', 5, false, 'clothes', 'Sandals', 1::numeric, 'pair'::text, 190),
      ('extended-trip-with-baggage', '1+ week with baggage', 5, false, 'toiletries', 'Toothbrush', null::numeric, null::text, 200),
      ('extended-trip-with-baggage', '1+ week with baggage', 5, false, 'toiletries', 'Toothpaste', 1::numeric, 'tube'::text, 210),
      ('extended-trip-with-baggage', '1+ week with baggage', 5, false, 'toiletries', 'Deodorant', null::numeric, null::text, 220),
      ('extended-trip-with-baggage', '1+ week with baggage', 5, false, 'toiletries', 'Sunscreen', 1::numeric, 'bottle'::text, 230),
      ('extended-trip-with-baggage', '1+ week with baggage', 5, false, 'toiletries', 'Travel-size Body wash', 1::numeric, 'bottle'::text, 240),
      ('extended-trip-with-baggage', '1+ week with baggage', 5, false, 'health', 'Medication', 1::numeric, 'pack'::text, 250)
  )
  select
    starter_items.template_slug,
    starter_items.template_name,
    starter_items.template_sort_order,
    starter_items.is_default,
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
  order by starter_items.template_sort_order, starter_items.sort_order;
$$;

create or replace function public.get_starter_template_blueprint()
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
  select
    starter.category_name,
    starter.catalog_item_id,
    starter.item_name,
    starter.quantity,
    starter.unit,
    starter.sort_order
  from public.get_starter_template_blueprints() as starter
  where starter.is_default
  order by starter.sort_order;
$$;

create or replace function public.copy_starter_template_for_profile(
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
    coalesce(
      nullif(btrim(p_template_name), ''),
      (
        select starter.template_name
        from public.get_starter_template_blueprints() as starter
        where starter.is_default
        limit 1
      ),
      'Starter Template'
    ),
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

create or replace function public.ensure_profile_starter_template(
  p_profile_id uuid,
  p_template_name text default 'Starter Template'
)
returns uuid
language plpgsql
as $$
declare
  default_template_id uuid;
  new_template_id uuid;
  template_blueprint record;
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

  perform public.seed_packing_system_defaults();

  for template_blueprint in
    select
      starter.template_slug,
      starter.template_name,
      starter.template_sort_order,
      starter.is_default
    from public.get_starter_template_blueprints() as starter
    group by
      starter.template_slug,
      starter.template_name,
      starter.template_sort_order,
      starter.is_default
    order by starter.template_sort_order
  loop
    insert into public.packing_templates (profile_id, name, is_default)
    values (
      p_profile_id,
      template_blueprint.template_name,
      template_blueprint.is_default
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
    from public.get_starter_template_blueprints() as starter
    where starter.template_slug = template_blueprint.template_slug
    order by starter.sort_order;

    if template_blueprint.is_default then
      default_template_id := new_template_id;
    end if;
  end loop;

  if default_template_id is null then
    raise exception 'Starter templates were inserted for profile %, but no default template was marked.', p_profile_id;
  end if;

  return default_template_id;
end;
$$;
