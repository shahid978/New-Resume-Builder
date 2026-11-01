import { z } from "zod";

/**
 * Server-only environment variable validation.
 * Importing this module on the client is a no-op for secrets: every field
 * here is server-only by design (no NEXT_PUBLIC_ prefix), so the values
 * never reach client bundles. The schema throws at first access, which
 * surfaces a missing config as a build/runtime error rather than a silent
 * undefined later.
 */

const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a connection URL"),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z.string().url("BETTER_AUTH_URL must be a URL"),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY is required"),
  STRIPE_WEBHOOK_SECRET: z
    .string()
    .min(1, "STRIPE_WEBHOOK_SECRET is required"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required"),
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  EMAIL_FROM: z.string().min(1, "EMAIL_FROM is required"),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url("NEXT_PUBLIC_SITE_URL must be a URL"),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function getEnv(): Env {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const formatted = parsed.error.flatten().fieldErrors;
    const message = Object.entries(formatted)
      .map(([k, v]) => `  ${k}: ${v.join("; ")}`)
      .join("\n");
    throw new Error(
      `Invalid environment variables:\n${message}\nCheck your .env file against .env.example.`
    );
  }
  cached = parsed.data;
  return cached;
}

/** Resolve and validate secrets only when server code actually reads one. */
export const env = new Proxy({} as Env, {
  get(_target, property: string) {
    return getEnv()[property as keyof Env];
  },
});

/** Public env vars safe to expose to client bundles. */
export const publicEnv = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Ascent",
  stripePublishableKey:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
};
