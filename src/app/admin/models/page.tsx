import { createModelPrice } from "@/app/actions";
import { AdminShell } from "@/components/admin-shell";
import { formatUsd } from "@/lib/format";
import { getAppData } from "@/lib/data";

export default async function AdminModelsPage() {
  const data = await getAppData();

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium text-indigo-700">A6. 模型管理</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">模型价格与榜单</h1>
      </header>
      <form
        action={createModelPrice}
        className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-6"
      >
        <input name="provider" required placeholder="厂商" className="admin-input" />
        <input name="model" required placeholder="模型" className="admin-input" />
        <input name="inputUsdPer1M" type="number" step="0.0001" placeholder="输入价格" className="admin-input" />
        <input name="outputUsdPer1M" type="number" step="0.0001" placeholder="输出价格" className="admin-input" />
        <input name="context" required placeholder="上下文" className="admin-input" />
        <button className="h-10 rounded-md bg-indigo-600 px-4 text-sm font-medium text-white">
          新增模型
        </button>
      </form>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-4 py-3">模型</th>
                <th className="px-4 py-3">输入</th>
                <th className="px-4 py-3">输出</th>
                <th className="px-4 py-3">上下文</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.modelPrices.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-950">{item.model}</p>
                    <p className="text-xs text-slate-400">{item.provider}</p>
                  </td>
                  <td className="px-4 py-3">{formatUsd(item.inputUsdPer1M)}</td>
                  <td className="px-4 py-3">{formatUsd(item.outputUsdPer1M)}</td>
                  <td className="px-4 py-3">{item.context}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-4 py-3">排名</th>
                <th className="px-4 py-3">模型</th>
                <th className="px-4 py-3">代码</th>
                <th className="px-4 py-3">中文</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.modelRankings.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-semibold">{item.rank}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-950">{item.model}</p>
                    <p className="text-xs text-slate-400">{item.provider}</p>
                  </td>
                  <td className="px-4 py-3">{item.codeScore}</td>
                  <td className="px-4 py-3">{item.chineseScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </AdminShell>
  );
}
