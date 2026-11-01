import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  jsonb,
  boolean,
  index,
  unique,
} from "drizzle-orm/pg-core";
import type { ResumeContent } from "@/lib/resume/schema";

/**
 * Application schema (Neon Postgres).
 *
 * All user content is scoped to the authenticated owner via `userId`, which
 * references Better Auth's `user` table (owned by Better Auth's Drizzle
 * adapter — not redefined here). Foreign-key and unique constraints are
 * applied in the raw SQL migrations so there is no divergence between the
 * Drizzle shape and the live schema.
 */

export const resumes = pgTable(
  "resumes",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull().default("Untitled resume"),
    templateKey: text("template_key").notNull().default("ats-classic"),
    content: jsonb("content").$type<ResumeContent>().notNull(),
    schemaVersion: integer("schema_version").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdIdx: index("resumes_user_id_idx").on(table.userId),
    updatedAtIdx: index("resumes_updated_at_idx").on(table.updatedAt),
  })
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    planKey: text("plan_key").notNull(),
    stripeCustomerId: text("stripe_customer_id").notNull(),
    stripeSubscriptionId: text("stripe_subscription_id").notNull(),
    status: text("status").notNull(),
    currentPeriodStart: timestamp("current_period_start", {
      withTimezone: true,
    }).notNull(),
    currentPeriodEnd: timestamp("current_period_end", {
      withTimezone: true,
    }).notNull(),
    cancelAtPeriodEnd: boolean("cancel_at_period_end")
      .notNull()
      .default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdUnique: unique("subscriptions_user_id_key").on(table.userId),
    stripeSubUnique: unique("subscriptions_stripe_subscription_id_key").on(
      table.stripeSubscriptionId
    ),
    userIdIdx: index("subscriptions_user_id_idx").on(table.userId),
  })
);

export const aiUsage = pgTable(
  "ai_usage",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    operation: text("operation").notNull(),
    periodKey: text("period_key").notNull(),
    requestKey: text("request_key").notNull(),
    status: text("status").notNull(),
    tokensIn: integer("tokens_in"),
    tokensOut: integer("tokens_out"),
    costUsd: text("cost_usd"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    requestUnique: unique("ai_usage_request_key_idx").on(
      table.userId,
      table.requestKey
    ),
    userPeriodIdx: index("ai_usage_user_period_idx").on(
      table.userId,
      table.periodKey
    ),
  })
);

/**
 * Better Auth tables (Neon Postgres).
 *
 * Defined alongside application tables so the drizzle adapter can resolve the
 * `user`, `session`, `account` and `verification` models it needs. Column
 * names match Better Auth's canonical drizzle schema. `id` columns use
 * `text` because Better Auth generates its own opaque identifiers.
 */

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("emailVerified").notNull().default(false),
    name: text("name").notNull(),
    image: text("image"),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updatedAt", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    emailIdx: index("user_email_idx").on(table.email),
  })
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId").notNull(),
  },
  (table) => ({
    userIdIdx: index("session_user_id_idx").on(table.userId),
    tokenIdx: index("session_token_idx").on(table.token),
  })
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId").notNull(),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", {
      withTimezone: true,
    }),
    idToken: text("idToken"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull(),
  },
  (table) => ({
    userIdIdx: index("account_user_id_idx").on(table.userId),
  })
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
  },
  (table) => ({
    identifierIdx: index("verification_identifier_idx").on(table.identifier),
  })
);
