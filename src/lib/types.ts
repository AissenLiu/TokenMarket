import type { LucideIcon } from "lucide-react";

export type CategoryKey =
  | "coding"
  | "leaderboard"
  | "relay"
  | "topup"
  | "telegram"
  | "validation"
  | "tool";

export type Status = "active" | "pending" | "archived";

export type Category = {
  id: string;
  key: CategoryKey;
  name: string;
  description: string;
  iconName: string;
  sortOrder: number;
  count: number;
};

export type Resource = {
  id: string;
  name: string;
  categoryKey: CategoryKey;
  url: string;
  description: string;
  tags: string[];
  region: "国内" | "海外" | "全球";
  status: Status;
  score: number;
  visits: number;
  latencyMs?: number;
  uptime?: number;
  waterRate?: number;
  pricingNote?: string;
  sourceName?: string;
  sourceUrl?: string;
  models?: string[];
  verifiedAt?: string;
};

export type CodingPlan = {
  id: string;
  vendor: string;
  plan: string;
  monthlyPrice: string;
  quota: string;
  quotaType: "Usage-based" | "Quota-based" | "Message-based" | "免费" | "API";
  period: "5h" | "week" | "month";
  requests?: string;
  tokens?: string;
  monthlyValue?: string;
  valueRatio?: string;
  tps?: string;
  includedModels: string[];
  strengths: string[];
  bestFor: string;
  officialUrl: string;
  sourceName: string;
  sourceUrl: string;
  score: number;
};

export type ModelPrice = {
  id: string;
  provider: string;
  model: string;
  inputUsdPer1M: number | null;
  outputUsdPer1M: number | null;
  context: string;
  maxOutput?: string;
  source: string;
  sourceUrl: string;
  updatedAt: string;
};

export type ModelRanking = {
  id: string;
  rank: number;
  model: string;
  provider: string;
  arenaScore: number;
  codeScore: number;
  chineseScore: number;
  reasoningScore: number;
  context: string;
  source: "Arena" | "SuperCLUE" | "综合";
  sourceUrl: string;
  badge: string;
};

export type RelayEvaluation = {
  id: string;
  relayName: string;
  model: string;
  endpoint: string;
  latencyMs: number;
  availability: number;
  waterRate: number;
  authenticity: "原生" | "疑似路由" | "待复测";
  qualityScore: number;
  checkedAt: string;
  notes: string;
  sourceName: string;
  sourceUrl: string;
};

export type SourceLink = {
  name: string;
  url: string;
  description: string;
};

export type Submission = {
  id: string;
  siteName: string;
  url: string;
  categoryKey: CategoryKey;
  reason: string;
  contact?: string;
  status: "待审核" | "已通过" | "已拒绝";
  createdAt: string;
};

export type DashboardStats = {
  totalSites: number;
  activeSites: number;
  todayVisits: number;
  pendingSubmissions: number;
};

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};
