import { getRedis } from "./redis";
import type { CodingPlan } from "./types";

const CODING_PLAN_SOURCE_URL =
  "https://raw.githubusercontent.com/wmpeng/codingplan/main/plans.json";
const CODING_PLAN_REPO_URL = "https://github.com/wmpeng/codingplan";
const CODING_PLAN_CACHE_KEY = "tokencat:coding-plans:wmpeng:v1";
const CODING_PLAN_CACHE_SECONDS = 60 * 60 * 24;

type RawCodingPlan = {
  vendor: string;
  plan: string;
  type: "Coding Plan" | "Token Plan";
  action: string;
  firstMonthPrice: number | string;
  monthlyPrice: number | string;
  quarterlyPrice: number | string;
  yearlyPrice: number | string;
  models: string[];
  fiveHoursRequests: number | string;
  weeklyRequests: number | string;
  monthlyRequests: number | string;
  tokenLimit: number | string;
  benefits: string[];
  note: string;
  currency?: string;
  discontinued?: boolean;
};

function toNullableNumber(value: number | string) {
  return typeof value === "number" ? value : null;
}

function toText(value: number | string) {
  return typeof value === "number" ? String(value) : value;
}

function tokenLimitText(value: number | string) {
  return typeof value === "number" ? `${value}M` : value;
}

function normalizePlan(plan: RawCodingPlan, index: number): CodingPlan {
  const currency = plan.currency ?? "¥";

  return {
    id: `wmpeng-${index + 1}-${plan.vendor}-${plan.plan}-${plan.type}`
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
      .replace(/^-|-$/g, ""),
    vendor: plan.vendor,
    plan: plan.plan,
    type: plan.type,
    action: plan.action,
    firstMonthPrice: toNullableNumber(plan.firstMonthPrice),
    monthlyPrice: toNullableNumber(plan.monthlyPrice),
    quarterlyPrice: toNullableNumber(plan.quarterlyPrice),
    yearlyPrice: toNullableNumber(plan.yearlyPrice),
    currency,
    models: plan.models ?? [],
    fiveHoursRequests: toText(plan.fiveHoursRequests),
    weeklyRequests: toText(plan.weeklyRequests),
    monthlyRequests: toText(plan.monthlyRequests),
    tokenLimit: tokenLimitText(plan.tokenLimit),
    benefits: plan.benefits ?? [],
    discontinued: plan.discontinued ?? false,
    note: plan.note ?? "",
    sourceName: "wmpeng/codingplan",
    sourceUrl: CODING_PLAN_REPO_URL,
    sortOrder: index + 1,
  };
}

async function fetchCodingPlansFromGitHub() {
  const response = await fetch(CODING_PLAN_SOURCE_URL, {
    headers: { accept: "application/json" },
    next: {
      revalidate: CODING_PLAN_CACHE_SECONDS,
      tags: ["coding-plans"],
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch coding plans: ${response.status}`);
  }

  const rawPlans = (await response.json()) as RawCodingPlan[];
  return rawPlans.map(normalizePlan);
}

export async function getCodingPlans(): Promise<CodingPlan[]> {
  const redis = getRedis();

  if (redis) {
    const cached = await redis.get<CodingPlan[]>(CODING_PLAN_CACHE_KEY);
    if (cached) return cached;
  }

  const plans = await fetchCodingPlansFromGitHub();

  if (redis) {
    await redis.set(CODING_PLAN_CACHE_KEY, plans, {
      ex: CODING_PLAN_CACHE_SECONDS,
    });
  }

  return plans;
}
