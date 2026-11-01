import { notFound } from "next/navigation";
import { requireVerifiedUser } from "@/lib/auth-server";
import { getResume } from "@/lib/services/resume";
import { ResumeEditor } from "@/app/components/resume/resume-editor";

export default async function ResumePage({ params }: { params: Promise<{ resumeId: string }> }) {
  await requireVerifiedUser();
  const { resumeId } = await params;
  const id = Number(resumeId);
  if (!Number.isSafeInteger(id) || id < 1) notFound();
  const resume = await getResume(id);
  if (!resume) notFound();

  return <ResumeEditor id={resume.id} initialTitle={resume.title} initialContent={resume.content} initialUpdatedAt={resume.updatedAt.toISOString()} />;
}
