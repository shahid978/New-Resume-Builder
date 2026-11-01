import "server-only";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { aiUsage, resumes, subscriptions } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  currentMonthKey,
  FREE_AI_REQUESTS_PER_MONTH,
  FREE_RESUME_LIMIT,
  PLANS,
  PRO_AI_REQUESTS_PER_MONTH,
  PRO_RESUME_LIMIT,
} from "@/lib/config/constants";

export async function canCreateResume() {
  const session = await sessionFromRequest();
  if (!session?.user?.id) {
    return { ok: false, reason: "unauthenticated", limit: 0, plan: PLANS.free, remaining: 0 };
  }

  const userId = session.user.id;
  const plan = await planForUserPlan(userId);
  const limit = plan === PLANS.pro ? PRO_RESUME_LIMIT : FREE_RESUME_LIMIT;
  const count = await db.$count(resumes, eq(resumes.userId, userId));
  const remaining = Math.max(0, limit - count);
  return {
    ok: remaining > 0,
    reason: remaining > 0 ? undefined : "resume limit reached",
    limit,
    plan,
    remaining,
  };
}

export async function canGenerateAI(
  userId: string,
  _operation: "writing" | "matching"
) {
  const session = await sessionFromRequest();
  if (!session?.user?.id || session.user.id !== userId) {
    return { ok: false, reason: "unauthorized", remaining: 0, limit: 0 };
  }
  const plan = await planForUserPlan(userId);
  const limit = plan === PLANS.pro ? PRO_AI_REQUESTS_PER_MONTH : FREE_AI_REQUESTS_PER_MONTH;
  const count = await db.$count(aiUsage, and(
    eq(aiUsage.userId, userId),
    eq(aiUsage.periodKey, currentMonthKey()),
    ne(aiUsage.status, "failed")
  ));
  const remaining = Math.max(0, limit - count);
  return {
    ok: remaining > 0,
    reason: remaining > 0 ? undefined : "monthly AI quota exceeded",
    remaining,
    limit,
  };
}

export async function planForUserPlan(userId: string): Promise<string> {
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId));
  if (!subscription) return PLANS.free;
  const entitledStatus = ["active", "trialing", "past_due"].includes(subscription.status);
  if (entitledStatus && subscription.currentPeriodEnd.getTime() > Date.now()) return PLANS.pro;
  return PLANS.free;
}

async function sessionFromRequest() {
  const requestHeaders = await headers();
  return auth.api.getSession({ headers: requestHeaders });
}
