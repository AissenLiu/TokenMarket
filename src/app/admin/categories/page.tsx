import { AdminShell } from "@/components/admin-shell";
import { categoryIconMap } from "@/components/icons";
import { getAppData } from "@/lib/data";

export default async function AdminCategoriesPage() {
  const data = await getAppData();

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium text-indigo-700">A4. 分类管理</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">分类管理</h1>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.categories.map((category) => {
          const Icon = categoryIconMap[category.iconName];
          return (
            <article
              key={category.id}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-indigo-50 text-indigo-700">
                  {Icon ? <Icon className="h-5 w-5" /> : null}
                </div>
                <div>
                  <p className="font-semibold text-slate-950">{category.name}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {category.description}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-slate-400">排序 {category.sortOrder}</span>
                <span className="font-semibold text-slate-950">{category.count} 条</span>
              </div>
            </article>
          );
        })}
      </div>
      </div>
    </AdminShell>
  );
}
