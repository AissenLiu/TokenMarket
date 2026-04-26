drop policy if exists "public insert submissions" on public.submissions;
create policy "public insert submissions"
on public.submissions
for insert
to anon, authenticated
with check (
  status = '待审核'
  and length(trim(site_name)) between 2 and 120
  and url ~* '^https?://'
  and category_key in ('coding', 'leaderboard', 'relay', 'topup', 'telegram', 'validation', 'tool')
  and length(trim(reason)) between 10 and 300
  and (contact is null or length(contact) <= 120)
);

drop policy if exists "service role read operation logs" on public.operation_logs;
create policy "service role read operation logs"
on public.operation_logs
for select
to service_role
using (true);

drop policy if exists "service role insert operation logs" on public.operation_logs;
create policy "service role insert operation logs"
on public.operation_logs
for insert
to service_role
with check (true);
