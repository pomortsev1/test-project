create or replace function public.prepare_snapshot_item_fields()
returns trigger
language plpgsql
as $$
begin
  new.item_name = btrim(new.item_name);
  new.item_normalized_name = public.normalize_name(
    coalesce(nullif(btrim(new.item_normalized_name), ''), new.item_name)
  );
  new.category_name = btrim(new.category_name);
  new.unit = nullif(btrim(coalesce(new.unit, '')), '');
  return new;
end;
$$;

alter table public.packing_template_items
  alter column quantity drop not null,
  alter column unit drop not null,
  drop constraint if exists packing_template_items_quantity_positive,
  drop constraint if exists packing_template_items_unit_not_blank,
  add constraint packing_template_items_measurement_pair_check check (
    (
      quantity is null
      and unit is null
    ) or (
      quantity is not null
      and unit is not null
      and quantity > 0
      and char_length(unit) > 0
    )
  );

alter table public.trip_items
  alter column quantity drop not null,
  alter column unit drop not null,
  drop constraint if exists trip_items_quantity_positive,
  drop constraint if exists trip_items_unit_not_blank,
  add constraint trip_items_measurement_pair_check check (
    (
      quantity is null
      and unit is null
    ) or (
      quantity is not null
      and unit is not null
      and quantity > 0
      and char_length(unit) > 0
    )
  );

create or replace function public.seed_packing_system_defaults()
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
    ('00000000-0000-0000-0000-000000000201', 'system', null, '00000000-0000-0000-0000-000000000101', 'Passport', 'passport', null),
    ('00000000-0000-0000-0000-000000000202', 'system', null, '00000000-0000-0000-0000-000000000101', 'Boarding pass', 'boarding pass', null),
    ('00000000-0000-0000-0000-000000000203', 'system', null, '00000000-0000-0000-0000-000000000101', 'Wallet', 'wallet', null),
    ('00000000-0000-0000-0000-000000000204', 'system', null, '00000000-0000-0000-0000-000000000102', 'Mobile phone', 'mobile phone', null),
    ('00000000-0000-0000-0000-000000000205', 'system', null, '00000000-0000-0000-0000-000000000102', 'Phone charger', 'phone charger', 'charger'),
    ('00000000-0000-0000-0000-000000000206', 'system', null, '00000000-0000-0000-0000-000000000102', 'Power bank', 'power bank', null),
    ('00000000-0000-0000-0000-000000000207', 'system', null, '00000000-0000-0000-0000-000000000102', 'Headphones', 'headphones', null),
    ('00000000-0000-0000-0000-000000000208', 'system', null, '00000000-0000-0000-0000-000000000103', 'T-shirts', 't-shirts', 'shirt'),
    ('00000000-0000-0000-0000-000000000209', 'system', null, '00000000-0000-0000-0000-000000000103', 'Socks', 'socks', 'pair'),
    ('00000000-0000-0000-0000-000000000210', 'system', null, '00000000-0000-0000-0000-000000000103', 'Underwear', 'underwear', 'pair'),
    ('00000000-0000-0000-0000-000000000211', 'system', null, '00000000-0000-0000-0000-000000000103', 'Trousers', 'trousers', 'pair'),
    ('00000000-0000-0000-0000-000000000212', 'system', null, '00000000-0000-0000-0000-000000000104', 'Toothbrush', 'toothbrush', null),
    ('00000000-0000-0000-0000-000000000213', 'system', null, '00000000-0000-0000-0000-000000000104', 'Toothpaste', 'toothpaste', 'tube'),
    ('00000000-0000-0000-0000-000000000214', 'system', null, '00000000-0000-0000-0000-000000000104', 'Deodorant', 'deodorant', null),
    ('00000000-0000-0000-0000-000000000215', 'system', null, '00000000-0000-0000-0000-000000000105', 'Medication', 'medication', 'pack'),
    ('00000000-0000-0000-0000-000000000216', 'system', null, '00000000-0000-0000-0000-000000000106', 'Keys', 'keys', null),
    ('00000000-0000-0000-0000-000000000217', 'system', null, '00000000-0000-0000-0000-000000000106', 'Water bottle', 'water bottle', null),
    ('00000000-0000-0000-0000-000000000218', 'system', null, '00000000-0000-0000-0000-000000000101', 'ID card', 'id card', null),
    ('00000000-0000-0000-0000-000000000219', 'system', null, '00000000-0000-0000-0000-000000000101', 'Travel insurance card', 'travel insurance card', null),
    ('00000000-0000-0000-0000-000000000220', 'system', null, '00000000-0000-0000-0000-000000000102', 'Laptop', 'laptop', null),
    ('00000000-0000-0000-0000-000000000221', 'system', null, '00000000-0000-0000-0000-000000000102', 'Laptop charger', 'laptop charger', 'charger'),
    ('00000000-0000-0000-0000-000000000222', 'system', null, '00000000-0000-0000-0000-000000000102', 'Travel adapter', 'travel adapter', 'adapter'),
    ('00000000-0000-0000-0000-000000000223', 'system', null, '00000000-0000-0000-0000-000000000102', 'Earbuds', 'earbuds', null),
    ('00000000-0000-0000-0000-000000000224', 'system', null, '00000000-0000-0000-0000-000000000103', 'Hoodie', 'hoodie', 'hoodie'),
    ('00000000-0000-0000-0000-000000000225', 'system', null, '00000000-0000-0000-0000-000000000103', 'Lightweight jacket', 'lightweight jacket', 'jacket'),
    ('00000000-0000-0000-0000-000000000226', 'system', null, '00000000-0000-0000-0000-000000000103', 'Pajamas', 'pajamas', 'set'),
    ('00000000-0000-0000-0000-000000000227', 'system', null, '00000000-0000-0000-0000-000000000104', 'Sunscreen', 'sunscreen', 'bottle'),
    ('00000000-0000-0000-0000-000000000228', 'system', null, '00000000-0000-0000-0000-000000000104', 'Lip balm', 'lip balm', null),
    ('00000000-0000-0000-0000-000000000229', 'system', null, '00000000-0000-0000-0000-000000000104', 'Hand sanitizer', 'hand sanitizer', 'bottle'),
    ('00000000-0000-0000-0000-000000000230', 'system', null, '00000000-0000-0000-0000-000000000105', 'Painkillers', 'painkillers', 'pack'),
    ('00000000-0000-0000-0000-000000000231', 'system', null, '00000000-0000-0000-0000-000000000105', 'Plasters', 'plasters', 'pack'),
    ('00000000-0000-0000-0000-000000000232', 'system', null, '00000000-0000-0000-0000-000000000106', 'Sunglasses', 'sunglasses', null),
    ('00000000-0000-0000-0000-000000000233', 'system', null, '00000000-0000-0000-0000-000000000106', 'Tote bag', 'tote bag', null),
    ('00000000-0000-0000-0000-000000000234', 'system', null, '00000000-0000-0000-0000-000000000106', 'Laundry bag', 'laundry bag', null)
  on conflict (id) do update
  set category_id = excluded.category_id,
      name = excluded.name,
      normalized_name = excluded.normalized_name,
      default_unit = excluded.default_unit,
      updated_at = now();
end;
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
  with starter_items (category_slug, item_name, quantity, unit, sort_order) as (
    values
      ('documents', 'Passport', null::numeric, null::text, 10),
      ('documents', 'Boarding pass', null::numeric, null::text, 20),
      ('documents', 'Wallet', null::numeric, null::text, 30),
      ('documents', 'ID card', null::numeric, null::text, 40),
      ('tech', 'Mobile phone', null::numeric, null::text, 50),
      ('tech', 'Phone charger', 1::numeric, 'charger', 60),
      ('tech', 'Power bank', null::numeric, null::text, 70),
      ('tech', 'Headphones', null::numeric, null::text, 80),
      ('tech', 'Travel adapter', 1::numeric, 'adapter', 90),
      ('clothes', 'T-shirts', 4::numeric, 't-shirts', 100),
      ('clothes', 'Socks', 4::numeric, 'pairs', 110),
      ('clothes', 'Underwear', 4::numeric, 'pairs', 120),
      ('clothes', 'Trousers', 2::numeric, 'pairs', 130),
      ('clothes', 'Hoodie', 1::numeric, 'hoodie', 140),
      ('clothes', 'Pajamas', 1::numeric, 'set', 150),
      ('toiletries', 'Toothbrush', null::numeric, null::text, 160),
      ('toiletries', 'Toothpaste', 1::numeric, 'tube', 170),
      ('toiletries', 'Deodorant', null::numeric, null::text, 180),
      ('toiletries', 'Sunscreen', 1::numeric, 'bottle', 190),
      ('health', 'Medication', 1::numeric, 'pack', 200),
      ('health', 'Painkillers', 1::numeric, 'pack', 210),
      ('misc', 'Keys', null::numeric, null::text, 220),
      ('misc', 'Water bottle', null::numeric, null::text, 230),
      ('misc', 'Sunglasses', null::numeric, null::text, 240),
      ('misc', 'Tote bag', null::numeric, null::text, 250)
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

select public.seed_packing_system_defaults();
