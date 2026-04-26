"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, getAdminPassword, getAdminSessionSecret } from "@/lib/auth";
import { getRedis } from "@/lib/redis";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { CategoryKey } from "@/lib/types";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

async function clearCache() {
  const redis = getRedis();
  if (redis) {
    await redis.del("tokencat:app-data:v2");
  }
}

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE)?.value;
  if (session !== getAdminSessionSecret()) {
    throw new Error("未登录或登录已失效");
  }
}

export async function loginAdmin(formData: FormData) {
  const password = text(formData, "password");
  const next = text(formData, "next") || "/admin";

  if (password !== getAdminPassword()) {
    redirect("/admin/login?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, getAdminSessionSecret(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

export async function createSubmission(formData: FormData) {
  const payload = {
    site_name: text(formData, "siteName"),
    url: text(formData, "url"),
    category_key: text(formData, "categoryKey") as CategoryKey,
    reason: text(formData, "reason"),
    contact: text(formData, "contact") || null,
    status: "待审核",
  };

  if (!payload.site_name || !payload.url || !payload.category_key || !payload.reason) {
    throw new Error("请完整填写网站名称、链接、分类和推荐理由");
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("submissions").insert(payload);
    if (error) throw new Error(error.message);
    await clearCache();
  }

  revalidatePath("/");
  revalidatePath("/submit");
  revalidatePath("/admin/submissions");
  redirect("/submit?status=success");
}

export async function createResource(formData: FormData) {
  await requireAdmin();

  const tags = text(formData, "tags")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const payload = {
    name: text(formData, "name"),
    category_key: text(formData, "categoryKey") as CategoryKey,
    url: text(formData, "url"),
    description: text(formData, "description"),
    tags,
    region: text(formData, "region") || "全球",
    status: text(formData, "status") || "active",
    score: Number(text(formData, "score") || 4.5),
    visits: Number(text(formData, "visits") || 0),
  };

  if (!payload.name || !payload.url || !payload.category_key) {
    throw new Error("请填写站点名称、链接和分类");
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const result = process.env.SUPABASE_SERVICE_ROLE_KEY
      ? await supabase.from("resources").insert(payload)
      : process.env.ADMIN_DB_SECRET
        ? await supabase.rpc("admin_create_resource", {
            admin_secret: process.env.ADMIN_DB_SECRET,
            payload,
          })
        : {
            error: new Error(
              "缺少 SUPABASE_SERVICE_ROLE_KEY 或 ADMIN_DB_SECRET，无法写入后台数据",
            ),
          };

    const { error } = result;
    if (error) throw new Error(error.message);
    await clearCache();
  }

  revalidatePath("/");
  revalidatePath("/admin/sites");
}

export async function createModelPrice(formData: FormData) {
  await requireAdmin();

  const payload = {
    provider: text(formData, "provider"),
    model: text(formData, "model"),
    input_usd_per_1m: Number(text(formData, "inputUsdPer1M") || 0),
    output_usd_per_1m: Number(text(formData, "outputUsdPer1M") || 0),
    context: text(formData, "context"),
    max_output: text(formData, "maxOutput") || null,
    source: text(formData, "source") || "后台录入",
    source_url: text(formData, "sourceUrl") || "",
    updated_at: new Date().toISOString().slice(0, 10),
  };

  if (!payload.provider || !payload.model || !payload.context) {
    throw new Error("请填写提供方、模型和上下文窗口");
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const result = process.env.SUPABASE_SERVICE_ROLE_KEY
      ? await supabase.from("model_prices").upsert(payload, {
          onConflict: "provider,model",
        })
      : process.env.ADMIN_DB_SECRET
        ? await supabase.rpc("admin_create_model_price", {
            admin_secret: process.env.ADMIN_DB_SECRET,
            payload,
          })
        : {
            error: new Error(
              "缺少 SUPABASE_SERVICE_ROLE_KEY 或 ADMIN_DB_SECRET，无法写入后台数据",
            ),
          };

    const { error } = result;
    if (error) throw new Error(error.message);
    await clearCache();
  }

  revalidatePath("/coding-plans");
  revalidatePath("/admin/models");
}
