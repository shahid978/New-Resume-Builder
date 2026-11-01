import { env } from "@/lib/config/env";
import { PLANS } from "@/lib/config/constants";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { sql } from "drizzle-orm";
import Stripe from "stripe";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  typescript: true,
});

/** Create a checkout session for the authenticated user. */
export async function createCheckoutSession(userId: string, priceId: string) {
  const [sub] = await db.select().from(subscriptions).where(sql`user_id = ${userId}`);

  // If already an active subscription, don't re-create checkout (idempotent).
  if (sub?.status === "active" && sub.planKey === PLANS.pro) {
    return { url: `/app/account` };
  }

  const customerId = sub?.stripeCustomerId ?? (await createStripeCustomer(userId));

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    customer_update: { address: "auto" },
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${env.BETTER_AUTH_URL}/app/account?checkout=success`,
    cancel_url: `${env.BETTER_AUTH_URL}/pricing?checkout=canceled`,
    metadata: { userId },
  });

  if (sub?.stripeCustomerId) {
    // Customer already linked: record checkout association idempotently.
    await updateStripeCustomer(userId, customerId);
  }

  return { url: session.url! };
}

/** Return the customer-portal session URL for managing subscription. */
export async function createPortalSession(userId: string) {
  const [sub] = await db.select().from(subscriptions).where(sql`user_id = ${userId}`);
  if (!sub?.stripeCustomerId) throw new Error("No Stripe customer on file.");

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${env.BETTER_AUTH_URL}/app/account`,
  });
  return { url: session.url };
}

/** Cancel subscription (at period end). */
export async function cancelSubscription(userId: string) {
  const [sub] = await db.select().from(subscriptions).where(sql`user_id = ${userId}`);
  if (!sub?.stripeSubscriptionId) throw new Error("No active subscription.");

  await stripe.subscriptions.update(sub.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });
  await db
    .update(subscriptions)
    .set({ cancelAtPeriodEnd: true, updatedAt: new Date() })
    .where(sql`user_id = ${userId}`);
  return { ok: true };
}

/** Stripe customer idempotent lookup/create. */
async function createStripeCustomer(userId: string): Promise<string> {
  // Check existing customers for this user (email match).
  const customers = await stripe.customers.list({ email: userId, limit: 1 });
  if (customers.data.length > 0) {
    return customers.data[0].id;
  }
  const customer = await stripe.customers.create({ metadata: { userId } });
  return customer.id;
}

async function updateStripeCustomer(userId: string, customerId: string) {
  await db
    .update(subscriptions)
    .set({ stripeCustomerId: customerId, updatedAt: new Date() })
    .where(sql`user_id = ${userId}`);
}

/** Public: whether a user is on a paid active plan. */
export async function isPaid(userId: string): Promise<boolean> {
  const [sub] = await db.select().from(subscriptions).where(sql`user_id = ${userId}`);
  if (!sub) return false;
  if (sub.status === "active") return true;
  if (sub.cancelAtPeriodEnd && new Date() > sub.currentPeriodEnd) return false;
  return sub.status === "active";
}
