import { AppShell } from "@/components/app-shell";
import { createSubmission } from "@/app/actions";
import { categories } from "@/lib/seed";

export default async function SubmitPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const params = await searchParams;

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-indigo-700">08. 提交网站</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">提交新网站</h1>
          <p className="mt-2 text-sm text-slate-500">
            提交后进入后台审核队列，审核通过后会出现在对应导航分类中。
          </p>
          {params?.status === "success" ? (
            <div className="mt-5 rounded-md border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              已收到提交，后台会进入待审核队列。
            </div>
          ) : null}
          <form action={createSubmission} className="mt-6 grid gap-5">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              网站名称 *
              <input
                name="siteName"
                required
                className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
                placeholder="输入网站名称"
              />
            </label>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                网站地址 *
                <input
                  name="url"
                  type="url"
                  required
                  className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
                  placeholder="https://example.com"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                网站分类 *
                <select
                  name="categoryKey"
                  required
                  className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
                >
                  {categories.map((category) => (
                    <option key={category.key} value={category.key}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              推荐理由 *
              <textarea
                name="reason"
                required
                maxLength={300}
                rows={5}
                className="resize-none rounded-md border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
                placeholder="请简要描述网站用途、支持模型、价格或频道质量"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              联系方式
              <input
                name="contact"
                className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
                placeholder="邮箱、Telegram 或其他联系方式"
              />
            </label>
            <button className="h-10 rounded-md bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-500">
              提交网站
            </button>
            <p className="text-xs text-slate-400">
              未配置 Supabase 时，页面会完成交互演示但不会持久化写入。
            </p>
          </form>
        </section>
      </div>
    </AppShell>
  );
}
