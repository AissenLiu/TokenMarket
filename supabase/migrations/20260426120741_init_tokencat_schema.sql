create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text not null default '',
  icon_name text not null default 'Boxes',
  sort_order integer not null default 100,
  count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category_key text not null references public.categories(key),
  url text not null,
  description text not null default '',
  tags text[] not null default '{}',
  region text not null default '全球',
  status text not null default 'active',
  score numeric(4,2) not null default 4.5,
  visits integer not null default 0,
  latency_ms integer,
  uptime numeric(5,2),
  water_rate numeric(5,2),
  pricing_note text,
  source_name text,
  source_url text,
  models text[] default '{}',
  verified_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint resources_status_check check (status in ('active', 'pending', 'archived')),
  constraint resources_region_check check (region in ('国内', '海外', '全球'))
);

create table if not exists public.coding_plans (
  id uuid primary key default gen_random_uuid(),
  vendor text not null,
  plan text not null,
  monthly_price text not null,
  quota text not null,
  quota_type text not null default 'Usage-based',
  period text not null default 'month',
  requests text,
  tokens text,
  monthly_value text,
  value_ratio text,
  tps text,
  included_models text[] not null default '{}',
  strengths text[] not null default '{}',
  best_for text not null default '',
  official_url text not null,
  source_name text not null default '后台录入',
  source_url text not null default '',
  score numeric(4,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.model_prices (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  model text not null,
  input_usd_per_1m numeric(12,6),
  output_usd_per_1m numeric(12,6),
  context text not null,
  max_output text,
  source text not null default 'LiteLLM',
  source_url text not null default 'https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json',
  updated_at date not null default current_date,
  created_at timestamptz not null default now(),
  unique(provider, model)
);

create table if not exists public.model_rankings (
  id uuid primary key default gen_random_uuid(),
  rank integer not null,
  model text not null,
  provider text not null,
  arena_score integer not null default 0,
  code_score integer not null default 0,
  chinese_score integer not null default 0,
  reasoning_score integer not null default 0,
  context text not null default '-',
  source text not null default '综合',
  source_url text not null default '',
  badge text not null default '综合',
  created_at timestamptz not null default now(),
  unique(source, rank)
);

create table if not exists public.relay_evaluations (
  id uuid primary key default gen_random_uuid(),
  relay_name text not null,
  model text not null,
  endpoint text not null,
  latency_ms integer not null default 0,
  availability numeric(5,2) not null default 0,
  water_rate numeric(5,2) not null default 0,
  authenticity text not null default '待复测',
  quality_score integer not null default 0,
  checked_at timestamptz not null default now(),
  notes text not null default '',
  source_name text not null default '后台录入',
  source_url text not null default '',
  created_at timestamptz not null default now(),
  constraint relay_authenticity_check check (authenticity in ('原生', '疑似路由', '待复测'))
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  site_name text not null,
  url text not null,
  category_key text not null,
  reason text not null,
  contact text,
  status text not null default '待审核',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  constraint submissions_status_check check (status in ('待审核', '已通过', '已拒绝'))
);

create table if not exists public.operation_logs (
  id uuid primary key default gen_random_uuid(),
  actor text not null default 'admin',
  action text not null,
  target_type text not null,
  target_id text,
  ip_address text,
  created_at timestamptz not null default now()
);

create index if not exists idx_resources_category_status on public.resources(category_key, status);
create index if not exists idx_resources_score on public.resources(score desc);
create index if not exists idx_model_rankings_rank on public.model_rankings(rank);
create index if not exists idx_relay_evaluations_checked_at on public.relay_evaluations(checked_at desc);
create index if not exists idx_submissions_status on public.submissions(status, created_at desc);

alter table public.categories enable row level security;
alter table public.resources enable row level security;
alter table public.coding_plans enable row level security;
alter table public.model_prices enable row level security;
alter table public.model_rankings enable row level security;
alter table public.relay_evaluations enable row level security;
alter table public.submissions enable row level security;
alter table public.operation_logs enable row level security;

drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select using (true);

drop policy if exists "public read active resources" on public.resources;
create policy "public read active resources" on public.resources for select using (status = 'active');

drop policy if exists "public read coding plans" on public.coding_plans;
create policy "public read coding plans" on public.coding_plans for select using (true);

drop policy if exists "public read model prices" on public.model_prices;
create policy "public read model prices" on public.model_prices for select using (true);

drop policy if exists "public read model rankings" on public.model_rankings;
create policy "public read model rankings" on public.model_rankings for select using (true);

drop policy if exists "public read relay evaluations" on public.relay_evaluations;
create policy "public read relay evaluations" on public.relay_evaluations for select using (true);

drop policy if exists "public insert submissions" on public.submissions;
create policy "public insert submissions" on public.submissions for insert with check (true);

insert into public.categories (key, name, description, icon_name, sort_order, count)
values
  ('coding', 'Coding Plan 对比', '国内外 AI 编程订阅、额度、模型与调用价格对比', 'Code2', 1, 12),
  ('leaderboard', '大模型排行', '综合 Arena、SuperCLUE 与代码能力的模型榜单', 'Trophy', 2, 26),
  ('relay', '中转站导航', 'API 中转站收录、延迟、可用性与支持模型', 'Network', 3, 18),
  ('topup', '代充站导航', 'AI 订阅代充、账号服务与价格提示', 'WalletCards', 4, 9),
  ('telegram', '飞机频道导航', 'AI 工具、羊毛、开发与资源频道聚合', 'Send', 5, 31),
  ('validation', '模型验证评价', '中转站模型可用性、原生度、响应质量跟踪', 'ShieldCheck', 6, 42),
  ('tool', '工具站', 'AI 工具集合与效率网站', 'Boxes', 7, 0)
on conflict (key) do update set
  name = excluded.name,
  description = excluded.description,
  icon_name = excluded.icon_name,
  sort_order = excluded.sort_order,
  count = excluded.count;

insert into public.resources
  (name, category_key, url, description, tags, region, status, score, visits, latency_ms, uptime, pricing_note, models, verified_at)
values
  ('禾维 AI 排行榜', 'relay', 'https://www.hvoy.ai/leaderboard/', '人工实测 API 中转站收录，展示延迟、可用性与模型覆盖。', array['Claude','OpenAI','Gemini','实测'], '国内', 'active', 4.7, 26800, 165, 99.3, '按站点倍率计费', array['Claude','GPT','Gemini','DeepSeek'], '2026-04-20'),
  ('Aibijia AI 比价', 'topup', 'https://www.aibijia.org/', 'AI 订阅一键比价，覆盖 ChatGPT、Claude、Gemini 等订阅服务。', array['订阅','比价','代充'], '国内', 'active', 4.5, 21300, null, null, '价格仅供参考', array[]::text[], '2026-04-26'),
  ('LiteLLM 模型价格库', 'coding', 'https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json', '开源模型价格与上下文窗口数据库，适合做 API 价格基准。', array['价格','API','开源'], '全球', 'active', 4.9, 18900, null, null, null, array['OpenAI','Anthropic','Google','DeepSeek'], '2026-04-26'),
  ('Awesome Coding Plan', 'coding', 'https://github.com/mahonzhan/awesome-coding-plan', '各厂家 Coding Plan 实际价值对比，关注额度、模型与订阅体验。', array['Coding','Plan','GitHub'], '全球', 'active', 4.8, 12600, null, null, null, array[]::text[], '2026-04-19'),
  ('Arena Leaderboard', 'leaderboard', 'https://arena.ai/leaderboard', '基于真实用户投票的模型能力排行榜，覆盖文本、代码、图像等赛道。', array['榜单','ELO','代码'], '海外', 'active', 4.9, 52200, null, null, null, array[]::text[], '2026-04-25'),
  ('SuperCLUE', 'leaderboard', 'https://www.superclueai.com/generalpage', '中文大模型综合能力评测，覆盖通用、推理、Agent 与应用能力。', array['中文','评测','榜单'], '国内', 'active', 4.6, 30800, null, null, null, array[]::text[], '2026-04-21'),
  ('TelegramGroup', 'telegram', 'https://github.com/itgoyo/TelegramGroup', 'Telegram 群组与频道开源整理，适合发现 AI 工具与开发资源频道。', array['Telegram','频道','GitHub'], '全球', 'active', 4.3, 18100, null, null, null, array[]::text[], '2026-01-12')
on conflict do nothing;

insert into public.coding_plans
  (vendor, plan, monthly_price, quota, included_models, strengths, best_for, official_url, score)
values
  ('Cursor', 'Pro', '$20 / 月', '包含快速请求与慢速池，额度随官方策略调整', array['Claude Sonnet','GPT-4.1','Gemini'], array['IDE 集成成熟','多人协作体验好','适合日常重构'], '长期使用 AI IDE 的工程团队', 'https://cursor.com/pricing', 9.1),
  ('Anthropic', 'Claude Code / Pro', '$20 起', '按订阅与模型速率限制组合', array['Claude Sonnet','Claude Opus'], array['长上下文','代码理解强','终端工作流自然'], '复杂代码库理解与代理式开发', 'https://www.anthropic.com/claude-code', 9.5),
  ('GitHub', 'Copilot Pro', '$10 / 月', '包含补全、聊天与高级请求池', array['GPT','Claude','Gemini'], array['生态覆盖广','补全稳定','企业管理成熟'], 'GitHub 深度用户与企业开发流', 'https://github.com/features/copilot/plans', 8.8),
  ('Windsurf', 'Pro', '$15 / 月', '按用户请求、Cascade 与模型调用限制', array['Claude','GPT','SWE'], array['Agent 编程体验强','项目级上下文','价格友好'], '希望以较低成本使用 Agent IDE 的个人开发者', 'https://windsurf.com/pricing', 8.7)
on conflict do nothing;

insert into public.model_prices
  (provider, model, input_usd_per_1m, output_usd_per_1m, context, source, updated_at)
values
  ('OpenAI', 'GPT-4o', 2.5, 10, '128K', 'LiteLLM / OpenAI', '2026-04-26'),
  ('Anthropic', 'Claude 3.5 Sonnet', 3, 15, '200K', 'LiteLLM / Anthropic', '2026-04-26'),
  ('Google', 'Gemini 1.5 Pro', 1.25, 5, '1M', 'LiteLLM / Google', '2026-04-26'),
  ('阿里云', 'Qwen2.5 72B', 0.35, 0.4, '128K', 'LiteLLM', '2026-04-26'),
  ('DeepSeek', 'DeepSeek-V2.5', 0.14, 0.28, '128K', 'LiteLLM', '2026-04-26')
on conflict (provider, model) do update set
  input_usd_per_1m = excluded.input_usd_per_1m,
  output_usd_per_1m = excluded.output_usd_per_1m,
  context = excluded.context,
  source = excluded.source,
  updated_at = excluded.updated_at;

insert into public.model_rankings
  (rank, model, provider, arena_score, code_score, chinese_score, reasoning_score, context, source)
values
  (1, 'Claude Opus 4.7 Thinking', 'Anthropic', 1503, 1572, 92, 97, '200K', 'Arena'),
  (2, 'Claude Opus 4.6', 'Anthropic', 1496, 1545, 91, 96, '200K', 'Arena'),
  (3, 'Gemini 3.1 Pro Preview', 'Google', 1493, 1468, 94, 95, '1M', '综合'),
  (4, 'GPT-5.4 High', 'OpenAI', 1481, 1458, 93, 95, '400K', 'Arena'),
  (5, 'Qwen3.6 Plus', '阿里巴巴', 1471, 1471, 96, 92, '128K', '综合')
on conflict (source, rank) do nothing;

insert into public.relay_evaluations
  (relay_name, model, endpoint, latency_ms, availability, authenticity, quality_score, checked_at, notes)
values
  ('禾维 AI', 'Claude Sonnet', 'OpenAI Compatible', 168, 99.3, '原生', 94, '2026-04-26 10:30:00+08', '函数调用、长文本与拒答风格接近官方。'),
  ('FastGPT 代充', 'GPT-4o', 'OpenAI Compatible', 220, 98.1, '待复测', 88, '2026-04-26 09:10:00+08', '常规问答稳定，高并发下存在波动。'),
  ('Global 代充', 'Gemini Pro', 'Gemini Compatible', 310, 96.8, '疑似路由', 82, '2026-04-25 22:40:00+08', '部分安全策略与官方不完全一致。')
on conflict do nothing;
