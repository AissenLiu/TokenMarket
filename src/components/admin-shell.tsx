import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { logoutAdmin } from "@/app/actions";
import { adminNav } from "./icons";

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-[#f7f9fd] text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-56 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">TokenCat 管理</p>
            <p className="text-xs text-slate-400">内容与评测后台</p>
          </div>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {adminNav.map((item) => (
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
        <form action={logoutAdmin} className="absolute inset-x-3 bottom-4">
          <button className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            退出登录
          </button>
        </form>
      </aside>
      <main className="lg:pl-56">{children}</main>
    </div>
  );
}
