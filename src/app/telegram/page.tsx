import { AppShell } from "@/components/app-shell";
import { Section } from "@/components/section";
import { SiteCard } from "@/components/site-card";
import { SourceStrip } from "@/components/source-strip";
import { getAppData } from "@/lib/data";

export default async function TelegramPage() {
  const data = await getAppData();
  const channels = data.resources.filter((item) => item.categoryKey === "telegram");
  const sources = data.sourceLinks.filter((source) => source.name === "TelegramGroup");

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-indigo-700">06. 飞机频道导航</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">
            Telegram 频道导航
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            参考开源 TelegramGroup，聚合 AI 资讯、工具、搜索、开发与资源频道，方便快速发现可用入口。
          </p>
          <div className="mt-5">
            <SourceStrip sources={sources} compact />
          </div>
        </header>
        <Section title="频道与资源" description="按主题标签和活跃度维护">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {channels.map((site) => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>
        </Section>
      </div>
    </AppShell>
  );
}
