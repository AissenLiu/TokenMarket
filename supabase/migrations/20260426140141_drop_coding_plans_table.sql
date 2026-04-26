drop table if exists public.coding_plans cascade;

update public.categories
set count = 38,
    updated_at = now()
where key = 'coding';
