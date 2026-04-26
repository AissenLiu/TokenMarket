import { cnStatus } from "@/lib/format";

type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const className =
    status === "active" || status === "已通过"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
      : status === "pending" || status === "待审核"
        ? "bg-amber-50 text-amber-700 ring-amber-100"
        : "bg-slate-50 text-slate-500 ring-slate-100";

  return (
    <span
      className={`inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium ring-1 ${className}`}
    >
      {cnStatus(status)}
    </span>
  );
}
