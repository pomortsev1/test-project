create or replace function public.ensure_profile_starter_template(
  p_profile_id uuid,
  p_template_name text default 'Starter Template'
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
    from public.get_starter_template_blueprints() as starter
    group by
      starter.template_slug,
      starter.template_name,
      starter.template_sort_order,
      starter.is_default
    order by starter.template_sort_order
  loop
    -- Insert safely with a non-default flag first; the existing trigger will
    -- promote the first template, and we can assign the intended default once
    -- the full starter set exists.
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
    from public.get_starter_template_blueprints() as starter
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
