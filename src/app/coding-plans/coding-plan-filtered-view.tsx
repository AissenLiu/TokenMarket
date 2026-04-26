"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ExternalLink, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { formatUsd } from "@/lib/format";
import type { CodingPlan, ModelPrice } from "@/lib/types";

const PRICE_BUCKETS = [
  "全部价格",
  "50 元以内",
  "51-100 元",
  "101-200 元",
  "200 元以上",
] as const;

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "zh-CN"),
  );
}

function dash(value?: string) {
  return value && value.trim() ? value : "-";
}

function formatPrice(value: number | null, currency: string) {
  if (value === null) return "-";
  return currency + value.toLocaleString("zh-CN");
}

function isInPriceBucket(plan: CodingPlan, bucket: string) {
  if (bucket === "全部价格") return true;
  if (plan.monthlyPrice === null) return false;
  if (bucket === "50 元以内") return plan.monthlyPrice <= 50;
  if (bucket === "51-100 元") return plan.monthlyPrice > 50 && plan.monthlyPrice <= 100;
  if (bucket === "101-200 元") return plan.monthlyPrice > 100 && plan.monthlyPrice <= 200;
  return plan.monthlyPrice > 200;
}

function planHaystack(plan: CodingPlan) {
  return [
    plan.vendor,
    plan.plan,
    plan.type,
    plan.tokenLimit,
    plan.note,
    ...plan.models,
    ...plan.benefits,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <p className="text-sm font-medium text-slate-700">没有匹配的套餐</p>
      <p className="mt-1 text-xs text-slate-400">调整平台、类型、模型、价格或关键词后再看。</p>
    </div>
  );
}

export function CodingPlanFilteredView({
  plans,
  modelPrices,
}: {
  plans: CodingPlan[];
  modelPrices: ModelPrice[];
}) {
  const [vendor, setVendor] = useState("全部平台");
  const [type, setType] = useState("全部类型");
  const [model, setModel] = useState("全部模型");
  const [status, setStatus] = useState("全部状态");
  const [priceBucket, setPriceBucket] = useState<(typeof PRICE_BUCKETS)[number]>(
    "全部价格",
  );
  const [query, setQuery] = useState("");

  const vendorOptions = useMemo(() => unique(plans.map((plan) => plan.vendor)), [plans]);
  const typeOptions = useMemo(() => unique(plans.map((plan) => plan.type)), [plans]);
  const modelOptions = useMemo(
    () => unique(plans.flatMap((plan) => plan.models)),
    [plans],
  );
  const normalizedQuery = query.trim().toLowerCase();

  const filteredPlans = plans.filter((plan) => {
    if (vendor !== "全部平台" && plan.vendor !== vendor) return false;
    if (type !== "全部类型" && plan.type !== type) return false;
    if (model !== "全部模型" && !plan.models.includes(model)) return false;
    if (status === "仅在售" && plan.discontinued) return false;
    if (status === "仅停售" && !plan.discontinued) return false;
    if (!isInPriceBucket(plan, priceBucket)) return false;
    if (normalizedQuery && !planHaystack(plan).includes(normalizedQuery)) return false;
    return true;
  });

  const resetFilters = () => {
    setVendor("全部平台");
    setType("全部类型");
    setModel("全部模型");
    setStatus("全部状态");
    setPriceBucket("全部价格");
    setQuery("");
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-950">
              <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
              筛选
            </p>
            <p className="mt-1 text-xs text-slate-400">
              显示 {filteredPlans.length} / {plans.length} 个套餐
            </p>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:border-indigo-200 hover:text-indigo-700"
          >
            <RotateCcw className="h-4 w-4" />
            重置
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <label className="space-y-1 text-xs text-slate-500">
            平台
            <select
              value={vendor}
              onChange={(event) => setVendor(event.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option>全部平台</option>
              {vendorOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-xs text-slate-500">
            类型
            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option>全部类型</option>
              {typeOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-xs text-slate-500">
            模型
            <select
              value={model}
              onChange={(event) => setModel(event.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option>全部模型</option>
              {modelOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-xs text-slate-500">
            包月价格
            <select
              value={priceBucket}
              onChange={(event) =>
                setPriceBucket(event.target.value as (typeof PRICE_BUCKETS)[number])
              }
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              {PRICE_BUCKETS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-xs text-slate-500">
            状态
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option>全部状态</option>
              <option>仅在售</option>
              <option>仅停售</option>
            </select>
          </label>
          <label className="space-y-1 text-xs text-slate-500">
            关键词
            <span className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="模型、权益、备注"
                className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </span>
          </label>
        </div>
      </section>

      {filteredPlans.length === 0 ? <EmptyState /> : null}

      {filteredPlans.length > 0 ? (
        <section>
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                wmpeng/codingplan 套餐数据
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                字段与 GitHub plans.json 保持一致，价格及权益以源站与平台官方为准。
              </p>
            </div>
            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-500">
              {filteredPlans.length} 项
            </span>
          </div>
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[1440px] text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="px-4 py-3">平台 / 套餐</th>
                  <th className="px-4 py-3">类型 / 状态</th>
                  <th className="px-4 py-3">首月价格</th>
                  <th className="px-4 py-3">连续包月</th>
                  <th className="px-4 py-3">连续包季</th>
                  <th className="px-4 py-3">连续包年</th>
                  <th className="px-4 py-3">支持模型</th>
                  <th className="px-4 py-3">请求数</th>
                  <th className="px-4 py-3">Token 上限</th>
                  <th className="px-4 py-3">权益 / 备注</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <p className="text-xs text-slate-400">{plan.vendor}</p>
                      <Link
                        href={plan.action}
                        target="_blank"
                        className="mt-1 inline-flex items-center gap-1 font-semibold text-slate-950 hover:text-indigo-700"
                      >
                        {plan.plan}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                          {plan.type}
                        </span>
                        <span
                          className={
                            "rounded-full px-2 py-1 text-xs font-medium " +
                            (plan.discontinued
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700")
                          }
                        >
                          {plan.discontinued ? "已停售" : "在售"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-medium">
                      {formatPrice(plan.firstMonthPrice, plan.currency)}
                    </td>
                    <td className="px-4 py-4 font-medium">
                      {formatPrice(plan.monthlyPrice, plan.currency)}
                    </td>
                    <td className="px-4 py-4">
                      {formatPrice(plan.quarterlyPrice, plan.currency)}
                    </td>
                    <td className="px-4 py-4">
                      {formatPrice(plan.yearlyPrice, plan.currency)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex max-w-[320px] flex-wrap gap-1.5">
                        {plan.models.slice(0, 6).map((modelName) => (
                          <span
                            key={modelName}
                            className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600"
                          >
                            {modelName}
                          </span>
                        ))}
                        {plan.models.length > 6 ? (
                          <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-500">
                            +{plan.models.length - 6}
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs leading-5 text-slate-600">
                      <p>5h：{dash(plan.fiveHoursRequests)}</p>
                      <p>周：{dash(plan.weeklyRequests)}</p>
                      <p>月：{dash(plan.monthlyRequests)}</p>
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-700">
                      {dash(plan.tokenLimit)}
                    </td>
                    <td className="px-4 py-4">
                      <p className="max-w-[360px] whitespace-pre-line text-xs leading-5 text-slate-500">
                        {plan.benefits.length ? plan.benefits.join("、") + "\n" : ""}
                        {dash(plan.note)}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section>
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-slate-950">API 调用价格</h2>
          <p className="mt-1 text-sm text-slate-500">
            单位统一为 USD / 1M tokens，便于估算自动化成本
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {modelPrices.map((price) => (
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
      </section>
    </div>
  );
}
