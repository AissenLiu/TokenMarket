import { AppShell } from "@/components/app-shell";
import { Section } from "@/components/section";
import { SiteCard } from "@/components/site-card";
import { SourceStrip } from "@/components/source-strip";
import { getAppData } from "@/lib/data";

export default async function RelaysPage() {
  const data = await getAppData();
  const relaySites = data.resources.filter(
    (item) => item.categoryKey === "relay" || item.categoryKey === "validation",
  );
  const sources = data.sourceLinks.filter((source) => source.name === "禾维 AI");

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-indigo-700">04. 中转站与模型验证</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">
            中转站导航与模型验证评价
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            参考禾维 AI 的展示维度，记录中转站支持模型、价格、在线率、掺水率、延迟、原生度与质量评分。
          </p>
          <div className="mt-5">
            <SourceStrip sources={sources} compact />
          </div>
        </header>

        <Section title="中转站导航" description="支持模型、在线率、掺水率、延迟和近期验证信息">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {relaySites.map((site) => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>
        </Section>

        <Section title="模型验证评价" description="参考 hvoy.ai 的验证思路，保留独立复测字段">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="px-4 py-3">站点</th>
                  <th className="px-4 py-3">模型</th>
                  <th className="px-4 py-3">接口</th>
                  <th className="px-4 py-3">延迟</th>
                  <th className="px-4 py-3">可用性</th>
                  <th className="px-4 py-3">掺水率</th>
                  <th className="px-4 py-3">原生度</th>
                  <th className="px-4 py-3">质量</th>
                  <th className="px-4 py-3">复测时间</th>
                  <th className="px-4 py-3">备注</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.relayEvaluations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 font-semibold text-slate-950">
                      {item.relayName}
                    </td>
                    <td className="px-4 py-4">{item.model}</td>
                    <td className="px-4 py-4 text-slate-500">{item.endpoint}</td>
                    <td className="px-4 py-4">{item.latencyMs}ms</td>
                    <td className="px-4 py-4">{item.availability}%</td>
                    <td className="px-4 py-4">{item.waterRate}%</td>
                    <td className="px-4 py-4">{item.authenticity}</td>
                    <td className="px-4 py-4 font-semibold">{item.qualityScore}</td>
                    <td className="px-4 py-4 text-slate-500">{item.checkedAt}</td>
                    <td className="px-4 py-4 text-slate-500">{item.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    </AppShell>
  );
}
