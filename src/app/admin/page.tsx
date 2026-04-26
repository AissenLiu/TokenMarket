import { Activity, Clock, Database, Users } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { Section } from "@/components/section";
import { formatNumber } from "@/lib/format";
import { getAppData } from "@/lib/data";

export default async function AdminPage() {
  const data = await getAppData();
  const statItems = [
    { label: "收录站点", value: data.stats.totalSites, icon: Database },
    { label: "已上线站点", value: data.stats.activeSites, icon: Activity },
    { label: "今日访问", value: data.stats.todayVisits, icon: Users },
    { label: "待审核提交", value: data.stats.pendingSubmissions, icon: Clock },
  ];

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium text-indigo-700">A1. 管理后台</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">仪表盘</h1>
      </header>
      <div className="grid gap-4 md:grid-cols-4">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{item.label}</p>
              <item.icon className="h-4 w-4 text-indigo-600" />
            </div>
            <p className="mt-3 text-2xl font-semibold text-slate-950">
              {formatNumber(item.value)}
            </p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="最新提交">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            {data.submissions.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-3 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-slate-950">{item.siteName}</p>
                  <p className="text-xs text-slate-400">{item.url}</p>
                </div>
                <span className="text-xs text-slate-500">{item.status}</span>
              </div>
            ))}
          </div>
        </Section>
        <Section title="热门网站">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            {data.resources.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-3 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-slate-950">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.description}</p>
                </div>
                <span className="text-sm font-semibold text-slate-950">
                  {item.score}
                </span>
              </div>
            ))}
          </div>
        </Section>
      </div>
      </div>
    </AdminShell>
  );
}
