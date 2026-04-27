import Link from "next/link";
import {
  ArrowRight,
  Code2,
  ExternalLink,
  Network,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  Trophy,
  WalletCards,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { formatNumber, formatUsd } from "@/lib/format";
import { getAppData } from "@/lib/data";
import type { CategoryKey, CodingPlan, ModelPrice } from "@/lib/types";

const categoryLinks: Record<CategoryKey, string> = {
  coding: "/coding-plans",
  leaderboard: "/leaderboard",
  relay: "/relays",
  topup: "/topups",
  telegram: "/telegram",
  validation: "/relays",
  tool: "/",
};

function formatPlanPrice(plan?: CodingPlan) {
  if (!plan) return "-";
  if (plan.monthlyPrice === null) return plan.type === "Token Plan" ? "按量计费" : "免费额度";
  return `${plan.currency}${plan.monthlyPrice.toLocaleString("zh-CN")}/月`;
}

function matchPlanForModel(plans: CodingPlan[], price: ModelPrice, index: number) {
  const normalizedModel = price.model.toLowerCase();
  return (
    plans.find((plan) =>
      plan.models.some((model) => {
        const normalizedPlanModel = model.toLowerCase();
        return (
          normalizedModel.includes(normalizedPlanModel) ||
          normalizedPlanModel.includes(normalizedModel)
        );
      }),
    ) ?? plans[index]
  );
}

export default async function Home() {
  const data = await getAppData();
  const topRankings = data.modelRankings.slice(0, 5);
  const priceRows = data.modelPrices.slice(0, 5);
  const activePlans = data.codingPlans.filter((plan) => !plan.discontinued);

  const categoryCount = (key: CategoryKey) =>
    data.categories.find((category) => category.key === key)?.count ??
    data.resources.filter((resource) => resource.categoryKey === key).length;

  const featureCards = [
    {
      href: "/coding-plans",
      icon: Code2,
      title: "1. Coding Plan 对比",
      description: "国内外大模型 coding plan 与 API 调用价格对比",
      tone: "from-indigo-500 to-violet-500",
    },
    {
      href: "/leaderboard",
      icon: Trophy,
      title: "2. 大模型排行",
      description: "综合 Arena 与中文评测，实时追踪强模型",
      tone: "from-amber-400 to-orange-500",
    },
    {
      href: "/relays",
      icon: Network,
      title: "3. 中转站导航",
      description: "精选稳定可靠的中转站，一站直达",
      tone: "from-sky-400 to-cyan-500",
    },
    {
      href: "/topups",
      icon: WalletCards,
      title: "4. 代充站导航",
      description: "安全便捷的代充服务，多平台支持",
      tone: "from-blue-500 to-indigo-500",
    },
    {
      href: "/telegram",
      icon: Send,
      title: "5. 飞机频道导航",
      description: "优质 Telegram 频道合集，资讯资源共享",
      tone: "from-violet-500 to-fuchsia-500",
    },
    {
      href: "/relays",
      icon: ShieldCheck,
      title: "6. 中转站模型验证",
      description: "验证模型列表、延迟、可用率和掺水率",
      tone: "from-cyan-500 to-blue-500",
    },
  ];

  const quickCards = [
    {
      href: "/relays",
      icon: Network,
      title: "中转站导航",
      description: "筛选稳定可靠的中转站服务商",
      meta: `收录 ${categoryCount("relay")} 个优质站点`,
      className: "border-emerald-100 bg-emerald-50/60 text-emerald-700",
    },
    {
      href: "/topups",
      icon: WalletCards,
      title: "代充站导航",
      description: "覆盖 OpenAI、Claude、Google 等服务",
      meta: `收录 ${categoryCount("topup")} 个优质站点`,
      className: "border-amber-100 bg-amber-50/70 text-amber-700",
    },
    {
      href: "/telegram",
      icon: Send,
      title: "飞机频道导航",
      description: "整理 AI 资讯、资源与工程频道",
      meta: `收录 ${categoryCount("telegram")} 个频道`,
      className: "border-violet-100 bg-violet-50/70 text-violet-700",
    },
    {
      href: "/relays",
      icon: ShieldCheck,
      title: "中转站模型验证",
      description: "查看模型真实性、延迟与可用率",
      meta: `${data.relayEvaluations.length} 条模型检测`,
      className: "border-sky-100 bg-sky-50/70 text-sky-700",
    },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-[1536px] space-y-6 px-4 py-5 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-sm shadow-slate-200/60">
          <div className="relative px-5 pb-5 pt-8 sm:px-8">
            <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(110deg,#f8fbff_0%,#eef2ff_52%,#f4f7ff_100%)]" />
            <div className="absolute right-10 top-4 hidden h-40 w-56 sm:block">
              <div className="absolute right-10 top-1 h-20 w-20 rotate-12 rounded-2xl bg-indigo-500/90 shadow-2xl shadow-indigo-200" />
              <div className="absolute right-0 top-14 h-14 w-14 -rotate-12 rounded-xl bg-blue-300/80 shadow-lg shadow-blue-100" />
              <div className="absolute right-32 top-20 h-10 w-10 rotate-45 rounded-lg bg-white shadow-md" />
              <Sparkles className="absolute right-3 top-5 h-5 w-5 text-indigo-500" />
            </div>

            <div className="relative">
              <p className="text-sm font-medium text-indigo-700">TokenCat AI 导航</p>
              <h1 className="mt-3 text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
                高效发现 · 精准选择 · 轻松使用
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                汇聚 Coding Plan、模型排行、中转验证、代充服务与 Telegram 频道，按使用场景快速进入。
              </p>

              <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
                {featureCards.map((card) => (
                  <Link
                    key={card.title}
                    href={card.href}
                    className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-100/70"
                  >
                    <div
                      className={`grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br ${card.tone} text-white shadow-lg shadow-slate-200`}
                    >
                      <card.icon className="h-7 w-7" />
                    </div>
                    <h2 className="mt-5 text-base font-semibold text-slate-950">
                      {card.title}
                    </h2>
                    <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                      {card.description}
                    </p>
                    <span className="mt-4 inline-flex h-8 w-12 items-center justify-center rounded-full border border-indigo-100 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-4">
          {[
            ["收录站点", data.stats.totalSites],
            ["可用站点", data.stats.activeSites],
            ["今日访问", data.stats.todayVisits],
            ["Coding Plan", data.codingPlans.length],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
            >
              <p className="text-xs text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {formatNumber(Number(value))}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">大模型排行</h2>
                <p className="mt-1 text-xs text-slate-500">
                  综合 Arena 与中文评测维度，适合快速定位主力模型。
                </p>
              </div>
              <Link
                href="/leaderboard"
                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-700"
              >
                查看完整排行 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-slate-100 text-xs text-slate-400">
                  <tr>
                    <th className="px-2 py-3">排名</th>
                    <th className="px-2 py-3">模型名称</th>
                    <th className="px-2 py-3">综合得分</th>
                    <th className="px-2 py-3">上下文</th>
                    <th className="px-2 py-3">代码</th>
                    <th className="px-2 py-3">中文</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topRankings.map((item, index) => (
                    <tr key={item.id} className="transition hover:bg-slate-50">
                      <td className="px-2 py-4">
                        <span
                          className={
                            "grid h-7 w-7 place-items-center rounded-full text-xs font-semibold " +
                            (index === 0
                              ? "bg-amber-50 text-amber-600"
                              : index === 1
                                ? "bg-slate-100 text-slate-500"
                                : index === 2
                                  ? "bg-orange-50 text-orange-600"
                                  : "bg-white text-slate-700")
                          }
                        >
                          {item.rank}
                        </span>
                      </td>
                      <td className="px-2 py-4">
                        <p className="font-semibold text-slate-950">{item.model}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{item.provider}</p>
                      </td>
                      <td className="px-2 py-4 font-semibold text-slate-950">
                        {item.arenaScore}
                      </td>
                      <td className="px-2 py-4 text-slate-600">{item.context}</td>
                      <td className="px-2 py-4 text-slate-600">{item.codeScore}</td>
                      <td className="px-2 py-4 text-slate-600">{item.chineseScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Coding Plan & API 价格对比
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  订阅套餐与按量调用价格放在同一屏，便于估算成本。
                </p>
              </div>
              <Link
                href="/coding-plans"
                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-700"
              >
                查看详情 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mb-3 inline-flex rounded-lg bg-slate-100 p-1 text-xs">
              <span className="rounded-md bg-white px-4 py-2 font-medium text-indigo-700 shadow-sm">
                Coding Plan 对比
              </span>
              <span className="px-4 py-2 text-slate-500">API 调用价格对比</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-slate-100 text-xs text-slate-400">
                  <tr>
                    <th className="px-2 py-3">模型</th>
                    <th className="px-2 py-3">参考套餐</th>
                    <th className="px-2 py-3">包月</th>
                    <th className="px-2 py-3">API 输入</th>
                    <th className="px-2 py-3">API 输出</th>
                    <th className="px-2 py-3">上下文</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {priceRows.map((item, index) => {
                    const plan = matchPlanForModel(activePlans, item, index);
                    return (
                      <tr key={item.id} className="transition hover:bg-slate-50">
                        <td className="px-2 py-4 font-semibold text-slate-950">
                          {item.model}
                        </td>
                        <td className="px-2 py-4">
                          <p className="text-slate-700">{plan?.vendor ?? item.provider}</p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {plan?.plan ?? item.source}
                          </p>
                        </td>
                        <td className="px-2 py-4 text-slate-600">
                          {formatPlanPrice(plan)}
                        </td>
                        <td className="px-2 py-4 text-slate-600">
                          {formatUsd(item.inputUsdPer1M)}
                        </td>
                        <td className="px-2 py-4 text-slate-600">
                          {formatUsd(item.outputUsdPer1M)}
                        </td>
                        <td className="px-2 py-4 text-slate-600">{item.context}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              价格仅供参考，实时价格以对应平台与数据源为准。
            </p>
          </section>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">快捷导航</h2>
              <p className="mt-1 text-xs text-slate-500">
                常用入口按任务聚合，快速跳转到对应导航页。
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs text-slate-400">
              <RefreshCw className="h-3.5 w-3.5" />
              远程数据每日刷新
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {quickCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className={`group rounded-xl border p-5 transition duration-200 hover:-translate-y-1 hover:shadow-md ${card.className}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/80 shadow-sm">
                    <card.icon className="h-6 w-6" />
                  </div>
                  <ExternalLink className="h-4 w-4 opacity-50 transition group-hover:opacity-100" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
                <p className="mt-3 text-sm font-medium">{card.meta}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {data.categories.slice(0, 6).map((category) => (
            <Link
              key={category.id}
              href={categoryLinks[category.key]}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-100/60"
            >
              <div>
                <p className="text-sm font-semibold text-slate-950">{category.name}</p>
                <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                  {category.description}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {category.count}
              </span>
            </Link>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
