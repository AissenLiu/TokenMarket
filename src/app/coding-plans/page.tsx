import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Section } from "@/components/section";
import { SourceStrip } from "@/components/source-strip";
import { formatUsd } from "@/lib/format";
import { getAppData } from "@/lib/data";

export default async function CodingPlansPage() {
  const data = await getAppData();
  const sources = data.sourceLinks.filter((source) =>
    ["知乎 Coding Plan 对比", "awesome-coding-plan", "LiteLLM model prices"].includes(
      source.name,
    ),
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
            参考知乎、awesome-coding-plan 与 LiteLLM 价格库，将订阅制、模型覆盖、额度周期、模型倍率和 API 按量价格放在同一张表里。
          </p>
          <div className="mt-5">
            <SourceStrip sources={sources} compact />
          </div>
        </header>

        <Section title="订阅方案" description="适合按团队工作流、模型偏好和预算快速筛选">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[1120px] text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="px-4 py-3">平台</th>
                  <th className="px-4 py-3">价格</th>
                  <th className="px-4 py-3">额度类型</th>
                  <th className="px-4 py-3">请求 / Tokens</th>
                  <th className="px-4 py-3">价值倍率</th>
                  <th className="px-4 py-3">包含模型</th>
                  <th className="px-4 py-3">适合人群</th>
                  <th className="px-4 py-3">评分</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.codingPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <Link
                        href={plan.officialUrl}
                        target="_blank"
                        className="font-semibold text-slate-950 hover:text-indigo-700"
                      >
                        {plan.vendor} {plan.plan}
                      </Link>
                      <p className="mt-1 text-xs text-slate-400">
                        {plan.strengths.join(" · ")}
                      </p>
                    </td>
                    <td className="px-4 py-4 font-medium">{plan.monthlyPrice}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                        {plan.quotaType}
                      </span>
                      <p className="mt-2 max-w-[260px] text-xs leading-5 text-slate-500">
                        {plan.quota}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      <p>{plan.requests ?? "-"}</p>
                      <p className="text-xs text-slate-400">{plan.tokens ?? "-"}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-950">
                        {plan.valueRatio ?? "-"}
                      </p>
                      <p className="text-xs text-slate-400">
                        月价值 {plan.monthlyValue ?? "-"}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {plan.includedModels.map((model) => (
                          <span
                            key={model}
                            className="rounded-full bg-indigo-50 px-2 py-1 text-xs text-indigo-700"
                          >
                            {model}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{plan.bestFor}</td>
                    <td className="px-4 py-4 font-semibold text-slate-950">
                      {plan.score}
                      <p className="mt-1 text-xs font-normal text-slate-400">
                        {plan.sourceName}
                      </p>
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
