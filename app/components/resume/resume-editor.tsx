"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ResumeContent, emptyResumeContent } from "@/lib/resume/schema";
import { generateSummarySuggestion, matchJobDescription, saveResumeAction } from "@/app/app/actions";
import { ResumePreview } from "./resume-preview";

type SaveState = "saved" | "saving" | "error";

export function ResumeEditor({
  id,
  initialTitle,
  initialContent,
  initialUpdatedAt,
}: {
  id: number;
  initialTitle: string;
  initialContent: ResumeContent;
  initialUpdatedAt: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState<ResumeContent>(() =>
    emptyResumeContent(initialContent)
  );
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [error, setError] = useState("");
  const [aiError, setAiError] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [matchBusy, setMatchBusy] = useState(false);
  const [matchError, setMatchError] = useState("");
  const [matchResult, setMatchResult] = useState<{
    matchingKeywords: Array<{ keyword: string; evidence: string }>;
    potentialGaps: string[];
  } | null>(null);
  const updatedAt = useRef(initialUpdatedAt);
  const dirty = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saving = useRef(false);
  const latest = useRef({ title, content });
  latest.current = { title, content };

  const save = useCallback(async () => {
    if (!dirty.current || saving.current) return;
    saving.current = true;
    dirty.current = false;
    setSaveState("saving");
    setError("");
    const snapshot = latest.current;
    const result = await saveResumeAction(id, snapshot.title, snapshot.content, updatedAt.current);
    saving.current = false;
    if (!result.ok) {
      dirty.current = true;
      setSaveState("error");
      setError(result.error);
      return;
    }
    updatedAt.current = result.updatedAt;
    if (dirty.current) {
      void save();
      return;
    }
    setSaveState("saved");
    router.refresh();
  }, [id, router]);

  useEffect(() => {
    if (!dirty.current) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void save(), 800);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [title, content, save]);

  function changeContent(next: ResumeContent) {
    dirty.current = true;
    setContent(next);
  }

  function changeTitle(next: string) {
    dirty.current = true;
    setTitle(next);
    latest.current = { title: next, content };
  }

  const contact = content.contact;
  return (
    <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <a href="/app" className="text-sm font-medium text-accent-deep">← All resumes</a>
          <div className="mt-2 flex items-center gap-3">
            <input aria-label="Resume title" className="max-w-md border-b border-line bg-transparent py-1 text-xl font-semibold outline-none focus:border-accent" value={title} onChange={(event) => changeTitle(event.target.value)} />
            <span className="text-xs text-ink-faint" role="status" aria-live="polite">
              {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : "Save failed"}
            </span>
          </div>
        </div>
        {saveState === "error" && <button className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium" onClick={() => void save()}>Retry save</button>}
      </header>
      {error && <p role="alert" className="mb-4 rounded-xl bg-accent-soft p-3 text-sm text-accent-deep">{error}</p>}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(380px,0.9fr)_minmax(500px,1.1fr)]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold">Contact details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" value={contact.name} onChange={(name) => changeContent({ ...content, contact: { ...contact, name } })} />
              <Field label="Email" type="email" value={contact.email} onChange={(email) => changeContent({ ...content, contact: { ...contact, email } })} />
              <Field label="Phone" value={contact.phone ?? ""} onChange={(phone) => changeContent({ ...content, contact: { ...contact, phone: phone || null } })} />
              <Field label="Location" value={contact.location ?? ""} onChange={(location) => changeContent({ ...content, contact: { ...contact, location: location || null } })} />
              <Field label="Website" value={contact.website ?? ""} onChange={(website) => changeContent({ ...content, contact: { ...contact, website: website || null } })} />
              <Field label="LinkedIn" value={contact.linkedin ?? ""} onChange={(linkedin) => changeContent({ ...content, contact: { ...contact, linkedin: linkedin || null } })} />
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold">Professional summary</h2><button type="button" disabled={aiBusy} className="rounded-full border border-line px-3.5 py-2 text-xs font-semibold text-accent-deep hover:bg-parchment disabled:opacity-50" onClick={async () => { setAiBusy(true); setAiError(""); setSuggestion(""); const result = await generateSummarySuggestion(id, crypto.randomUUID()); if (result.ok) setSuggestion(result.suggestion); else setAiError(result.error); setAiBusy(false); }}>{aiBusy ? "Drafting…" : "Suggest with AI"}</button></div>
            <textarea aria-label="Professional summary" value={content.summary ?? ""} maxLength={2000} rows={5} placeholder="A short overview of your experience and strengths" className="w-full rounded-xl border border-line px-4 py-3 text-sm leading-6 outline-none focus:border-accent" onChange={(event) => changeContent({ ...content, summary: event.target.value || null })} />
            <p className="mt-1 text-right text-xs text-ink-faint">{(content.summary ?? "").length}/2000</p>
            {aiError && <p role="alert" className="mt-3 rounded-xl bg-accent-soft p-3 text-sm text-accent-deep">{aiError}</p>}
            {suggestion && <div className="mt-4 rounded-xl border border-accent/20 bg-accent-soft/40 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-accent-deep">Suggestion — review before applying</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6">{suggestion}</p><div className="mt-3 flex gap-2"><button type="button" className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white" onClick={() => { changeContent({ ...content, summary: suggestion }); setSuggestion(""); }}>Apply suggestion</button><button type="button" className="rounded-full px-4 py-2 text-xs font-semibold text-ink-soft hover:bg-parchment" onClick={() => setSuggestion("")}>Discard</button></div></div>}
          </section>

          <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Experience</h2><button className="text-sm font-semibold text-accent-deep" onClick={() => changeContent({ ...content, experience: [...content.experience, { id: crypto.randomUUID(), company: "", role: "", location: null, startDate: "", endDate: null, present: false, bullets: [] }] })}>+ Add role</button></div>
            {content.experience.length === 0 && <p className="text-sm text-ink-faint">Add your most recent role first.</p>}
            <div className="space-y-5">{content.experience.map((entry, index) => <div key={entry.id} className="space-y-3 border-t border-line pt-4 first:border-0 first:pt-0">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Job title" value={entry.role} onChange={(role) => updateExperience(index, { role })} />
                <Field label="Company" value={entry.company} onChange={(company) => updateExperience(index, { company })} />
                <Field label="Location" value={entry.location ?? ""} onChange={(location) => updateExperience(index, { location: location || null })} />
                <Field label="Dates (e.g. Jan 2022 – May 2024)" value={[entry.startDate, entry.present ? "Present" : entry.endDate].filter(Boolean).join(" – ")} onChange={(dates) => { const [startDate = "", end = ""] = dates.split("–").map((part) => part.trim()); updateExperience(index, { startDate, endDate: end && end !== "Present" ? end : null, present: end === "Present" }); }} />
              </div>
              <textarea aria-label="Experience bullets, one per line" rows={3} placeholder="Impact and accomplishments, one per line" className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-accent" value={entry.bullets.join("\n")} onChange={(event) => updateExperience(index, { bullets: event.target.value.split("\n").map((line) => line.trim()).filter(Boolean) })} />
              <button className="text-xs text-accent-deep" onClick={() => changeContent({ ...content, experience: content.experience.filter((_, i) => i !== index) })}>Remove role</button>
            </div>)}</div>
          </section>

          <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Education</h2><button className="text-sm font-semibold text-accent-deep" onClick={() => changeContent({ ...content, education: [...content.education, { id: crypto.randomUUID(), school: "", degree: "", field: null, startDate: "", endDate: null }] })}>+ Add education</button></div>
            {content.education.map((entry, index) => <div key={entry.id} className="mb-4 grid gap-3 border-t border-line pt-4 sm:grid-cols-2">
              <Field label="School" value={entry.school} onChange={(school) => updateEducation(index, { school })} />
              <Field label="Degree" value={entry.degree} onChange={(degree) => updateEducation(index, { degree })} />
              <Field label="Field of study" value={entry.field ?? ""} onChange={(field) => updateEducation(index, { field: field || null })} />
              <Field label="Dates" value={[entry.startDate, entry.endDate].filter(Boolean).join(" – ")} onChange={(dates) => { const [startDate = "", end = ""] = dates.split("–").map((part) => part.trim()); updateEducation(index, { startDate, endDate: end || null }); }} />
              <button className="text-left text-xs text-accent-deep" onClick={() => changeContent({ ...content, education: content.education.filter((_, i) => i !== index) })}>Remove education</button>
            </div>)}
          </section>

          <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold">Skills</h2>
            <textarea aria-label="Skills" rows={3} placeholder="Add skills separated by commas" className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-accent" value={content.skills.join(", ")} onChange={(event) => changeContent({ ...content, skills: event.target.value.split(",").map((skill) => skill.trim()).filter(Boolean) })} />
          </section>

          <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <h2 className="text-lg font-semibold">Match a job description</h2>
            <p className="mt-1 text-sm leading-6 text-ink-soft">See supported keywords and possible gaps. The pasted description is used for this request only and isn’t saved.</p>
            <textarea aria-label="Job description" maxLength={8000} rows={7} placeholder="Paste the job description here" className="mt-4 w-full rounded-xl border border-line px-4 py-3 text-sm leading-6 outline-none focus:border-accent" value={jobDescription} onChange={(event) => { setJobDescription(event.target.value); setMatchResult(null); }} />
            <div className="mt-2 flex items-center justify-between gap-3"><span className="text-xs text-ink-faint">{jobDescription.length}/8000</span><button type="button" disabled={matchBusy || jobDescription.trim().length < 40} className="rounded-full bg-ink px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-50" onClick={async () => { setMatchBusy(true); setMatchError(""); const response = await matchJobDescription(id, crypto.randomUUID(), jobDescription); if (response.ok) setMatchResult(response.result); else setMatchError(response.error); setMatchBusy(false); }}>{matchBusy ? "Matching…" : "Find relevant keywords"}</button></div>
            {matchError && <p role="alert" className="mt-3 rounded-xl bg-accent-soft p-3 text-sm text-accent-deep">{matchError}</p>}
            {matchResult && <div className="mt-5 space-y-4" aria-live="polite">
              <div><h3 className="text-sm font-semibold">Keywords supported by your resume</h3>{matchResult.matchingKeywords.length ? <ul className="mt-2 space-y-2">{matchResult.matchingKeywords.map((item) => <li key={item.keyword} className="rounded-xl bg-parchment p-3"><p className="text-sm font-medium">{item.keyword}</p><p className="mt-1 text-xs leading-5 text-ink-soft">Resume evidence: {item.evidence}</p></li>)}</ul> : <p className="mt-2 text-sm text-ink-soft">No clear matches found in the current resume.</p>}</div>
              <div><h3 className="text-sm font-semibold">Requirements not supported yet</h3>{matchResult.potentialGaps.length ? <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">{matchResult.potentialGaps.map((gap) => <li key={gap}>{gap}</li>)}</ul> : <p className="mt-2 text-sm text-ink-soft">No obvious gaps identified.</p>}</div>
              <p className="text-xs leading-5 text-ink-faint">Only add a keyword if it accurately reflects your experience.</p>
            </div>}
          </section>
        </div>
        <aside className="min-w-0 xl:sticky xl:top-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-faint">Live preview</p>
          <ResumePreview content={content} className="min-h-[600px] rounded-sm" />
        </aside>
      </div>
    </main>
  );

  function updateExperience(index: number, patch: Partial<ResumeContent["experience"][number]>) {
    changeContent({ ...content, experience: content.experience.map((entry, i) => i === index ? { ...entry, ...patch } : entry) });
  }
  function updateEducation(index: number, patch: Partial<ResumeContent["education"][number]>) {
    changeContent({ ...content, education: content.education.map((entry, i) => i === index ? { ...entry, ...patch } : entry) });
  }
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="flex flex-col gap-1.5 text-sm font-medium">{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm font-normal outline-none focus:border-accent" /></label>;
}
