import Link from "next/link";
import { Rocket } from "lucide-react";
import { mainNav } from "./icons";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-56 border-r border-slate-200 bg-white/90 backdrop-blur xl:block">
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-white">
            <Rocket className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">TokenCat</p>
            <p className="text-xs text-slate-400">AI 导航站</p>
          </div>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex h-10 items-center gap-3 rounded-md px-3 text-sm text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute inset-x-3 bottom-4 rounded-lg bg-indigo-50 p-4">
          <p className="text-sm font-semibold text-indigo-950">AI 工具、价格与评测</p>
          <p className="mt-1 text-xs leading-5 text-indigo-700">
            一站式整理 Coding Plan、模型排行与中转站质量。
          </p>
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
        <nav className="flex gap-2 overflow-x-auto px-4 pb-3">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="xl:pl-56">{children}</main>
    </div>
  );
}
