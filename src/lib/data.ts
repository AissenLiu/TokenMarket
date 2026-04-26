import { getRedis } from "./redis";
import { getCodingPlans } from "./coding-plans";
import {
  categories,
  dashboardStats,
  modelPrices,
  modelRankings,
  relayEvaluations,
  resources,
  sourceLinks,
  submissions,
} from "./seed";
import { getSupabaseAdmin } from "./supabase";
import type {
  Category,
  CodingPlan,
  DashboardStats,
  ModelPrice,
  ModelRanking,
  RelayEvaluation,
  Resource,
  SourceLink,
  Submission,
} from "./types";

type AppData = {
  categories: Category[];
  resources: Resource[];
  codingPlans: CodingPlan[];
  modelPrices: ModelPrice[];
  modelRankings: ModelRanking[];
  relayEvaluations: RelayEvaluation[];
  submissions: Submission[];
  sourceLinks: SourceLink[];
  stats: DashboardStats;
  source: "supabase" | "seed";
};

const seedData: AppData = {
  categories,
  resources,
  codingPlans: [],
  modelPrices,
  modelRankings,
  relayEvaluations,
  submissions,
  sourceLinks,
  stats: dashboardStats,
  source: "seed",
};

async function withRedis<T>(key: string, loader: () => Promise<T>, ttl = 300) {
  const redis = getRedis();
  if (!redis) return loader();

  const cached = await redis.get<T>(key);
  if (cached) return cached;

  const value = await loader();
  await redis.set(key, value, { ex: ttl });
  return value;
}

export async function getAppData(): Promise<AppData> {
  return withRedis("tokencat:app-data:v5", async () => {
    const codingPlans = await getCodingPlans();
    const dataWithRemotePlans = {
      ...seedData,
      categories: seedData.categories.map((category) =>
        category.key === "coding"
          ? { ...category, count: codingPlans.length }
          : category,
      ),
      codingPlans,
    };

    const supabase = getSupabaseAdmin();
    if (!supabase) return dataWithRemotePlans;

    try {
      const [
        categoryResult,
        resourceResult,
        priceResult,
        rankingResult,
        evalResult,
        submissionResult,
      ] = await Promise.all([
        supabase.from("categories").select("*").order("sort_order"),
        supabase.from("resources").select("*").order("score", { ascending: false }),
        supabase.from("model_prices").select("*").order("provider"),
        supabase.from("model_rankings").select("*").order("rank"),
        supabase.from("relay_evaluations").select("*").order("checked_at", {
          ascending: false,
        }),
        supabase.from("submissions").select("*").order("created_at", {
          ascending: false,
        }),
      ]);

      if (
        categoryResult.error ||
        resourceResult.error ||
        priceResult.error ||
        rankingResult.error ||
        evalResult.error ||
        submissionResult.error
      ) {
        return dataWithRemotePlans;
      }

      const activeSites = resourceResult.data.filter((item) => item.status === "active");

      return {
        categories: categoryResult.data.map((item) => ({
          id: item.id,
          key: item.key,
          name: item.name,
          description: item.description,
          iconName: item.icon_name,
          sortOrder: item.sort_order,
          count: item.key === "coding" ? codingPlans.length : item.count,
        })),
        resources: resourceResult.data.map((item) => ({
          id: item.id,
          name: item.name,
          categoryKey: item.category_key,
          url: item.url,
          description: item.description,
          tags: item.tags ?? [],
          region: item.region,
          status: item.status,
          score: item.score,
          visits: item.visits,
          latencyMs: item.latency_ms ?? undefined,
          uptime: item.uptime ?? undefined,
          waterRate: item.water_rate ?? undefined,
          pricingNote: item.pricing_note ?? undefined,
          sourceName: item.source_name ?? undefined,
          sourceUrl: item.source_url ?? undefined,
          models: item.models ?? undefined,
          verifiedAt: item.verified_at ?? undefined,
        })),
        codingPlans,
        modelPrices: priceResult.data.map((item) => ({
          id: item.id,
          provider: item.provider,
          model: item.model,
          inputUsdPer1M: item.input_usd_per_1m,
          outputUsdPer1M: item.output_usd_per_1m,
          context: item.context,
          maxOutput: item.max_output ?? undefined,
          source: item.source,
          sourceUrl: item.source_url ?? "",
          updatedAt: item.updated_at,
        })),
        modelRankings: rankingResult.data.map((item) => ({
          id: item.id,
          rank: item.rank,
          model: item.model,
          provider: item.provider,
          arenaScore: item.arena_score,
          codeScore: item.code_score,
          chineseScore: item.chinese_score,
          reasoningScore: item.reasoning_score,
          context: item.context,
          source: item.source,
          sourceUrl: item.source_url ?? "",
          badge: item.badge ?? "综合",
        })),
        relayEvaluations: evalResult.data.map((item) => ({
          id: item.id,
          relayName: item.relay_name,
          model: item.model,
          endpoint: item.endpoint,
          latencyMs: item.latency_ms,
          availability: item.availability,
          waterRate: item.water_rate ?? 0,
          authenticity: item.authenticity,
          qualityScore: item.quality_score,
          checkedAt: item.checked_at,
          notes: item.notes,
          sourceName: item.source_name ?? "后台录入",
          sourceUrl: item.source_url ?? "",
        })),
        submissions: submissionResult.data.map((item) => ({
          id: item.id,
          siteName: item.site_name,
          url: item.url,
          categoryKey: item.category_key,
          reason: item.reason,
          contact: item.contact ?? undefined,
          status: item.status,
          createdAt: item.created_at,
        })),
        stats: {
          totalSites: resourceResult.data.length,
          activeSites: activeSites.length,
          todayVisits: resourceResult.data.reduce((sum, item) => sum + item.visits, 0),
          pendingSubmissions: submissionResult.data.filter(
            (item) => item.status === "待审核",
          ).length,
        },
        sourceLinks,
        source: "supabase",
      };
    } catch {
      return dataWithRemotePlans;
    }
  });
}
