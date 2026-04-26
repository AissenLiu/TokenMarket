import { Rocket } from "lucide-react";
import { loginAdmin } from "@/app/actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-[#eef2ff] px-4">
      <section className="w-full max-w-sm rounded-lg border border-indigo-100 bg-white p-6 shadow-xl shadow-indigo-100/70">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-600 text-white">
            <Rocket className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">TokenCat 管理后台</p>
            <p className="text-xs text-slate-400">请输入管理员密码</p>
          </div>
        </div>
        {params?.error ? (
          <div className="mt-5 rounded-md border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            密码不正确，请重试。
          </div>
        ) : null}
        <form action={loginAdmin} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={params?.next ?? "/admin"} />
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            管理员密码
            <input
              name="password"
              type="password"
              required
              className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
              placeholder="输入 ADMIN_PASSWORD"
            />
          </label>
          <button className="h-10 w-full rounded-md bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-500">
            登录后台
          </button>
        </form>
        <p className="mt-4 text-xs leading-5 text-slate-400">
          本地默认密码为 tokencat-admin；生产环境请在 Vercel 配置 ADMIN_PASSWORD 和 ADMIN_SESSION_SECRET。
        </p>
      </section>
    </main>
  );
}
