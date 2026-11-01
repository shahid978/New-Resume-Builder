import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "@/lib/config/env";
import { db } from "@/db";

/**
 * Better Auth instance (server-only).
 *
 * Configured with Neon/Postgres via Drizzle adapter, email/password, Google
 * OAuth, email verification, and password reset. Secrets never reach the
 * client — this module is imported only from Route Handlers and Server
 * Actions.
 */

function createAuth() {
  return betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await import("@/lib/services/email").then(({ sendResetPasswordEmail }) =>
        sendResetPasswordEmail({ email: user.email, url, name: user.name })
      );
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await import("@/lib/services/email").then(({ sendVerificationEmail }) =>
        sendVerificationEmail({ email: user.email, url, name: user.name })
      );
    },
    expiresIn: 60 * 60 * 24, // 24 hours
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // refresh cookie once per day
  },
  // Prevent enumeration-style session reuse across deployments.
  advanced: {
    crossSubDomainCookies: { enabled: false },
  },
  });
}

type AuthInstance = ReturnType<typeof createAuth>;
let instance: AuthInstance | undefined;
function getAuth() {
  instance ??= createAuth();
  return instance;
}

// Resolve secrets and the database adapter only when a request uses auth.
export const auth = new Proxy({} as AuthInstance, {
  get(_target, property) {
    const current = getAuth();
    const value = Reflect.get(current, property, current);
    return typeof value === "function" ? value.bind(current) : value;
  },
});
