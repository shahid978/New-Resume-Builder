import "server-only";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

/** Return the authenticated session + user, or null if unauthenticated. */
export async function getSession() {
  const requestHeaders = await headers();
  return auth.api.getSession({ headers: requestHeaders });
}

/** Return the current user row, or null. */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.user?.id) return null;
  const [row] = await db.select().from(user).where(eq(user.id, session.user.id));
  return row ?? null;
}

/** Require authentication; redirect to sign-in on failure. */
export async function requireAuth() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  return session;
}

/** Require an authenticated, email-verified user; redirect otherwise. */
export async function requireVerifiedUser() {
  const session = await getSession();
  if (!session?.user?.id || !session.user.emailVerified) {
    redirect("/verify-email");
  }
  return session;
}

