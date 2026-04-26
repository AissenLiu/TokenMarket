import { createResource } from "@/app/actions";
import { AdminShell } from "@/components/admin-shell";
import { StatusBadge } from "@/components/status-badge";
import { getAppData } from "@/lib/data";
import { categories } from "@/lib/seed";

export default async function AdminSitesPage() {
  const data = await getAppData();

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium text-indigo-700">A2. 网站管理</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">网站管理</h1>
      </header>
      <form
        action={createResource}
        className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-6"
      >
        <input name="name" required placeholder="网站名称" className="admin-input" />
        <input name="url" required type="url" placeholder="网站链接" className="admin-input" />
        <select name="categoryKey" className="admin-input">
          {categories.map((category) => (
            <option key={category.key} value={category.key}>
              {category.name}
            </option>
          ))}
        </select>
        <input name="tags" placeholder="标签，逗号分隔" className="admin-input" />
        <input name="score" type="number" step="0.1" placeholder="评分" className="admin-input" />
        <button className="h-10 rounded-md bg-indigo-600 px-4 text-sm font-medium text-white">
          新增站点
        </button>
        <textarea
          name="description"
          required
          placeholder="网站描述"
          className="admin-input min-h-20 lg:col-span-6"
        />
      </form>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              <th className="px-4 py-3">网站名称</th>
              <th className="px-4 py-3">分类</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">访问量</th>
              <th className="px-4 py-3">评分</th>
              <th className="px-4 py-3">标签</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.resources.map((site) => (
              <tr key={site.id} className="hover:bg-slate-50">
                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-950">{site.name}</p>
                  <p className="text-xs text-slate-400">{site.url}</p>
                </td>
                <td className="px-4 py-4">{site.categoryKey}</td>
                <td className="px-4 py-4"><StatusBadge status={site.status} /></td>
                <td className="px-4 py-4">{site.visits}</td>
                <td className="px-4 py-4">{site.score}</td>
                <td className="px-4 py-4">{site.tags.join(" / ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </AdminShell>
  );
}
