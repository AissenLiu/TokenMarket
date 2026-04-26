import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Section } from "@/components/section";
import { SourceStrip } from "@/components/source-strip";
import { formatUsd } from "@/lib/format";
import { getAppData } from "@/lib/data";
import type { CodingPlan } from "@/lib/types";

function dash(value?: string) {
  return value && value.trim() ? value : "-";
}

function PeriodCell({
  tokens,
  value,
  ratio,
}: {
  tokens?: string;
  value?: string;
  ratio?: string;
}) {
  return (
    <div className="min-w-[150px] space-y-1">
      <p className="font-medium text-slate-900">{dash(tokens)}</p>
      <p className="text-xs text-slate-500">价值 {dash(value)}</p>
      <p className="text-xs text-indigo-700">倍率 {dash(ratio)}</p>
    </div>
  );
}

function SourceLink({ plan }: { plan: CodingPlan }) {
  return (
    <Link
      href={plan.officialUrl}
      target="_blank"
      className="font-semibold text-slate-950 hover:text-indigo-700"
    >
      {plan.planName}
    </Link>
  );
}

export default async function CodingPlansPage() {
  const data = await getAppData();
  const corePlans = data.codingPlans.filter((plan) => plan.section === "core");
  const idePlans = data.codingPlans.filter((plan) => plan.section === "ide-cli");
  const sources = data.sourceLinks.filter((source) =>
    ["awesome-coding-plan", "LiteLLM model prices"].includes(source.name),
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-indigo-700">02. Coding Plan 对比</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">
            Coding Plan 与 API 价格对比
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Coding Plan 字段按 awesome-coding-plan 的原始表结构展示：月价格、官方说明、TPS、5h/周/月额度价值与倍率；API 价格继续使用 LiteLLM 口径辅助估算。
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {[
              ["核心计划", corePlans.length],
              ["IDE/CLI 计划", idePlans.length],
              ["最高月倍率", "88.65"],
              ["字段来源", "README"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <p className="text-xs text-slate-400">{label}</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <SourceStrip sources={sources} compact />
          </div>
        </header>

        <Section
          title="数据对比 (TL;DR)"
          description="来自 awesome-coding-plan 的大模型/云厂商 Coding Plan 对比表"
        >
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[1380px] text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="px-4 py-3">厂商</th>
                  <th className="px-4 py-3">价格(mo)</th>
                  <th className="px-4 py-3">官方说明</th>
                  <th className="px-4 py-3">TPS</th>
                  <th className="px-4 py-3">5h 请求/Tokens</th>
                  <th className="px-4 py-3">周请求/Tokens</th>
                  <th className="px-4 py-3">月请求/Tokens</th>
                  <th className="px-4 py-3">模型/备注</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {corePlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <SourceLink plan={plan} />
                      {plan.modelName ? (
                        <p className="mt-1 text-xs text-slate-400">
                          {plan.modelName}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 font-medium">{plan.monthlyPrice}</td>
                    <td className="px-4 py-4">
                      <p className="max-w-[300px] text-xs leading-5 text-slate-500">
                        {dash(plan.officialNote)}
                      </p>
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-700">
                      {dash(plan.tps)}
                    </td>
                    <td className="px-4 py-4">
                      <PeriodCell
                        tokens={plan.requestsTokens5h}
                        value={plan.value5h}
                        ratio={plan.ratio5h}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <PeriodCell
                        tokens={plan.requestsTokensWeek}
                        value={plan.valueWeek}
                        ratio={plan.ratioWeek}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <PeriodCell
                        tokens={plan.requestsTokensMonth}
                        value={plan.valueMonth}
                        ratio={plan.ratioMonth}
                      />
                    </td>
                    <td className="px-4 py-4 text-xs leading-5 text-slate-500">
                      {dash(plan.note)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            说明：额度倍率 = 当前周期额度除以包月价格；空值、/、? 保留源表原样含义。
          </p>
        </Section>

        <Section
          title="AI IDE/CLI Plan"
          description="来自 awesome-coding-plan 的 IDE 与 CLI 订阅表"
        >
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[1120px] text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="px-4 py-3">厂商</th>
                  <th className="px-4 py-3">价格(mo)</th>
                  <th className="px-4 py-3">官方说明</th>
                  <th className="px-4 py-3">备注</th>
                  <th className="px-4 py-3">额度价值(mo)/Tokens</th>
                  <th className="px-4 py-3">额度倍率(mo)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {idePlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <SourceLink plan={plan} />
                    </td>
                    <td className="px-4 py-4 font-medium">{plan.monthlyPrice}</td>
                    <td className="px-4 py-4">
                      <p className="max-w-[420px] text-xs leading-5 text-slate-500">
                        {dash(plan.officialNote)}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                        {dash(plan.note)}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-900">
                      {dash(plan.valueMonth)}
                    </td>
                    <td className="px-4 py-4 font-semibold text-indigo-700">
                      {dash(plan.ratioMonth)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="API 调用价格" description="单位统一为 USD / 1M tokens，便于估算自动化成本">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {data.modelPrices.map((price) => (
              <article
                key={price.id}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <p className="text-xs text-slate-400">{price.provider}</p>
                <h2 className="mt-1 text-base font-semibold text-slate-950">
                  {price.model}
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-md bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">输入</p>
                    <p className="mt-1 font-semibold">{formatUsd(price.inputUsdPer1M)}</p>
                  </div>
                  <div className="rounded-md bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">输出</p>
                    <p className="mt-1 font-semibold">{formatUsd(price.outputUsdPer1M)}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  上下文 {price.context} · 最大输出 {price.maxOutput ?? "-"}
                </p>
                <Link
                  href={price.sourceUrl}
                  target="_blank"
                  className="mt-3 inline-flex text-xs font-medium text-indigo-700"
                >
                  {price.source}
                </Link>
              </article>
            ))}
          </div>
        </Section>
      </div>
    </AppShell>
  );
}
