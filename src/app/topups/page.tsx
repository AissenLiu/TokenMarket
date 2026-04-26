import { AppShell } from "@/components/app-shell";
import { Section } from "@/components/section";
import { SiteCard } from "@/components/site-card";
import { SourceStrip } from "@/components/source-strip";
import { getAppData } from "@/lib/data";

export default async function TopupsPage() {
  const data = await getAppData();
  const topupSites = data.resources.filter((item) => item.categoryKey === "topup");
  const sources = data.sourceLinks.filter((source) => source.name === "AI 比价");

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-indigo-700">05. 代充站导航</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">代充站导航</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            参考 AI 比价，收录 ChatGPT、Gemini、Claude Code、Grok 等 AI 订阅代充与比价入口，实际价格以平台为准。
          </p>
          <div className="mt-5">
            <SourceStrip sources={sources} compact />
          </div>
        </header>
        <div className="grid gap-3 md:grid-cols-4">
          {["ChatGPT Plus", "Gemini Pro", "Claude Code", "Grok"].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-xs text-slate-400">热门比价品类</p>
              <p className="mt-2 text-sm font-semibold text-slate-950">{item}</p>
            </div>
          ))}
        </div>
        <Section title="代充与订阅服务" description="价格、服务范围和风险提示集中展示">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {topupSites.map((site) => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>
        </Section>
      </div>
    </AppShell>
  );
}
