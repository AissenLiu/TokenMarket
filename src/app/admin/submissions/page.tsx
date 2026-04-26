import { AdminShell } from "@/components/admin-shell";
import { StatusBadge } from "@/components/status-badge";
import { getAppData } from "@/lib/data";

export default async function AdminSubmissionsPage() {
  const data = await getAppData();

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium text-indigo-700">A3. 提交审核</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">提交审核</h1>
      </header>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              <th className="px-4 py-3">网站名称</th>
              <th className="px-4 py-3">分类</th>
              <th className="px-4 py-3">推荐理由</th>
              <th className="px-4 py-3">提交人</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.submissions.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-950">{item.siteName}</p>
                  <p className="text-xs text-slate-400">{item.url}</p>
                </td>
                <td className="px-4 py-4">{item.categoryKey}</td>
                <td className="px-4 py-4 text-slate-500">{item.reason}</td>
                <td className="px-4 py-4 text-slate-500">{item.contact ?? "-"}</td>
                <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
                <td className="px-4 py-4 text-slate-500">{item.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </AdminShell>
  );
}
