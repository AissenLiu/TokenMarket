import {
  BarChart3,
  Bot,
  Boxes,
  Code2,
  Database,
  Gauge,
  Home,
  LayoutDashboard,
  ListChecks,
  Network,
  PlusCircle,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Trophy,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const categoryIconMap: Record<string, LucideIcon> = {
  Code2,
  Trophy,
  Network,
  WalletCards,
  Send,
  ShieldCheck,
  Bot,
  Boxes,
};

export const mainNav = [
  { href: "/", label: "首页", icon: Home },
  { href: "/coding-plans", label: "Coding Plan 对比", icon: Code2 },
  { href: "/leaderboard", label: "大模型排行", icon: Trophy },
  { href: "/relays", label: "中转与验证", icon: Network },
  { href: "/topups", label: "代充站导航", icon: WalletCards },
  { href: "/telegram", label: "飞机频道导航", icon: Send },
  { href: "/submit", label: "提交网站", icon: PlusCircle },
];

export const adminNav = [
  { href: "/admin", label: "仪表盘", icon: LayoutDashboard },
  { href: "/admin/sites", label: "网站管理", icon: Database },
  { href: "/admin/submissions", label: "提交审核", icon: ListChecks },
  { href: "/admin/categories", label: "分类管理", icon: Boxes },
  { href: "/admin/models", label: "模型管理", icon: BarChart3 },
  { href: "/", label: "返回前台", icon: Home },
];

export const UtilityIcons = {
  Search,
  Sparkles,
  Gauge,
  Settings,
};
