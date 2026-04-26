import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { SourceStrip } from "@/components/source-strip";
import { getAppData } from "@/lib/data";

export default async function LeaderboardPage() {
  const data = await getAppData();
  const sources = data.sourceLinks.filter((source) =>
    ["Arena Leaderboard", "SuperCLUE"].includes(source.name),
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-indigo-700">03. 大模型排行</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">大模型排行榜</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            汇总 Arena 文本/代码榜与 SuperCLUE 中文评测视角，展示模型综合能力、代码能力、中文表现、推理能力和上下文窗口。
          </p>
          <div className="mt-5">
            <SourceStrip sources={sources} compact />
          </div>
        </header>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-4 py-3">排名</th>
                <th className="px-4 py-3">模型</th>
                <th className="px-4 py-3">提供方</th>
                <th className="px-4 py-3">Arena</th>
                <th className="px-4 py-3">代码</th>
                <th className="px-4 py-3">中文</th>
                <th className="px-4 py-3">推理</th>
                <th className="px-4 py-3">上下文</th>
                <th className="px-4 py-3">来源</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.modelRankings.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 text-lg font-semibold text-slate-950">
                    {item.rank}
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-950">
                    <p>{item.model}</p>
                    <p className="mt-1 text-xs font-normal text-indigo-600">
                      {item.badge}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-slate-500">{item.provider}</td>
                  <td className="px-4 py-4">{item.arenaScore}</td>
                  <td className="px-4 py-4">{item.codeScore}</td>
                  <td className="px-4 py-4">{item.chineseScore}</td>
                  <td className="px-4 py-4">{item.reasoningScore}</td>
                  <td className="px-4 py-4">{item.context}</td>
                  <td className="px-4 py-4">
                    <Link
                      href={item.sourceUrl}
                      target="_blank"
                      className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700"
                    >
                      {item.source}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
