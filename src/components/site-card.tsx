import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { formatNumber } from "@/lib/format";
import type { Resource } from "@/lib/types";
import { StatusBadge } from "./status-badge";

type SiteCardProps = {
  site: Resource;
};

export function SiteCard({ site }: SiteCardProps) {
  const hostname = new URL(site.url).hostname;

  return (
    <article className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
      <div className="flex items-start gap-3">
        <Image
          src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`}
          alt=""
          width={40}
          height={40}
          unoptimized
          className="h-10 w-10 rounded-md border border-slate-100 bg-slate-50"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-slate-950">
              {site.name}
            </h3>
            <StatusBadge status={site.status} />
          </div>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
            {site.description}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {site.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-slate-50 px-2 py-1 text-xs text-slate-600 ring-1 ring-slate-100"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-3 text-xs">
        <div>
          <p className="text-slate-400">评分</p>
          <p className="mt-1 font-semibold text-slate-900">{site.score}</p>
        </div>
        <div>
          <p className="text-slate-400">在线率</p>
          <p className="mt-1 font-semibold text-slate-900">
            {site.uptime ? `${site.uptime}%` : formatNumber(site.visits)}
          </p>
        </div>
        <div>
          <p className="text-slate-400">{site.latencyMs ? "延迟" : "地区"}</p>
          <p className="mt-1 font-semibold text-slate-900">
            {site.latencyMs ? `${site.latencyMs}ms` : site.region}
          </p>
        </div>
      </div>
      <Link
        href={site.url}
        target="_blank"
        className="mt-4 inline-flex h-8 w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-3 text-xs font-medium text-white transition hover:bg-indigo-500"
      >
        访问网站 <ExternalLink className="h-3.5 w-3.5" />
      </Link>
    </article>
  );
}
