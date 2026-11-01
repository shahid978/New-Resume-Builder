/**
 * Product constants — plan limits, quotas, and caps.
 *
 * These are the source of truth for entitlement enforcement. They live in a
 * single module so the server-side service layer and the client-facing
 * messaging can never drift. Paid-plan pricing/quotas are launch blockers
 * tracked in plan.md; the values here are the agreed v1 defaults.
 */

export const PLANS = {
  free: "free",
  pro: "pro",
} as const;

export type PlanKey = (typeof PLANS)[keyof typeof PLANS];

/** Free tier: one resume, ever. */
export const FREE_RESUME_LIMIT = 1;

/** Free tier: 10 AI requests per month, shared between writing and matching. */
export const FREE_AI_REQUESTS_PER_MONTH = 10;

/** Paid tier: effectively unlimited resumes under a documented fair-use cap. */
export const PRO_RESUME_LIMIT = 50;

/** Paid tier: generous AI usage under a documented cap. */
export const PRO_AI_REQUESTS_PER_MONTH = 500;

/** Stripe plan keys mapped to product plans. */
export const STRIPE_PLAN_KEY: Record<string, PlanKey> = {
  [process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? ""]: PLANS.pro,
  [process.env.STRIPE_PRO_ANNUAL_PRICE_ID ?? ""]: PLANS.pro,
};

/** Text length bounds — protect provider costs, DB payloads, and PDF layout. */
export const LIMITS = {
  name: 120,
  email: 320,
  phone: 40,
  location: 120,
  summary: 2000,
  experienceCompany: 160,
  experienceRole: 160,
  experienceLocation: 120,
  experienceBullet: 600,
  experienceBulletsPerEntry: 12,
  experienceEntries: 12,
  educationSchool: 200,
  educationDegree: 200,
  educationField: 200,
  educationEntries: 10,
  skillName: 60,
  skillsPerResume: 60,
  website: 2048,
  linkedin: 2048,
  jobAdChars: 8000,
  aiInputChars: 12000,
} as const;

/** AI request idempotency TTL — retries within this window reuse the result. */
export const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000;

/** Default AI model; centralized so it can be changed in one place. */
export const OPENAI_MODEL = "gpt-4o-mini";

/** Month-key format for quota accounting: YYYY-MM (UTC). */
export function currentMonthKey(date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}