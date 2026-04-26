import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { SourceLink } from "@/lib/types";

type SourceStripProps = {
  sources: SourceLink[];
  compact?: boolean;
};

export function SourceStrip({ sources, compact = false }: SourceStripProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {sources.map((source) => (
        <Link
          key={source.url}
          href={source.url}
          target="_blank"
          className={`shrink-0 rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700 ${
            compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"
          }`}
          title={source.description}
        >
          <span className="inline-flex items-center gap-2">
            {source.name}
            <ExternalLink className="h-3.5 w-3.5" />
          </span>
        </Link>
      ))}
    </div>
  );
}
