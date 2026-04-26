export function formatNumber(value: number) {
  return new Intl.NumberFormat("zh-CN").format(value);
}

export function formatUsd(value: number | null) {
  if (value === null) return "-";
  return `$${value.toLocaleString("en-US", {
    maximumFractionDigits: 4,
    minimumFractionDigits: value < 1 ? 2 : 0,
  })}`;
}

export function cnStatus(status: string) {
  const map: Record<string, string> = {
    active: "已上线",
    pending: "待审核",
    archived: "已归档",
  };
  return map[status] ?? status;
}
