create schema if not exists private;

create table if not exists private.admin_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table private.admin_settings enable row level security;

revoke all on schema private from anon, authenticated;
revoke all on all tables in schema private from anon, authenticated;

create or replace function private.is_admin_secret(admin_secret text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from private.admin_settings
    where key = 'admin_db_secret'
      and value = admin_secret
  );
$$;

revoke all on function private.is_admin_secret(text) from public;

create or replace function public.admin_create_resource(admin_secret text, payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  inserted_id uuid;
begin
  if not private.is_admin_secret(admin_secret) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  if coalesce(payload ->> 'name', '') = ''
    or coalesce(payload ->> 'url', '') = ''
    or coalesce(payload ->> 'category_key', '') = '' then
    raise exception 'missing required resource fields' using errcode = '22023';
  end if;

  insert into public.resources (
    name,
    category_key,
    url,
    description,
    tags,
    region,
    status,
    score,
    visits
  )
  values (
    payload ->> 'name',
    payload ->> 'category_key',
    payload ->> 'url',
    coalesce(payload ->> 'description', ''),
    coalesce(
      (
        select array_agg(tag_value)
        from jsonb_array_elements_text(coalesce(payload -> 'tags', '[]'::jsonb)) as tags(tag_value)
      ),
      '{}'::text[]
    ),
    coalesce(nullif(payload ->> 'region', ''), '全球'),
    coalesce(nullif(payload ->> 'status', ''), 'active'),
    coalesce(nullif(payload ->> 'score', '')::numeric, 4.5),
    coalesce(nullif(payload ->> 'visits', '')::integer, 0)
  )
  returning id into inserted_id;

  insert into public.operation_logs (action, target_type, target_id)
  values ('新增站点', 'resource', inserted_id::text);

  return jsonb_build_object('id', inserted_id);
end;
$$;

create or replace function public.admin_create_model_price(admin_secret text, payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  upserted_id uuid;
begin
  if not private.is_admin_secret(admin_secret) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  if coalesce(payload ->> 'provider', '') = ''
    or coalesce(payload ->> 'model', '') = ''
    or coalesce(payload ->> 'context', '') = '' then
    raise exception 'missing required model price fields' using errcode = '22023';
  end if;

  insert into public.model_prices (
    provider,
    model,
    input_usd_per_1m,
    output_usd_per_1m,
    context,
    max_output,
    source,
    source_url,
    updated_at
  )
  values (
    payload ->> 'provider',
    payload ->> 'model',
    coalesce(nullif(payload ->> 'input_usd_per_1m', '')::numeric, 0),
    coalesce(nullif(payload ->> 'output_usd_per_1m', '')::numeric, 0),
    payload ->> 'context',
    nullif(payload ->> 'max_output', ''),
    coalesce(nullif(payload ->> 'source', ''), '后台录入'),
    coalesce(payload ->> 'source_url', ''),
    coalesce(nullif(payload ->> 'updated_at', '')::date, current_date)
  )
  on conflict (provider, model) do update set
    input_usd_per_1m = excluded.input_usd_per_1m,
    output_usd_per_1m = excluded.output_usd_per_1m,
    context = excluded.context,
    max_output = excluded.max_output,
    source = excluded.source,
    source_url = excluded.source_url,
    updated_at = excluded.updated_at
  returning id into upserted_id;

  insert into public.operation_logs (action, target_type, target_id)
  values ('更新模型价格', 'model_price', upserted_id::text);

  return jsonb_build_object('id', upserted_id);
end;
$$;

grant execute on function public.admin_create_resource(text, jsonb) to anon, authenticated;
grant execute on function public.admin_create_model_price(text, jsonb) to anon, authenticated;
