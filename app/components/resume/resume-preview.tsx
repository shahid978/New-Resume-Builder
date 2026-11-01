import { ResumeContent, ExperienceEntry, EducationEntry } from "@/lib/resume/schema";
import { escapeText, stripProtocol } from "@/lib/utils";
import { cn } from "@/lib/cn";

/**
 * Live preview of the single ATS-friendly template.
 *
 * This component mirrors the PDF renderer's visual rules (type scale,
 * spacing, section order, empty-field omission) so preview and export are
 * consistent. It is a Server Component: it only renders document-like content,
 * never editor controls or account metadata.
 */

interface Props {
  content: ResumeContent;
  className?: string;
}

export function ResumePreview({ content, className }: Props) {
  const contact = content.contact;
  const hasContact =
    contact.name || contact.email || contact.phone || contact.location;
  const contactLinks: Array<{ label: string; value: string }> = [];
  if (contact.phone) contactLinks.push({ label: "Phone", value: contact.phone });
  if (contact.location)
    contactLinks.push({ label: "Location", value: contact.location });
  if (contact.website)
    contactLinks.push({ label: "Website", value: stripProtocol(contact.website) });
  if (contact.linkedin)
    contactLinks.push({
      label: "LinkedIn",
      value: stripProtocol(contact.linkedin),
    });

  return (
    <article
      className={cn(
        "mx-auto w-full max-w-[760px] bg-white p-8 text-ink shadow-lg shadow-ink/10 sm:p-10",
        className
      )}
      aria-label="Resume preview"
    >
      {/* Header */}
      <header className="border-b border-line pb-5">
        <h1 className="text-3xl font-semibold tracking-tight">
          {escapeText(contact.name || "Your name")}
        </h1>
        {contact.email && (
          <a
            href={`mailto:${escapeText(contact.email)}`}
            className="mt-1 block text-[15px] text-accent-deep hover:underline"
          >
            {escapeText(contact.email)}
          </a>
        )}
        {contactLinks.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-ink-soft">
            {contactLinks.map((item, i) => (
              <span key={item.label} className="flex items-center gap-3">
                <span>
                  <span className="font-medium text-ink">{item.label}:</span>{" "}
                  {item.label === "Website" || item.label === "LinkedIn" ? (
                    <a
                      href={contact[item.label.toLowerCase() as "website" | "linkedin"]!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-deep hover:underline"
                    >
                      {escapeText(item.value)}
                    </a>
                  ) : (
                    escapeText(item.value)
                  )}
                </span>
                {i < contactLinks.length - 1 && (
                  <span aria-hidden="true" className="text-line">
                    |
                  </span>
                )}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Summary */}
      {content.summary && (
        <Section heading="Summary">
          <p className="text-[15px] leading-7 text-ink-soft">
            {escapeText(content.summary)}
          </p>
        </Section>
      )}

      {/* Experience */}
      {content.experience.length > 0 && (
        <Section heading="Experience">
          {content.experience.map((entry) => (
            <Experience key={entry.id} entry={entry} />
          ))}
        </Section>
      )}

      {/* Education */}
      {content.education.length > 0 && (
        <Section heading="Education">
          {content.education.map((entry) => (
            <Education key={entry.id} entry={entry} />
          ))}
        </Section>
      )}

      {/* Skills */}
      {content.skills.length > 0 && (
        <Section heading="Skills">
          <p className="text-[15px] leading-7 text-ink-soft">
            {content.skills.map(escapeText).join(" · ")}
          </p>
        </Section>
      )}

      {!hasContact && !content.summary && content.experience.length === 0 && (
        <p className="py-10 text-center text-ink-faint">
          Your resume will appear here as you fill in the form.
        </p>
      )}
    </article>
  );
}

function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-7 first:mt-0">
      <h2 className="border-b border-line pb-2 text-sm font-semibold uppercase tracking-wider text-accent-deep">
        {heading}
      </h2>
      <div className="mt-4 flex flex-col gap-5">{children}</div>
    </section>
  );
}

function Experience({ entry }: { entry: ExperienceEntry }) {
  const range = formatRange(entry.startDate, entry.endDate, entry.present);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-[17px] font-semibold text-ink">
          {escapeText(entry.role)}
        </h3>
        {range && (
          <span className="shrink-0 text-[13px] font-medium text-ink-faint">
            {range}
          </span>
        )}
      </div>
      <p className="text-[15px] text-ink-soft">
        {escapeText(entry.company)}
        {entry.location ? `, ${escapeText(entry.location)}` : ""}
      </p>
      {entry.bullets.length > 0 && (
        <ul className="mt-2 list-outside list-disc pl-5 flex flex-col gap-1.5">
          {entry.bullets.map((bullet, i) => (
            <li key={i} className="text-[15px] leading-7 text-ink-soft">
              {escapeText(bullet)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Education({ entry }: { entry: EducationEntry }) {
  const range = formatRange(entry.startDate, entry.endDate, false);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-[17px] font-semibold text-ink">
          {escapeText(entry.degree)}
          {entry.field ? ` in ${escapeText(entry.field)}` : ""}
        </h3>
        {range && (
          <span className="shrink-0 text-[13px] font-medium text-ink-faint">
            {range}
          </span>
        )}
      </div>
      <p className="text-[15px] text-ink-soft">{escapeText(entry.school)}</p>
    </div>
  );
}

function formatRange(
  start: string,
  end: string | null,
  present: boolean
): string {
  if (!start) return "";
  const endLabel = present ? "Present" : end || "";
  return endLabel ? `${start} – ${endLabel}` : start;
}

