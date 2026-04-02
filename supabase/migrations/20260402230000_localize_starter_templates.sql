create or replace function public.get_starter_template_blueprints(
  p_locale text default 'en'
)
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
  with resolved_locale as (
    select case
      when lower(coalesce(p_locale, '')) like 'es%' then 'es'
      when lower(coalesce(p_locale, '')) like 'ca%' then 'ca'
      when lower(coalesce(p_locale, '')) like 'ru%' then 'ru'
      else 'en'
    end as locale
  ),
  starter_items (
    template_slug,
    template_sort_order,
    is_default,
    category_slug,
    item_name_en,
    quantity,
    unit_key,
    sort_order
  ) as (
    values
      ('two-hour-trip', 1, false, 'misc', 'Keys', null::numeric, null::text, 10),
      ('two-hour-trip', 1, false, 'documents', 'Wallet', null::numeric, null::text, 20),
      ('two-hour-trip', 1, false, 'tech', 'Mobile phone', null::numeric, null::text, 30),
      ('two-hour-trip', 1, false, 'misc', 'Water bottle', null::numeric, null::text, 40),

      ('one-day-trip', 2, true, 'documents', 'Wallet', null::numeric, null::text, 10),
      ('one-day-trip', 2, true, 'documents', 'ID card', null::numeric, null::text, 20),
      ('one-day-trip', 2, true, 'tech', 'Mobile phone', null::numeric, null::text, 30),
      ('one-day-trip', 2, true, 'tech', 'Phone charger', 1::numeric, 'charger', 40),
      ('one-day-trip', 2, true, 'misc', 'Keys', null::numeric, null::text, 50),
      ('one-day-trip', 2, true, 'misc', 'Water bottle', null::numeric, null::text, 60),
      ('one-day-trip', 2, true, 'health', 'Medication', 1::numeric, 'pack', 70),
      ('one-day-trip', 2, true, 'misc', 'Sunglasses', null::numeric, null::text, 80),

      ('one-night-trip', 3, false, 'documents', 'Wallet', null::numeric, null::text, 10),
      ('one-night-trip', 3, false, 'documents', 'ID card', null::numeric, null::text, 20),
      ('one-night-trip', 3, false, 'tech', 'Mobile phone', null::numeric, null::text, 30),
      ('one-night-trip', 3, false, 'tech', 'Phone charger', 1::numeric, 'charger', 40),
      ('one-night-trip', 3, false, 'misc', 'Keys', null::numeric, null::text, 50),
      ('one-night-trip', 3, false, 'clothes', 'T-shirts', 1::numeric, 't-shirt', 60),
      ('one-night-trip', 3, false, 'clothes', 'Underwear', 1::numeric, 'pair', 70),
      ('one-night-trip', 3, false, 'clothes', 'Socks', 1::numeric, 'pair', 80),
      ('one-night-trip', 3, false, 'toiletries', 'Toothbrush', null::numeric, null::text, 90),
      ('one-night-trip', 3, false, 'toiletries', 'Toothpaste', 1::numeric, 'tube', 100),
      ('one-night-trip', 3, false, 'toiletries', 'Deodorant', null::numeric, null::text, 110),
      ('one-night-trip', 3, false, 'clothes', 'Pajamas', 1::numeric, 'set', 120),

      ('one-week-carry-on', 4, false, 'documents', 'Passport', null::numeric, null::text, 10),
      ('one-week-carry-on', 4, false, 'documents', 'Wallet', null::numeric, null::text, 20),
      ('one-week-carry-on', 4, false, 'tech', 'Mobile phone', null::numeric, null::text, 30),
      ('one-week-carry-on', 4, false, 'tech', 'Phone charger', 1::numeric, 'charger', 40),
      ('one-week-carry-on', 4, false, 'tech', 'Power bank', null::numeric, null::text, 50),
      ('one-week-carry-on', 4, false, 'clothes', 'T-shirts', 5::numeric, 't-shirts', 60),
      ('one-week-carry-on', 4, false, 'clothes', 'Underwear', 7::numeric, 'pairs', 70),
      ('one-week-carry-on', 4, false, 'clothes', 'Socks', 7::numeric, 'pairs', 80),
      ('one-week-carry-on', 4, false, 'clothes', 'Trousers', 2::numeric, 'pairs', 90),
      ('one-week-carry-on', 4, false, 'clothes', 'Shorts', 2::numeric, 'pairs', 100),
      ('one-week-carry-on', 4, false, 'clothes', 'Hoodie', 1::numeric, 'hoodie', 110),
      ('one-week-carry-on', 4, false, 'clothes', 'Lightweight jacket', 1::numeric, 'jacket', 120),
      ('one-week-carry-on', 4, false, 'toiletries', 'Toothbrush', null::numeric, null::text, 130),
      ('one-week-carry-on', 4, false, 'toiletries', 'Toothpaste', 1::numeric, 'tube', 140),
      ('one-week-carry-on', 4, false, 'toiletries', 'Deodorant', null::numeric, null::text, 150),
      ('one-week-carry-on', 4, false, 'toiletries', 'Travel-size Shampoo', 1::numeric, 'bottle', 160),
      ('one-week-carry-on', 4, false, 'health', 'Medication', 1::numeric, 'pack', 170),
      ('one-week-carry-on', 4, false, 'misc', 'Laundry bag', null::numeric, null::text, 180),

      ('extended-trip-with-baggage', 5, false, 'documents', 'Passport', null::numeric, null::text, 10),
      ('extended-trip-with-baggage', 5, false, 'documents', 'Boarding pass', null::numeric, null::text, 20),
      ('extended-trip-with-baggage', 5, false, 'documents', 'Wallet', null::numeric, null::text, 30),
      ('extended-trip-with-baggage', 5, false, 'tech', 'Mobile phone', null::numeric, null::text, 40),
      ('extended-trip-with-baggage', 5, false, 'tech', 'Phone charger', 1::numeric, 'charger', 50),
      ('extended-trip-with-baggage', 5, false, 'tech', 'Power bank', null::numeric, null::text, 60),
      ('extended-trip-with-baggage', 5, false, 'tech', 'Laptop', null::numeric, null::text, 70),
      ('extended-trip-with-baggage', 5, false, 'tech', 'Laptop charger', 1::numeric, 'charger', 80),
      ('extended-trip-with-baggage', 5, false, 'tech', 'Travel adapter', 1::numeric, 'adapter', 90),
      ('extended-trip-with-baggage', 5, false, 'clothes', 'T-shirts', 7::numeric, 't-shirts', 100),
      ('extended-trip-with-baggage', 5, false, 'clothes', 'Underwear', 10::numeric, 'pairs', 110),
      ('extended-trip-with-baggage', 5, false, 'clothes', 'Socks', 10::numeric, 'pairs', 120),
      ('extended-trip-with-baggage', 5, false, 'clothes', 'Trousers', 3::numeric, 'pairs', 130),
      ('extended-trip-with-baggage', 5, false, 'clothes', 'Shorts', 3::numeric, 'pairs', 140),
      ('extended-trip-with-baggage', 5, false, 'clothes', 'Hoodie', 1::numeric, 'hoodie', 150),
      ('extended-trip-with-baggage', 5, false, 'clothes', 'Lightweight jacket', 1::numeric, 'jacket', 160),
      ('extended-trip-with-baggage', 5, false, 'clothes', 'Pajamas', 1::numeric, 'set', 170),
      ('extended-trip-with-baggage', 5, false, 'clothes', 'Walking shoes', 1::numeric, 'pair', 180),
      ('extended-trip-with-baggage', 5, false, 'clothes', 'Sandals', 1::numeric, 'pair', 190),
      ('extended-trip-with-baggage', 5, false, 'toiletries', 'Toothbrush', null::numeric, null::text, 200),
      ('extended-trip-with-baggage', 5, false, 'toiletries', 'Toothpaste', 1::numeric, 'tube', 210),
      ('extended-trip-with-baggage', 5, false, 'toiletries', 'Deodorant', null::numeric, null::text, 220),
      ('extended-trip-with-baggage', 5, false, 'toiletries', 'Sunscreen', 1::numeric, 'bottle', 230),
      ('extended-trip-with-baggage', 5, false, 'toiletries', 'Travel-size Body wash', 1::numeric, 'bottle', 240),
      ('extended-trip-with-baggage', 5, false, 'health', 'Medication', 1::numeric, 'pack', 250)
  ),
  template_translations (locale, template_slug, template_name) as (
    values
      ('en', 'two-hour-trip', '2-hour trip'),
      ('en', 'one-day-trip', '1-day trip essentials'),
      ('en', 'one-night-trip', '1-night light pack'),
      ('en', 'one-week-carry-on', '1-week carry-on'),
      ('en', 'extended-trip-with-baggage', '1+ week with baggage'),
      ('es', 'two-hour-trip', 'Viaje de 2 horas'),
      ('es', 'one-day-trip', 'Imprescindibles para 1 día'),
      ('es', 'one-night-trip', 'Equipaje ligero para 1 noche'),
      ('es', 'one-week-carry-on', 'Equipaje de mano para 1 semana'),
      ('es', 'extended-trip-with-baggage', 'Más de 1 semana con equipaje'),
      ('ca', 'two-hour-trip', 'Viatge de 2 hores'),
      ('ca', 'one-day-trip', 'Imprescindibles per a 1 dia'),
      ('ca', 'one-night-trip', 'Equipatge lleuger per a 1 nit'),
      ('ca', 'one-week-carry-on', 'Equipatge de mà per a 1 setmana'),
      ('ca', 'extended-trip-with-baggage', 'Més d''1 setmana amb equipatge'),
      ('ru', 'two-hour-trip', 'Поездка на 2 часа'),
      ('ru', 'one-day-trip', 'Необходимое на 1 день'),
      ('ru', 'one-night-trip', 'Лёгкий набор на 1 ночь'),
      ('ru', 'one-week-carry-on', 'Ручная кладь на 1 неделю'),
      ('ru', 'extended-trip-with-baggage', 'Больше недели с багажом')
  ),
  category_translations (locale, category_slug, category_name) as (
    values
      ('en', 'documents', 'Documents'),
      ('en', 'tech', 'Tech'),
      ('en', 'clothes', 'Clothes'),
      ('en', 'toiletries', 'Toiletries'),
      ('en', 'health', 'Health'),
      ('en', 'misc', 'Misc'),
      ('es', 'documents', 'Documentos'),
      ('es', 'tech', 'Tecnología'),
      ('es', 'clothes', 'Ropa'),
      ('es', 'toiletries', 'Aseo'),
      ('es', 'health', 'Salud'),
      ('es', 'misc', 'Varios'),
      ('ca', 'documents', 'Documents'),
      ('ca', 'tech', 'Tecnologia'),
      ('ca', 'clothes', 'Roba'),
      ('ca', 'toiletries', 'Higiene'),
      ('ca', 'health', 'Salut'),
      ('ca', 'misc', 'Divers'),
      ('ru', 'documents', 'Документы'),
      ('ru', 'tech', 'Техника'),
      ('ru', 'clothes', 'Одежда'),
      ('ru', 'toiletries', 'Туалетные принадлежности'),
      ('ru', 'health', 'Здоровье'),
      ('ru', 'misc', 'Разное')
  ),
  item_translations (locale, item_name_en, item_name) as (
    values
      ('en', 'Keys', 'Keys'),
      ('en', 'Wallet', 'Wallet'),
      ('en', 'Mobile phone', 'Mobile phone'),
      ('en', 'Water bottle', 'Water bottle'),
      ('en', 'ID card', 'ID card'),
      ('en', 'Phone charger', 'Phone charger'),
      ('en', 'Medication', 'Medication'),
      ('en', 'Sunglasses', 'Sunglasses'),
      ('en', 'T-shirts', 'T-shirts'),
      ('en', 'Underwear', 'Underwear'),
      ('en', 'Socks', 'Socks'),
      ('en', 'Toothbrush', 'Toothbrush'),
      ('en', 'Toothpaste', 'Toothpaste'),
      ('en', 'Deodorant', 'Deodorant'),
      ('en', 'Pajamas', 'Pajamas'),
      ('en', 'Passport', 'Passport'),
      ('en', 'Power bank', 'Power bank'),
      ('en', 'Trousers', 'Trousers'),
      ('en', 'Shorts', 'Shorts'),
      ('en', 'Hoodie', 'Hoodie'),
      ('en', 'Lightweight jacket', 'Lightweight jacket'),
      ('en', 'Travel-size Shampoo', 'Travel-size Shampoo'),
      ('en', 'Laundry bag', 'Laundry bag'),
      ('en', 'Boarding pass', 'Boarding pass'),
      ('en', 'Laptop', 'Laptop'),
      ('en', 'Laptop charger', 'Laptop charger'),
      ('en', 'Travel adapter', 'Travel adapter'),
      ('en', 'Walking shoes', 'Walking shoes'),
      ('en', 'Sandals', 'Sandals'),
      ('en', 'Sunscreen', 'Sunscreen'),
      ('en', 'Travel-size Body wash', 'Travel-size Body wash'),
      ('es', 'Keys', 'Llaves'),
      ('es', 'Wallet', 'Cartera'),
      ('es', 'Mobile phone', 'Móvil'),
      ('es', 'Water bottle', 'Botella de agua'),
      ('es', 'ID card', 'Documento de identidad'),
      ('es', 'Phone charger', 'Cargador del móvil'),
      ('es', 'Medication', 'Medicación'),
      ('es', 'Sunglasses', 'Gafas de sol'),
      ('es', 'T-shirts', 'Camisetas'),
      ('es', 'Underwear', 'Ropa interior'),
      ('es', 'Socks', 'Calcetines'),
      ('es', 'Toothbrush', 'Cepillo de dientes'),
      ('es', 'Toothpaste', 'Pasta de dientes'),
      ('es', 'Deodorant', 'Desodorante'),
      ('es', 'Pajamas', 'Pijama'),
      ('es', 'Passport', 'Pasaporte'),
      ('es', 'Power bank', 'Batería externa'),
      ('es', 'Trousers', 'Pantalones'),
      ('es', 'Shorts', 'Pantalones cortos'),
      ('es', 'Hoodie', 'Sudadera con capucha'),
      ('es', 'Lightweight jacket', 'Chaqueta ligera'),
      ('es', 'Travel-size Shampoo', 'Champú tamaño viaje'),
      ('es', 'Laundry bag', 'Bolsa para la ropa sucia'),
      ('es', 'Boarding pass', 'Tarjeta de embarque'),
      ('es', 'Laptop', 'Portátil'),
      ('es', 'Laptop charger', 'Cargador del portátil'),
      ('es', 'Travel adapter', 'Adaptador de viaje'),
      ('es', 'Walking shoes', 'Zapatillas para caminar'),
      ('es', 'Sandals', 'Sandalias'),
      ('es', 'Sunscreen', 'Protector solar'),
      ('es', 'Travel-size Body wash', 'Gel corporal tamaño viaje'),
      ('ca', 'Keys', 'Claus'),
      ('ca', 'Wallet', 'Cartera'),
      ('ca', 'Mobile phone', 'Mòbil'),
      ('ca', 'Water bottle', 'Ampolla d''aigua'),
      ('ca', 'ID card', 'Document d''identitat'),
      ('ca', 'Phone charger', 'Carregador del mòbil'),
      ('ca', 'Medication', 'Medicació'),
      ('ca', 'Sunglasses', 'Ulleres de sol'),
      ('ca', 'T-shirts', 'Samarretes'),
      ('ca', 'Underwear', 'Roba interior'),
      ('ca', 'Socks', 'Mitjons'),
      ('ca', 'Toothbrush', 'Raspall de dents'),
      ('ca', 'Toothpaste', 'Pasta de dents'),
      ('ca', 'Deodorant', 'Desodorant'),
      ('ca', 'Pajamas', 'Pijama'),
      ('ca', 'Passport', 'Passaport'),
      ('ca', 'Power bank', 'Bateria externa'),
      ('ca', 'Trousers', 'Pantalons'),
      ('ca', 'Shorts', 'Pantalons curts'),
      ('ca', 'Hoodie', 'Dessuadora amb caputxa'),
      ('ca', 'Lightweight jacket', 'Jaqueta lleugera'),
      ('ca', 'Travel-size Shampoo', 'Xampú mida viatge'),
      ('ca', 'Laundry bag', 'Bossa per a la roba bruta'),
      ('ca', 'Boarding pass', 'Targeta d''embarcament'),
      ('ca', 'Laptop', 'Portàtil'),
      ('ca', 'Laptop charger', 'Carregador del portàtil'),
      ('ca', 'Travel adapter', 'Adaptador de viatge'),
      ('ca', 'Walking shoes', 'Sabates per caminar'),
      ('ca', 'Sandals', 'Sandàlies'),
      ('ca', 'Sunscreen', 'Protector solar'),
      ('ca', 'Travel-size Body wash', 'Gel corporal mida viatge'),
      ('ru', 'Keys', 'Ключи'),
      ('ru', 'Wallet', 'Кошелёк'),
      ('ru', 'Mobile phone', 'Телефон'),
      ('ru', 'Water bottle', 'Бутылка воды'),
      ('ru', 'ID card', 'Удостоверение личности'),
      ('ru', 'Phone charger', 'Зарядка для телефона'),
      ('ru', 'Medication', 'Лекарства'),
      ('ru', 'Sunglasses', 'Солнцезащитные очки'),
      ('ru', 'T-shirts', 'Футболки'),
      ('ru', 'Underwear', 'Нижнее бельё'),
      ('ru', 'Socks', 'Носки'),
      ('ru', 'Toothbrush', 'Зубная щётка'),
      ('ru', 'Toothpaste', 'Зубная паста'),
      ('ru', 'Deodorant', 'Дезодорант'),
      ('ru', 'Pajamas', 'Пижама'),
      ('ru', 'Passport', 'Паспорт'),
      ('ru', 'Power bank', 'Пауэрбанк'),
      ('ru', 'Trousers', 'Брюки'),
      ('ru', 'Shorts', 'Шорты'),
      ('ru', 'Hoodie', 'Худи'),
      ('ru', 'Lightweight jacket', 'Лёгкая куртка'),
      ('ru', 'Travel-size Shampoo', 'Шампунь дорожного формата'),
      ('ru', 'Laundry bag', 'Мешок для грязного белья'),
      ('ru', 'Boarding pass', 'Посадочный талон'),
      ('ru', 'Laptop', 'Ноутбук'),
      ('ru', 'Laptop charger', 'Зарядка для ноутбука'),
      ('ru', 'Travel adapter', 'Дорожный адаптер'),
      ('ru', 'Walking shoes', 'Обувь для ходьбы'),
      ('ru', 'Sandals', 'Сандалии'),
      ('ru', 'Sunscreen', 'Солнцезащитный крем'),
      ('ru', 'Travel-size Body wash', 'Гель для душа дорожного формата')
  ),
  unit_translations (locale, unit_key, unit_name) as (
    values
      ('en', 'charger', 'charger'),
      ('en', 'pack', 'pack'),
      ('en', 't-shirt', 't-shirt'),
      ('en', 't-shirts', 't-shirts'),
      ('en', 'pair', 'pair'),
      ('en', 'pairs', 'pairs'),
      ('en', 'set', 'set'),
      ('en', 'hoodie', 'hoodie'),
      ('en', 'jacket', 'jacket'),
      ('en', 'tube', 'tube'),
      ('en', 'bottle', 'bottle'),
      ('en', 'adapter', 'adapter'),
      ('es', 'charger', 'cargador'),
      ('es', 'pack', 'paquete'),
      ('es', 't-shirt', 'camiseta'),
      ('es', 't-shirts', 'camisetas'),
      ('es', 'pair', 'par'),
      ('es', 'pairs', 'pares'),
      ('es', 'set', 'conjunto'),
      ('es', 'hoodie', 'sudadera'),
      ('es', 'jacket', 'chaqueta'),
      ('es', 'tube', 'tubo'),
      ('es', 'bottle', 'botella'),
      ('es', 'adapter', 'adaptador'),
      ('ca', 'charger', 'carregador'),
      ('ca', 'pack', 'paquet'),
      ('ca', 't-shirt', 'samarreta'),
      ('ca', 't-shirts', 'samarretes'),
      ('ca', 'pair', 'parell'),
      ('ca', 'pairs', 'parells'),
      ('ca', 'set', 'conjunt'),
      ('ca', 'hoodie', 'dessuadora'),
      ('ca', 'jacket', 'jaqueta'),
      ('ca', 'tube', 'tub'),
      ('ca', 'bottle', 'ampolla'),
      ('ca', 'adapter', 'adaptador'),
      ('ru', 'charger', 'зарядка'),
      ('ru', 'pack', 'упаковка'),
      ('ru', 't-shirt', 'футболка'),
      ('ru', 't-shirts', 'футболки'),
      ('ru', 'pair', 'пара'),
      ('ru', 'pairs', 'пар'),
      ('ru', 'set', 'комплект'),
      ('ru', 'hoodie', 'худи'),
      ('ru', 'jacket', 'куртка'),
      ('ru', 'tube', 'тюбик'),
      ('ru', 'bottle', 'флакон'),
      ('ru', 'adapter', 'адаптер')
  )
  select
    starter_items.template_slug,
    template_translations.template_name,
    starter_items.template_sort_order,
    starter_items.is_default,
    category_translations.category_name,
    catalog_items.id as catalog_item_id,
    item_translations.item_name,
    starter_items.quantity,
    unit_translations.unit_name,
    starter_items.sort_order
  from starter_items
  cross join resolved_locale
  join template_translations
    on template_translations.locale = resolved_locale.locale
   and template_translations.template_slug = starter_items.template_slug
  join category_translations
    on category_translations.locale = resolved_locale.locale
   and category_translations.category_slug = starter_items.category_slug
  join item_translations
    on item_translations.locale = resolved_locale.locale
   and item_translations.item_name_en = starter_items.item_name_en
  left join unit_translations
    on unit_translations.locale = resolved_locale.locale
   and unit_translations.unit_key = starter_items.unit_key
  join public.categories
    on categories.scope = 'system'
   and categories.slug = starter_items.category_slug
  join public.catalog_items
    on catalog_items.category_id = categories.id
   and catalog_items.normalized_name = public.normalize_name(starter_items.item_name_en)
  order by starter_items.template_sort_order, starter_items.sort_order;
$$;

create or replace function public.get_starter_template_blueprint(
  p_locale text default 'en'
)
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
  from public.get_starter_template_blueprints(p_locale) as starter
  where starter.is_default
  order by starter.sort_order;
$$;

create or replace function public.copy_starter_template_for_profile(
  p_profile_id uuid,
  p_template_name text default 'Starter Template',
  p_locale text default 'en'
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
      nullif(
        case
          when p_template_name = 'Starter Template' then null
          else btrim(p_template_name)
        end,
        ''
      ),
      (
        select starter.template_name
        from public.get_starter_template_blueprints(p_locale) as starter
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
  from public.get_starter_template_blueprint(p_locale) as starter;

  return new_template_id;
end;
$$;

create or replace function public.ensure_profile_starter_template(
  p_profile_id uuid,
  p_template_name text default 'Starter Template',
  p_locale text default 'en'
)
returns uuid
language plpgsql
as $function$
declare
  existing_default_template_id uuid;
  inserted_template_id uuid;
  selected_default_template_id uuid;
  first_inserted_template_id uuid;
  template_blueprint record;
begin
  insert into public.profiles (id)
  values (p_profile_id)
  on conflict (id) do nothing;

  select packing_templates.id
  into existing_default_template_id
  from public.packing_templates
  where packing_templates.profile_id = p_profile_id
    and packing_templates.is_default
  order by packing_templates.created_at, packing_templates.id
  limit 1;

  if existing_default_template_id is not null then
    return existing_default_template_id;
  end if;

  select packing_templates.id
  into existing_default_template_id
  from public.packing_templates
  where packing_templates.profile_id = p_profile_id
  order by packing_templates.created_at, packing_templates.id
  limit 1;

  if existing_default_template_id is not null then
    perform public.set_default_packing_template(p_profile_id, existing_default_template_id);
    return existing_default_template_id;
  end if;

  perform public.seed_packing_system_defaults();

  for template_blueprint in
    select
      starter.template_slug,
      starter.template_name,
      starter.template_sort_order,
      starter.is_default
    from public.get_starter_template_blueprints(p_locale) as starter
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
      false
    )
    returning id into inserted_template_id;

    if first_inserted_template_id is null then
      first_inserted_template_id := inserted_template_id;
    end if;

    if template_blueprint.is_default and selected_default_template_id is null then
      selected_default_template_id := inserted_template_id;
    end if;

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
      inserted_template_id,
      starter.catalog_item_id,
      starter.item_name,
      public.normalize_name(starter.item_name),
      starter.category_name,
      starter.quantity,
      starter.unit,
      starter.sort_order
    from public.get_starter_template_blueprints(p_locale) as starter
    where starter.template_slug = template_blueprint.template_slug
    order by starter.sort_order;
  end loop;

  if selected_default_template_id is null then
    selected_default_template_id := first_inserted_template_id;
  end if;

  if selected_default_template_id is null then
    raise exception 'Starter template blueprints are empty for profile %.', p_profile_id;
  end if;

  perform public.set_default_packing_template(
    p_profile_id,
    selected_default_template_id
  );

  return selected_default_template_id;
end;
$function$;
