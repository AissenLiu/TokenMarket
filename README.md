# TokenCat

TokenCat 是一个 AI 导航站，聚合 Coding Plan 对比、API 调用价格、大模型排行、中转站导航、代充站导航、Telegram 频道和中转站模型验证评价。

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Postgres
- Upstash Redis
- Vercel

## 本地开发

```bash
npm install
npm run dev
```

访问 `http://localhost:3000` 查看前台，访问 `http://localhost:3000/admin` 查看后台。

## 环境变量

复制 `.env.example` 后填入实际值：

```bash
cp .env.example .env.local
```

未配置 Supabase 和 Redis 时，应用会使用内置种子数据完整展示页面；配置后会自动从 Supabase 读取，并用 Vercel 提供的 Redis/Upstash REST 变量缓存聚合数据。

后台默认本地密码是 `tokencat-admin`。生产环境必须配置：

```bash
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
ADMIN_DB_SECRET=
```

项目已预填 Supabase URL：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://girtuxhajaxhmnbmnvxo.supabase.co
```

线上已支持两种后台写入方式：优先使用 `SUPABASE_SERVICE_ROLE_KEY`；如果不提供 service role，则使用 Supabase RPC + `ADMIN_DB_SECRET` 完成后台新增站点和模型价格写入。

## 数据库

Supabase 表结构和种子数据位于：

```bash
supabase/migrations/0001_init_tokencat.sql
```

当前环境没有可调用的 db MCP 工具，因此没有直接执行数据库建表操作。接入 db MCP 后可通过 MCP 执行该 migration。

## 参考来源

- <https://zhuanlan.zhihu.com/p/2015468530938693485>
- <https://github.com/mahonzhan/awesome-coding-plan>
- <https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json>
- <https://arena.ai/leaderboard>
- <https://www.superclueai.com/generalpage>
- <https://www.hvoy.ai/leaderboard/>
- <https://www.aibijia.org/>
- <https://github.com/itgoyo/TelegramGroup>

## 常用命令

```bash
npm run lint
npm run build
```
