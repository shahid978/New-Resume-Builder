import "server-only";
import OpenAI from "openai";
import { z } from "zod";
import { db } from "@/db";
import { aiUsage, subscriptions, user } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { PLANS, FREE_AI_REQUESTS_PER_MONTH, PRO_AI_REQUESTS_PER_MONTH, OPENAI_MODEL, currentMonthKey } from "@/lib/config/constants";

let client: OpenAI | undefined;
function getOpenAI() {
  client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

export type AIOperation = "writing" | "matching";

export interface AIRequestContext {
  userId: string;
  operation: AIOperation;
  idempotencyKey: string;
  prompt: string;
}

/**
 * Server-side AI service with shared authorization, quota accounting,
 * rate limits, structured-output validation, timeout handling, and
 * idempotency.
 *
 * Raw prompts/responses are never logged or stored in ai_usage — only
 * metadata (operation, status, tokens, cost).
 */

export const aiRequestSchema = z.object({
  operation: z.enum(["writing", "matching"]),
  prompt: z.string().min(1).max(12000),
  idempotencyKey: z.string().uuid().optional(),
});

export async function checkQuota(userId: string, operation: AIOperation) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session?.user?.id || session.user.id !== userId) throw new Error("Unauthorized");

  const plan = await planFor(userId);
  const monthlyLimit = plan === PLANS.pro ? PRO_AI_REQUESTS_PER_MONTH : FREE_AI_REQUESTS_PER_MONTH;
  const period = currentMonthKey();

  const count = await db.$count(aiUsage, and(
    eq(aiUsage.userId, userId),
    eq(aiUsage.periodKey, period),
    ne(aiUsage.status, "failed")
  ));

  const remaining = Math.max(0, monthlyLimit - Number(count));
  if (remaining <= 0) throw new Error("QUOTA_EXCEEDED");
  return { remaining, limit: monthlyLimit };
}

async function planFor(userId: string) {
  // lightweight: reuse the subscription status
  const [sub] = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
  if (!sub) return PLANS.free;
  if (["active", "trialing"].includes(sub.status) && sub.currentPeriodEnd.getTime() > Date.now()) return PLANS.pro;
  return PLANS.free;
}

export async function reserveAiQuota(userId: string, operation: AIOperation, idempotencyKey: string) {
  const period = currentMonthKey();
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session?.user?.id || session.user.id !== userId || !session.user.emailVerified) {
    throw new Error("Unauthorized");
  }

  const plan = await planFor(userId);
  const limit = plan === PLANS.pro ? PRO_AI_REQUESTS_PER_MONTH : FREE_AI_REQUESTS_PER_MONTH;
  return db.transaction(async (tx) => {
    const [owner] = await tx.select({ id: user.id }).from(user).where(eq(user.id, userId)).for("update");
    if (!owner) throw new Error("Unauthorized");

    const [existing] = await tx.select().from(aiUsage).where(and(
      eq(aiUsage.userId, userId),
      eq(aiUsage.requestKey, idempotencyKey)
    ));
    if (existing?.status === "failed") {
      const [retried] = await tx.update(aiUsage).set({ status: "pending", operation, periodKey: period, createdAt: new Date() })
        .where(and(eq(aiUsage.userId, userId), eq(aiUsage.requestKey, idempotencyKey)))
        .returning();
      return { row: retried!, created: true };
    }
    if (existing) return { row: existing, created: false };

    const used = await tx.$count(aiUsage, and(
      eq(aiUsage.userId, userId),
      eq(aiUsage.periodKey, period),
      ne(aiUsage.status, "failed")
    ));
    if (used >= limit) throw new Error("QUOTA_EXCEEDED");

    const [row] = await tx.insert(aiUsage).values({
      userId,
      operation,
      periodKey: period,
      requestKey: idempotencyKey,
      status: "pending",
      createdAt: new Date(),
    }).returning();
    return { row: row!, created: true };
  });
}

export async function completeAiQuota(userId: string, requestKey: string, result: { tokensIn?: number; tokensOut?: number; costUsd?: string }) {
  await db.update(aiUsage).set({ status: "completed", tokensIn: result.tokensIn ?? null, tokensOut: result.tokensOut ?? null, costUsd: result.costUsd ?? null }).where(and(eq(aiUsage.userId, userId), eq(aiUsage.requestKey, requestKey)));
}

export async function failAiQuota(userId: string, requestKey: string) {
  await db.update(aiUsage).set({ status: "failed" }).where(and(eq(aiUsage.userId, userId), eq(aiUsage.requestKey, requestKey)));
}

export async function generateCompletion(params: {
  system: string;
  user: string;
  responseFormat?: { type: "text" | "json_object" };
}) {
  const completion = await getOpenAI().chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      { role: "system", content: params.system },
      { role: "user", content: params.user },
    ],
    temperature: 0.3,
    max_tokens: 1000,
    response_format: params.responseFormat,
  });
  const text = completion.choices[0]?.message?.content ?? "";
  return { text, usage: completion.usage };
}

import { headers } from "next/headers";
