create or replace function public.merge_packing_profiles(
  p_source_profile_id uuid,
  p_target_profile_id uuid
)
returns jsonb
language plpgsql
as $$
declare
  v_source_exists boolean;
  v_target_has_default boolean;
  v_source_category record;
  v_source_item record;
  v_target_category_id uuid;
  v_existing_item_id uuid;
  v_templates_moved integer := 0;
  v_trips_moved integer := 0;
  v_categories_moved integer := 0;
  v_categories_merged integer := 0;
  v_items_moved integer := 0;
  v_items_merged integer := 0;
begin
  if p_source_profile_id is null or p_target_profile_id is null then
    raise exception 'Both source and target profile ids are required.';
  end if;

  if p_source_profile_id = p_target_profile_id then
    return jsonb_build_object(
      'merged',
      false,
      'reason',
      'same_profile'
    );
  end if;

  select exists (
    select 1
    from public.profiles
    where id = p_source_profile_id
  )
  into v_source_exists;

  if not v_source_exists then
    return jsonb_build_object(
      'merged',
      false,
      'reason',
      'source_missing'
    );
  end if;

  insert into public.profiles (id)
  values (p_target_profile_id)
  on conflict (id) do nothing;

  select exists (
    select 1
    from public.packing_templates
    where profile_id = p_target_profile_id
      and is_default
  )
  into v_target_has_default;

  drop table if exists profile_merge_category_map;

  create temporary table profile_merge_category_map (
    source_id uuid primary key,
    target_id uuid not null,
    merged boolean not null
  ) on commit drop;

  for v_source_category in
    select id, name, slug
    from public.categories
    where scope = 'user'
      and profile_id = p_source_profile_id
    order by created_at, id
  loop
    select categories.id
    into v_target_category_id
    from public.categories
    where categories.scope = 'user'
      and categories.profile_id = p_target_profile_id
      and (
        lower(categories.name) = lower(v_source_category.name)
        or lower(categories.slug) = lower(v_source_category.slug)
      )
    order by
      case
        when lower(categories.name) = lower(v_source_category.name) then 0
        else 1
      end,
      categories.created_at,
      categories.id
    limit 1;

    if v_target_category_id is not null then
      insert into profile_merge_category_map (source_id, target_id, merged)
      values (v_source_category.id, v_target_category_id, true);
      v_categories_merged := v_categories_merged + 1;
    else
      update public.categories
      set profile_id = p_target_profile_id
      where id = v_source_category.id;

      insert into profile_merge_category_map (source_id, target_id, merged)
      values (v_source_category.id, v_source_category.id, false);
      v_categories_moved := v_categories_moved + 1;
    end if;
  end loop;

  for v_source_item in
    select id, category_id, normalized_name
    from public.catalog_items
    where scope = 'user'
      and profile_id = p_source_profile_id
    order by created_at, id
  loop
    select profile_merge_category_map.target_id
    into v_target_category_id
    from profile_merge_category_map
    where profile_merge_category_map.source_id = v_source_item.category_id;

    if v_target_category_id is null then
      v_target_category_id := v_source_item.category_id;
    end if;

    select catalog_items.id
    into v_existing_item_id
    from public.catalog_items
    where catalog_items.scope = 'user'
      and catalog_items.profile_id = p_target_profile_id
      and catalog_items.category_id = v_target_category_id
      and catalog_items.normalized_name = v_source_item.normalized_name
    order by catalog_items.created_at, catalog_items.id
    limit 1;

    if v_existing_item_id is not null then
      update public.packing_template_items
      set catalog_item_id = v_existing_item_id
      where catalog_item_id = v_source_item.id;

      update public.trip_items
      set catalog_item_id = v_existing_item_id
      where catalog_item_id = v_source_item.id;

      delete from public.catalog_items
      where id = v_source_item.id;

      v_items_merged := v_items_merged + 1;
    else
      update public.catalog_items
      set
        profile_id = p_target_profile_id,
        category_id = v_target_category_id
      where id = v_source_item.id;

      v_items_moved := v_items_moved + 1;
    end if;
  end loop;

  delete from public.categories
  using profile_merge_category_map
  where public.categories.id = profile_merge_category_map.source_id
    and profile_merge_category_map.merged;

  update public.packing_templates
  set
    profile_id = p_target_profile_id,
    is_default = case
      when is_default and not v_target_has_default then true
      else false
    end
  where profile_id = p_source_profile_id;

  get diagnostics v_templates_moved = row_count;

  update public.trips
  set profile_id = p_target_profile_id
  where profile_id = p_source_profile_id;

  get diagnostics v_trips_moved = row_count;

  delete from public.profiles
  where id = p_source_profile_id;

  update public.profiles
  set updated_at = now()
  where id = p_target_profile_id;

  return jsonb_build_object(
    'merged',
    true,
    'source_profile_id',
    p_source_profile_id,
    'target_profile_id',
    p_target_profile_id,
    'categories_moved',
    v_categories_moved,
    'categories_merged',
    v_categories_merged,
    'catalog_items_moved',
    v_items_moved,
    'catalog_items_merged',
    v_items_merged,
    'templates_moved',
    v_templates_moved,
    'trips_moved',
    v_trips_moved
  );
end;
$$;
