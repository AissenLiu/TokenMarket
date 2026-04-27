import Link from "next/link";
import { Info, Mail, PlusCircle, Rocket, Search, Sparkles, Trophy } from "lucide-react";
import { MainNavigation } from "./main-navigation";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-950">
      <header className="fixed inset-x-0 top-0 z-30 hidden h-20 border-b border-slate-200 bg-white/90 backdrop-blur-xl xl:flex">
        <div className="flex w-64 items-center gap-3 border-r border-slate-100 px-7">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100">
            <Rocket className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-semibold leading-5">TokenCat</p>
            <p className="mt-1 text-xs text-slate-500">发现最好的 AI 工具和服务</p>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-between gap-6 px-8">
          <label className="relative w-full max-w-2xl">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              className="h-12 w-full rounded-full border border-slate-200 bg-white pl-12 pr-5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
              placeholder="搜索模型、服务、网站..."
            />
          </label>
          <div className="flex items-center gap-3">
            <Link
              href="/leaderboard"
              className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:text-indigo-700"
              aria-label="查看大模型排行"
            >
              <Trophy className="h-5 w-5" />
            </Link>
            <Link
              href="/submit"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700"
            >
              <PlusCircle className="h-4 w-4" />
              提交网站
            </Link>
            <Link
              href="/admin/login"
              className="inline-flex h-11 items-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-500"
            >
              登录 / 注册
            </Link>
          </div>
        </div>
      </header>

      <aside className="fixed bottom-0 left-0 top-20 z-20 hidden w-64 border-r border-slate-200 bg-white/90 backdrop-blur-xl xl:block">
        <MainNavigation />
        <div className="absolute inset-x-4 bottom-32 rounded-xl border border-indigo-100 bg-indigo-50/80 p-4">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-white text-indigo-600 shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="mt-3 text-sm font-semibold text-indigo-950">AI 工具、价格与评测</p>
          <p className="mt-1 text-xs leading-5 text-indigo-700">
            汇总 Coding Plan、模型榜单、中转验证与资源入口。
          </p>
        </div>
        <div className="absolute inset-x-6 bottom-6 space-y-3 text-xs text-slate-500">
          <Link href="/submit" className="flex items-center gap-2 hover:text-indigo-700">
            <Info className="h-4 w-4" />
            关于我们
          </Link>
          <Link href="/submit" className="flex items-center gap-2 hover:text-indigo-700">
            <Sparkles className="h-4 w-4" />
            使用指南
          </Link>
          <Link href="/submit" className="flex items-center gap-2 hover:text-indigo-700">
            <Mail className="h-4 w-4" />
            反馈建议
          </Link>
          <p className="pt-5 text-slate-400">© 2026 TokenCat</p>
        </div>
      </aside>
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur xl:hidden">
        <div className="flex h-14 items-center gap-3 px-4">
          <Rocket className="h-5 w-5 text-indigo-600" />
          <span className="font-semibold">TokenCat</span>
          <Link
            href="/admin"
            className="ml-auto rounded-md bg-slate-950 px-3 py-1.5 text-xs font-medium text-white"
          >
            后台
          </Link>
        </div>
        <MainNavigation variant="mobile" />
      </header>
      <main className="xl:pl-64 xl:pt-20">{children}</main>
    </div>
  );
}
