import Link from "next/link";
import { ArrowRight, Database, RefreshCw, Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { categoryIconMap, UtilityIcons } from "@/components/icons";
import { Section } from "@/components/section";
import { SiteCard } from "@/components/site-card";
import { SourceStrip } from "@/components/source-strip";
import { StatusBadge } from "@/components/status-badge";
import { formatNumber, formatUsd } from "@/lib/format";
import { getAppData } from "@/lib/data";

export default async function Home() {
  const data = await getAppData();
  const topSites = data.resources.slice(0, 6);
  const topRankings = data.modelRankings.slice(0, 5);
  const homeSources = data.sourceLinks.filter((source) =>
    ["LiteLLM model prices", "awesome-coding-plan", "禾维 AI", "AI 比价"].includes(
      source.name,
    ),
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="overflow-hidden rounded-lg border border-indigo-100 bg-white shadow-sm">
            <div className="relative min-h-[300px] p-6 sm:p-8">
              <div className="absolute right-0 top-0 h-full w-1/2 bg-[linear-gradient(135deg,#eef2ff,#ffffff)]" />
              <div className="relative max-w-xl">
                <p className="inline-flex h-7 items-center gap-2 rounded-full bg-indigo-50 px-3 text-xs font-medium text-indigo-700 ring-1 ring-indigo-100">
                  <UtilityIcons.Sparkles className="h-3.5 w-3.5" />
                  聚合 Coding Plan、模型价格、榜单与中转评测
                </p>
                <h1 className="mt-5 text-4xl font-semibold tracking-normal text-slate-950 sm:text-5xl">
                  TokenCat
                </h1>
                <p className="mt-3 max-w-lg text-base leading-7 text-slate-600">
                  面向 AI 开发者的一站式导航站，按参考源整理订阅额度、API 价格、模型排行、中转质量、代充比价与 Telegram 频道。
                </p>
                <div className="mt-6 flex max-w-xl items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
                  <Search className="ml-2 h-4 w-4 text-slate-400" />
                  <input
                    className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                    placeholder="搜索模型、平台、中转站、频道..."
                  />
                  <Link
                    href="/submit"
                    className="inline-flex h-9 items-center rounded-md bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-500"
                  >
                    提交网站
                  </Link>
                </div>
              </div>
              <div className="relative mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["收录站点", data.stats.totalSites],
                  ["可用站点", data.stats.activeSites],
                  ["今日访问", data.stats.todayVisits],
                  ["待审核", data.stats.pendingSubmissions],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur"
                  >
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">
                      {formatNumber(Number(value))}
                    </p>
                  </div>
                ))}
              </div>
              <div className="relative mt-5">
                <SourceStrip sources={homeSources} compact />
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">数据状态</h2>
                <p className="mt-1 text-sm text-slate-500">
                  当前使用 {data.source === "supabase" ? "Supabase" : "内置种子"} 数据
                </p>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-950 text-white">
                <Database className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {data.relayEvaluations.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="rounded-md border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-slate-900">
                      {item.relayName} · {item.model}
                    </p>
                    <span className="text-xs font-medium text-emerald-700">
                      {item.availability}%
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-slate-500">
                    <span>{item.latencyMs}ms</span>
                    <span>掺水 {item.waterRate}%</span>
                    <span>{item.authenticity}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{ width: `${item.qualityScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/relays"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-indigo-700"
            >
              查看中转验证 <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </div>

        <Section title="导航分类" description="按使用场景聚合 AI 平台、榜单与服务">
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            {data.categories.map((category) => {
              const Icon = categoryIconMap[category.iconName] ?? UtilityIcons.Sparkles;
              return (
                <Link
                  key={category.id}
                  href={
                    category.key === "coding"
                      ? "/coding-plans"
                      : category.key === "leaderboard"
                        ? "/leaderboard"
                        : category.key === "relay" || category.key === "validation"
                          ? "/relays"
                          : category.key === "topup"
                            ? "/topups"
                            : "/telegram"
                  }
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200"
                >
                  <div className="grid h-9 w-9 place-items-center rounded-md bg-indigo-50 text-indigo-700">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-950">
                    {category.name}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                    {category.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </Section>

        <div className="grid gap-6 xl:grid-cols-2">
          <Section
            title="大模型排行"
            description="结合 Arena 与中文评测指标，适合快速筛选模型"
            action={
              <Link href="/leaderboard" className="text-sm font-medium text-indigo-700">
                全部模型
              </Link>
            }
          >
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500">
                  <tr>
                    <th className="px-4 py-3">排名</th>
                    <th className="px-4 py-3">模型</th>
                    <th className="px-4 py-3">Arena</th>
                    <th className="px-4 py-3">代码</th>
                    <th className="px-4 py-3">中文</th>
                    <th className="px-4 py-3">上下文</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topRankings.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        #{item.rank}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-950">{item.model}</p>
                        <p className="text-xs text-slate-400">{item.provider}</p>
                      </td>
                      <td className="px-4 py-3">{item.arenaScore}</td>
                      <td className="px-4 py-3">{item.codeScore}</td>
                      <td className="px-4 py-3">{item.chineseScore}</td>
                      <td className="px-4 py-3">{item.context}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section
            title="Coding Plan 与 API 价格"
            description="订阅方案和按量调用价格放在同一视图里比较"
            action={
              <Link
                href="/coding-plans"
                className="text-sm font-medium text-indigo-700"
              >
                查看对比
              </Link>
            }
          >
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500">
                  <tr>
                    <th className="px-4 py-3">模型</th>
                    <th className="px-4 py-3">厂商</th>
                    <th className="px-4 py-3">输入 / 1M</th>
                    <th className="px-4 py-3">输出 / 1M</th>
                    <th className="px-4 py-3">上下文</th>
                    <th className="px-4 py-3">来源</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.modelPrices.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-950">
                        {item.model}
                      </td>
                      <td className="px-4 py-3 text-slate-500">{item.provider}</td>
                      <td className="px-4 py-3">{formatUsd(item.inputUsdPer1M)}</td>
                      <td className="px-4 py-3">{formatUsd(item.outputUsdPer1M)}</td>
                      <td className="px-4 py-3">{item.context}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">{item.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>

        <Section
          title="热门网站"
          description="从中转站、代充站、榜单和频道中提取高频使用入口"
          action={
            <div className="inline-flex items-center gap-2 text-xs text-slate-400">
              <RefreshCw className="h-3.5 w-3.5" /> 每日更新
            </div>
          }
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {topSites.map((site) => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>
        </Section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">后台管理系统</h2>
              <p className="mt-1 text-sm text-slate-500">
                管理分类、网站、提交审核、模型价格、榜单和评测记录。
              </p>
            </div>
            <Link
              href="/admin"
              className="inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              进入后台
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {["分类管理", "网站管理", "提交审核", "模型价格", "操作日志"].map((item) => (
              <StatusBadge key={item} status={item === "提交审核" ? "pending" : "active"} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
