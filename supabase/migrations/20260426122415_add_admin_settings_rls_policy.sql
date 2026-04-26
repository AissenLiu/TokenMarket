grant usage on schema private to service_role;
grant select on private.admin_settings to service_role;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'private'
      and tablename = 'admin_settings'
      and policyname = 'admin_settings_service_role_select'
  ) then
    execute 'create policy admin_settings_service_role_select on private.admin_settings for select to service_role using (true)';
  end if;
end $$;
