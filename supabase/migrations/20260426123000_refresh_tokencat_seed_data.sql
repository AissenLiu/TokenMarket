create unique index if not exists idx_resources_category_url_unique
on public.resources(category_key, url);

create unique index if not exists idx_coding_plans_vendor_plan_unique
on public.coding_plans(vendor, plan);

create unique index if not exists idx_relay_evaluations_unique
on public.relay_evaluations(relay_name, model, endpoint);

insert into public.categories (key, name, description, icon_name, sort_order, count)
values
  ('coding', 'Coding Plan 对比', '订阅价格、额度口径、模型倍率和 API 成本', 'Code2', 1, 9),
  ('leaderboard', '大模型排行', 'Arena、SuperCLUE 与代码能力综合排序', 'Trophy', 2, 10),
  ('relay', '中转站导航', '价格、在线率、延迟、掺水率和模型覆盖', 'Network', 3, 8),
  ('topup', '代充站导航', '订阅代充、比价、服务范围和风险提示', 'WalletCards', 4, 6),
  ('telegram', '飞机频道导航', 'AI 工具、开发、搜索与资源频道', 'Send', 5, 7),
  ('validation', '模型验证评价', '中转站模型响应质量、原生度与稳定性记录', 'ShieldCheck', 6, 6),
  ('tool', '工具站', 'AI 工具集合与效率网站', 'Boxes', 7, 0)
on conflict (key) do update set
  name = excluded.name,
  description = excluded.description,
  icon_name = excluded.icon_name,
  sort_order = excluded.sort_order,
  count = excluded.count,
  updated_at = now();

insert into public.resources
  (name, category_key, url, description, tags, region, status, score, visits, latency_ms, uptime, water_rate, pricing_note, source_name, source_url, models, verified_at)
values
  ('禾维 AI 中转站排行榜', 'relay', 'https://www.hvoy.ai/leaderboard/', '按模型收录中转站价格、在线率、掺水率、延迟和运行状态。', array['价格','在线率','掺水率','延迟'], '国内', 'active', 4.9, 26800, 165, 99.3, 0.6, '按模型与站点倍率展示', '禾维 AI', 'https://www.hvoy.ai/leaderboard/', array['Claude','GPT','Gemini','DeepSeek','Qwen'], '2026-04-26'),
  ('禾维 AI 模型验证', 'validation', 'https://www.hvoy.ai/', '对中转站模型进行可用性、原生度、延迟和质量复测。', array['模型验证','原生度','质量评分'], '国内', 'active', 4.8, 15200, 178, 98.9, 1.1, null, '禾维 AI', 'https://www.hvoy.ai/', array['Claude Sonnet','GPT-5.4','Gemini Pro'], '2026-04-26'),
  ('LiteLLM 模型价格库', 'coding', 'https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json', '开源模型价格与上下文窗口数据库，适合做 API 价格基准。', array['API 价格','上下文','开源'], '全球', 'active', 4.9, 18900, null, null, null, null, 'LiteLLM', 'https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json', array['OpenAI','Anthropic','Google','DeepSeek','Moonshot'], '2026-04-26'),
  ('awesome-coding-plan', 'coding', 'https://github.com/mahonzhan/awesome-coding-plan', '对比 Coding Agent 订阅计划、额度周期、模型倍率和性价比。', array['Coding Agent','订阅','额度'], '全球', 'active', 4.8, 12600, null, null, null, null, 'GitHub', 'https://github.com/mahonzhan/awesome-coding-plan', array[]::text[], '2026-04-26'),
  ('Arena Leaderboard', 'leaderboard', 'https://arena.ai/leaderboard', '基于用户偏好投票的文本、代码、推理模型榜单。', array['Arena','用户投票','模型排行'], '海外', 'active', 4.9, 52200, null, null, null, null, 'Arena', 'https://arena.ai/leaderboard', array[]::text[], '2026-04-26'),
  ('SuperCLUE', 'leaderboard', 'https://www.superclueai.com/generalpage', '中文大模型综合能力、应用能力与多维评测榜单。', array['中文评测','综合能力','应用能力'], '国内', 'active', 4.6, 30800, null, null, null, null, 'SuperCLUE', 'https://www.superclueai.com/generalpage', array[]::text[], '2026-04-26'),
  ('AI 比价', 'topup', 'https://www.aibijia.org/', '聚合 ChatGPT、Gemini、Claude Code、Grok 等订阅代充比价。', array['ChatGPT','Gemini','Claude Code','Grok'], '国内', 'active', 4.7, 21300, null, null, null, '展示各服务商报价，交易前需自行核验', 'AI 比价', 'https://www.aibijia.org/', array[]::text[], '2026-04-26'),
  ('TelegramGroup', 'telegram', 'https://github.com/itgoyo/TelegramGroup', '开源 Telegram 群组频道合集，覆盖搜索、资源、技术和工具分类。', array['Telegram','频道','开源索引'], '全球', 'active', 4.3, 18100, null, null, null, null, 'TelegramGroup', 'https://github.com/itgoyo/TelegramGroup', array[]::text[], '2026-04-26'),
  ('soso 搜索机器人', 'telegram', 'https://t.me/soso', 'Telegram 搜索入口，适合快速发现频道、群组和公开资源。', array['搜索','机器人','频道发现'], '全球', 'active', 4.1, 8600, null, null, null, null, 'TelegramGroup', 'https://github.com/itgoyo/TelegramGroup', array[]::text[], null),
  ('科技圈的日常', 'telegram', 'https://t.me/kejijun', '科技资讯、AI 工具与开发者新闻频道。', array['资讯','AI 工具','开发'], '全球', 'active', 4.0, 7200, null, null, null, null, 'TelegramGroup', 'https://github.com/itgoyo/TelegramGroup', array[]::text[], null)
on conflict (category_key, url) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  region = excluded.region,
  status = excluded.status,
  score = excluded.score,
  visits = excluded.visits,
  latency_ms = excluded.latency_ms,
  uptime = excluded.uptime,
  water_rate = excluded.water_rate,
  pricing_note = excluded.pricing_note,
  source_name = excluded.source_name,
  source_url = excluded.source_url,
  models = excluded.models,
  verified_at = excluded.verified_at,
  updated_at = now();

delete from public.coding_plans
where (vendor, plan) in (
  ('Anthropic', 'Claude Code / Pro'),
  ('GitHub', 'Copilot Pro')
);

insert into public.coding_plans
  (vendor, plan, monthly_price, quota, quota_type, period, requests, tokens, monthly_value, value_ratio, tps, included_models, strengths, best_for, official_url, source_name, source_url, score)
values
  ('Claude Code', 'Max 5x', '$100 / 月', '5 小时窗口约 900 条请求，约 2250 万 tokens', 'Usage-based', '5h', '~900 / 5h', '~22.5M / 5h', '$2,808', '28.1x', '≈1250', array['Claude Opus','Claude Sonnet'], array['长上下文代码库理解','终端 Agent 工作流','复杂重构能力强'], '复杂代码库、长期 Agent 编程和高强度开发', 'https://www.anthropic.com/claude-code', 'awesome-coding-plan', 'https://github.com/mahonzhan/awesome-coding-plan', 9.6),
  ('Qoder', 'Pro', '$20 / 月', '积分制，Deep Think 与高阶模型按倍率消耗', 'Quota-based', 'month', '积分池', '随模型倍率', '$708', '35.4x', '按模型', array['Claude Sonnet','Gemini','Qwen'], array['国产 IDE 适配','计划性价比高','模型池灵活'], '国内开发者和多模型编码工作流', 'https://qoder.com/', 'awesome-coding-plan', 'https://github.com/mahonzhan/awesome-coding-plan', 9.2),
  ('Cursor', 'Pro', '$20 / 月', '约 500 条快速高级请求，后台池按策略排队', 'Usage-based', 'month', '~500 fast', '按请求消耗', '$240', '12x', '稳定', array['Claude Sonnet','GPT-5','Gemini'], array['IDE 生态成熟','补全体验稳定','团队协作好'], '日常编码、重构和多人协作', 'https://cursor.com/pricing', 'awesome-coding-plan', 'https://github.com/mahonzhan/awesome-coding-plan', 9.0),
  ('Trae', 'Pro', '$10 / 月', '每月 600 条，部分模型按 0.5x 到 2x 消耗', 'Usage-based', 'month', '600 / 月', '按模型倍率', '$162', '16.2x', '中等', array['Claude','GPT','Doubao'], array['价格低','适合轻量项目','中文环境友好'], '预算敏感的个人开发者', 'https://www.trae.ai/', 'awesome-coding-plan', 'https://github.com/mahonzhan/awesome-coding-plan', 8.6),
  ('Windsurf', 'Pro', '$15 / 月', 'Cascade 与高级模型按请求池消耗', 'Usage-based', 'month', '按请求池', '按模型倍率', '$135', '9x', '稳定', array['Claude','GPT','SWE'], array['Agent 编程体验强','项目级上下文','价格友好'], '希望以较低成本使用 Agent IDE 的个人开发者', 'https://windsurf.com/pricing', 'awesome-coding-plan', 'https://github.com/mahonzhan/awesome-coding-plan', 8.5),
  ('API 直连', '按量调用', '按模型计费', '无固定月额度，成本由输入/输出 tokens 决定', 'API', 'month', '不限', '按量', '透明', '取决于用量', '受账户限额', array['OpenAI','Anthropic','Gemini','DeepSeek','Kimi'], array['透明计费','适合自研工具','成本可精细控制'], '有工程能力、需要自动化和成本控制的团队', 'https://github.com/BerriAI/litellm', 'LiteLLM', 'https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json', 8.9)
on conflict (vendor, plan) do update set
  monthly_price = excluded.monthly_price,
  quota = excluded.quota,
  quota_type = excluded.quota_type,
  period = excluded.period,
  requests = excluded.requests,
  tokens = excluded.tokens,
  monthly_value = excluded.monthly_value,
  value_ratio = excluded.value_ratio,
  tps = excluded.tps,
  included_models = excluded.included_models,
  strengths = excluded.strengths,
  best_for = excluded.best_for,
  official_url = excluded.official_url,
  source_name = excluded.source_name,
  source_url = excluded.source_url,
  score = excluded.score,
  updated_at = now();

delete from public.model_prices
where model in ('GPT-4o', 'Claude 3.5 Sonnet', 'Gemini 1.5 Pro', 'Qwen2.5 72B', 'DeepSeek-V2.5');

insert into public.model_prices
  (provider, model, input_usd_per_1m, output_usd_per_1m, context, max_output, source, source_url, updated_at)
values
  ('OpenAI', 'GPT-5.5', 5, 30, '1,050K', '128K', 'LiteLLM', 'https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json', '2026-04-26'),
  ('OpenAI / Azure', 'GPT-5.4', 2.5, 15, '1,050K', '128K', 'LiteLLM', 'https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json', '2026-04-26'),
  ('Anthropic / OpenRouter', 'Claude Opus 4.7', 5, 25, '1,000K', '128K', 'LiteLLM', 'https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json', '2026-04-26'),
  ('Anthropic / OpenRouter', 'Claude Sonnet 4.6', 3, 15, '1,000K', '128K', 'LiteLLM', 'https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json', '2026-04-26'),
  ('Google', 'Gemini 3.1 Pro Preview', 2, 12, '1,048K', '65K', 'LiteLLM', 'https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json', '2026-04-26'),
  ('Moonshot', 'Kimi K2.6', 0.95, 4, '262K', '262K', 'LiteLLM', 'https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json', '2026-04-26'),
  ('DeepSeek', 'DeepSeek V3.2', 0.28, 0.42, '128K', '8K', 'LiteLLM', 'https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json', '2026-04-26')
on conflict (provider, model) do update set
  input_usd_per_1m = excluded.input_usd_per_1m,
  output_usd_per_1m = excluded.output_usd_per_1m,
  context = excluded.context,
  max_output = excluded.max_output,
  source = excluded.source,
  source_url = excluded.source_url,
  updated_at = excluded.updated_at;

delete from public.model_rankings where rank between 1 and 7;

insert into public.model_rankings
  (rank, model, provider, arena_score, code_score, chinese_score, reasoning_score, context, source, source_url, badge)
values
  (1, 'Claude Opus 4.7 Thinking', 'Anthropic', 1503, 1572, 92, 97, '1M', 'Arena', 'https://arena.ai/leaderboard', '综合第一梯队'),
  (2, 'Claude Opus 4.6', 'Anthropic', 1496, 1545, 91, 96, '1M', 'Arena', 'https://arena.ai/leaderboard', '代码强项'),
  (3, 'Gemini 3.1 Pro Preview', 'Google', 1493, 1468, 94, 95, '1M', '综合', 'https://arena.ai/leaderboard', '长上下文'),
  (4, 'GPT-5.5', 'OpenAI', 1490, 1501, 93, 96, '1M', 'Arena', 'https://arena.ai/leaderboard', '推理稳定'),
  (5, 'Qwen3.6 Plus', '阿里巴巴', 1471, 1471, 96, 92, '128K', 'SuperCLUE', 'https://www.superclueai.com/generalpage', '中文强项'),
  (6, 'Kimi K2.6', '月之暗面', 1466, 1529, 95, 91, '256K', 'SuperCLUE', 'https://www.superclueai.com/generalpage', '代码与中文'),
  (7, 'DeepSeek V3.2', 'DeepSeek', 1458, 1463, 94, 90, '128K', '综合', 'https://arena.ai/leaderboard', '高性价比');

delete from public.relay_evaluations
where relay_name in ('禾维 AI', 'FastGPT 代充', 'Global 代充', '禾维收录站点 A', '禾维收录站点 B', '禾维收录站点 C', '禾维收录站点 D');

insert into public.relay_evaluations
  (relay_name, model, endpoint, latency_ms, availability, water_rate, authenticity, quality_score, checked_at, notes, source_name, source_url)
values
  ('禾维收录站点 A', 'Claude Opus 4.7', 'OpenAI Compatible', 168, 99.3, 0.6, '原生', 94, '2026-04-26 10:30:00+08', '函数调用、长上下文与拒答风格接近官方。', '禾维 AI', 'https://www.hvoy.ai/leaderboard/'),
  ('禾维收录站点 B', 'GPT-5.5', 'OpenAI Compatible', 214, 98.7, 1.4, '待复测', 90, '2026-04-26 09:10:00+08', '常规问答稳定，高并发下延迟波动。', '禾维 AI', 'https://www.hvoy.ai/leaderboard/'),
  ('禾维收录站点 C', 'Gemini 3.1 Pro Preview', 'Gemini Compatible', 310, 96.8, 2.2, '疑似路由', 82, '2026-04-25 22:40:00+08', '部分安全策略与官方不完全一致，建议复测。', '禾维 AI', 'https://www.hvoy.ai/'),
  ('禾维收录站点 D', 'Qwen3.6 Plus', 'OpenAI Compatible', 142, 99.1, 0.9, '原生', 89, '2026-04-25 19:20:00+08', '中文问答稳定，代码题需要关注上下文裁剪。', '禾维 AI', 'https://www.hvoy.ai/leaderboard/')
on conflict (relay_name, model, endpoint) do update set
  latency_ms = excluded.latency_ms,
  availability = excluded.availability,
  water_rate = excluded.water_rate,
  authenticity = excluded.authenticity,
  quality_score = excluded.quality_score,
  checked_at = excluded.checked_at,
  notes = excluded.notes,
  source_name = excluded.source_name,
  source_url = excluded.source_url;
