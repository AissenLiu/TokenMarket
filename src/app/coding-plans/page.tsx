import { AppShell } from "@/components/app-shell";
import { SourceStrip } from "@/components/source-strip";
import { CodingPlanFilteredView } from "./coding-plan-filtered-view";
import { getAppData } from "@/lib/data";

export default async function CodingPlansPage() {
  const data = await getAppData();
  const codingPlanCount = data.codingPlans.filter(
    (plan) => plan.type === "Coding Plan",
  ).length;
  const tokenPlanCount = data.codingPlans.filter(
    (plan) => plan.type === "Token Plan",
  ).length;
  const activePlanCount = data.codingPlans.filter(
    (plan) => !plan.discontinued,
  ).length;
  const vendorCount = new Set(data.codingPlans.map((plan) => plan.vendor)).size;
  const sources = data.sourceLinks.filter((source) =>
    ["wmpeng/codingplan", "LiteLLM model prices"].includes(source.name),
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
            Coding Plan 直接读取 wmpeng/codingplan 的 GitHub raw JSON，字段按源文件展示：平台、套餐、类型、首月价、连续包月/季/年、支持模型、请求数、Token 上限、权益、状态与备注；API 价格继续使用 LiteLLM 口径辅助估算。
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {[
              ["Coding Plan", codingPlanCount],
              ["Token Plan", tokenPlanCount],
              ["在售套餐", activePlanCount],
              ["平台数量", vendorCount],
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

        <CodingPlanFilteredView
          plans={data.codingPlans}
          modelPrices={data.modelPrices}
        />
      </div>
    </AppShell>
  );
}
