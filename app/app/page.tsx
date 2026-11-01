import Link from "next/link";
import { requireVerifiedUser } from "@/lib/auth-server";
import { listResumesForUser } from "@/lib/services/resume";
import { canCreateResume } from "@/lib/services/entitlement";
import { createResumeAction } from "./actions";
import { SignOutButton } from "@/app/components/auth/sign-out-button";

export default async function DashboardPage() {
  const session = await requireVerifiedUser();
  const [resumes, allowance] = await Promise.all([
    listResumesForUser(),
    canCreateResume(),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/" className="text-sm font-semibold text-accent-deep">Ascent</Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Your resumes</h1>
          <p className="mt-2 text-ink-soft">Welcome back, {session.user.name || session.user.email}.</p>
        </div>
        <div className="flex items-center gap-3">
          {allowance.ok ? (
            <form action={createResumeAction}>
              <button className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-ink/90">Create a resume</button>
            </form>
          ) : (
            <p className="rounded-xl bg-accent-soft px-4 py-3 text-sm text-accent-deep" role="status">
              You’ve reached the {allowance.limit}-resume limit on your {allowance.plan} plan.
            </p>
          )}
          <SignOutButton />
        </div>
      </header>

      {resumes.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-line bg-white px-6 py-16 text-center">
          <h2 className="text-xl font-semibold">Start with a blank resume</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-soft">Add your experience, education, and skills. Your work saves as you go.</p>
          {allowance.ok && <form action={createResumeAction} className="mt-6"><button className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white">Create your first resume</button></form>}
        </section>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <li key={resume.id}>
              <Link href={`/app/resumes/${resume.id}`} className="block rounded-2xl border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-md">
                <h2 className="font-semibold">{resume.title}</h2>
                <p className="mt-2 text-sm text-ink-soft">Updated {resume.updatedAt.toLocaleDateString()}</p>
                <span className="mt-6 inline-block text-sm font-medium text-accent-deep">Continue editing →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
