import "server-only";
import { eq, and, sql } from "drizzle-orm";
import { db } from "@/db";
import { resumes, user } from "@/db/schema";
import { ResumeContent, resumeContentSchema } from "@/lib/resume/schema";
import { FREE_RESUME_LIMIT, PRO_RESUME_LIMIT } from "@/lib/config/constants";
import { auth } from "@/lib/auth";
import { planForUserPlan } from "@/lib/services/entitlement";
import { headers } from "next/headers";

/**
 * Resume service layer.
 *
 * Every mutation reads the authenticated user from the session and enforces
 * ownership + plan limits in a transaction. This is the only place that
 * touches the resumes table, so business rules are shared by Server Actions
 * and Route Handlers and cannot be bypassed by the UI.
 */

export interface ResumeRow {
  id: number;
  userId: string;
  title: string;
  templateKey: string;
  content: ResumeContent;
  schemaVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function listResumesForUser(): Promise<ResumeRow[]> {
  const session = await sessionFromRequest();
  if (!session?.user?.id || !session.user.emailVerified) return [];
  return db
    .select()
    .from(resumes)
    .where(eq(resumes.userId, session.user.id))
    .orderBy(sql`${resumes.updatedAt} DESC`);
}

export async function getResume(id: number): Promise<ResumeRow | null> {
  const session = await sessionFromRequest();
  if (!session?.user?.id || !session.user.emailVerified) return null;
  const [row] = await db
    .select()
    .from(resumes)
    .where(and(eq(resumes.id, id), eq(resumes.userId, session.user.id)));
  return row ?? null;
}

export async function createResume(
  input: { title?: string; content?: Partial<ResumeContent> }
): Promise<ResumeRow> {
  const session = await sessionFromRequest();
  if (!session?.user?.id || !session.user.emailVerified) throw new Error("Unauthorized");

  const plan = await planForUserPlan(session.user.id);
  const limit = plan === "pro" ? PRO_RESUME_LIMIT : FREE_RESUME_LIMIT;

  const content = resumeContentSchema.parse({
    version: 1,
    template: "ats-classic",
    contact: input.content?.contact ?? {
      name: "",
      email: "",
      phone: null,
      location: null,
      website: null,
      linkedin: null,
    },
    summary: input.content?.summary ?? null,
    experience: input.content?.experience ?? [],
    education: input.content?.education ?? [],
    skills: input.content?.skills ?? [],
  });

  return db.transaction(async (tx) => {
    // Serialize create attempts per account before checking its plan cap.
    const [owner] = await tx
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, session.user.id))
      .for("update");
    if (!owner) throw new Error("Unauthorized");

    const count = await tx.$count(resumes, eq(resumes.userId, session.user.id));
    if (count >= limit) {
      throw new Error(limit === FREE_RESUME_LIMIT
        ? "Free plan allows one resume. Upgrade to Pro for more."
        : "Resume limit reached. Upgrade your plan for more.");
    }

    const [row] = await tx.insert(resumes).values({
      userId: session.user.id,
      title: input.title?.trim().slice(0, 120) || "Untitled resume",
      templateKey: "ats-classic",
      content,
      schemaVersion: 1,
    }).returning();
    return row!;
  });
}

export async function updateResume(
  id: number,
  input: {
    title?: string;
    content?: Partial<ResumeContent>;
    expectedUpdatedAt?: string | null;
  }
): Promise<ResumeRow> {
  const session = await sessionFromRequest();
  if (!session?.user?.id || !session.user.emailVerified) throw new Error("Unauthorized");

  const [existing] = await db
    .select()
    .from(resumes)
    .where(and(eq(resumes.id, id), eq(resumes.userId, session.user.id)));
  if (!existing) throw new Error("Not found");

  // Stale-update guard: if the client's snapshot is older than the server's,
  // refuse to clobber a concurrent edit and ask the client to reload.
  if (
    input.expectedUpdatedAt &&
    new Date(input.expectedUpdatedAt).getTime() !==
      new Date(existing.updatedAt).getTime()
  ) {
    throw new Error("STALE");
  }

  const merged: ResumeContent = resumeContentSchema.parse({
    ...existing.content,
    ...input.content,
    contact: { ...existing.content.contact, ...(input.content?.contact ?? {}) },
    experience: input.content?.experience ?? existing.content.experience,
    education: input.content?.education ?? existing.content.education,
    skills: input.content?.skills ?? existing.content.skills,
  });

  const [row] = await db
    .update(resumes)
    .set({
      title: input.title?.trim() ?? existing.title,
      content: merged,
      updatedAt: new Date(),
    })
    .where(and(
      eq(resumes.id, id),
      eq(resumes.userId, session.user.id),
      eq(resumes.updatedAt, existing.updatedAt)
    ))
    .returning();
  if (!row) throw new Error("STALE");
  return row;
}

export async function deleteResume(id: number): Promise<void> {
  const session = await sessionFromRequest();
  if (!session?.user?.id || !session.user.emailVerified) throw new Error("Unauthorized");

  const [existing] = await db
    .select({ id: resumes.id })
    .from(resumes)
    .where(and(eq(resumes.id, id), eq(resumes.userId, session.user.id)));
  if (!existing) throw new Error("Not found");

  await db.delete(resumes).where(and(eq(resumes.id, id), eq(resumes.userId, session.user.id)));
}

async function sessionFromRequest() {
  const requestHeaders = await headers();
  return auth.api.getSession({ headers: requestHeaders });
}
