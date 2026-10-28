import Link from "next/link";

const features = [
  {
    title: "AI writing assistance",
    body: "Generate a strong summary or rewrite experience bullets into clear, quantified statements. Every suggestion is a draft you review and apply — nothing changes your resume without your approval.",
    art: (
      <g>
        <rect x="6" y="14" width="26" height="36" rx="4" fill="var(--color-parchment)" stroke="var(--color-ink-soft)" strokeWidth="1.5" />
        <rect x="11" y="21" width="16" height="2.5" rx="1.25" fill="var(--color-ink-faint)" />
        <rect x="11" y="27" width="12" height="2.5" rx="1.25" fill="var(--color-ink-faint)" />
        <rect x="11" y="33" width="15" height="2.5" rx="1.25" fill="var(--color-ink-faint)" />
        <path d="M34 32 42 40l-2.2 2.2L32 34.2l.6-2.8 1.4-.4Z" fill="var(--color-accent)" stroke="var(--color-accent-deep)" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M40 26c1.5-2.5 5-2.5 6 0 1-2.5 4.5-2.5 6 0" stroke="var(--color-ink-faint)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </g>
    ),
  },
  {
    title: "Job-description matching",
    body: "Paste a job ad and get a short list of relevant keywords to consider — with clear guidance to use only skills and experience you genuinely have.",
    art: (
      <g>
        <rect x="7" y="10" width="30" height="42" rx="4" fill="var(--color-parchment)" stroke="var(--color-ink-soft)" strokeWidth="1.5" />
        <rect x="13" y="18" width="18" height="2.5" rx="1.25" fill="var(--color-ink-faint)" />
        <rect x="13" y="24" width="14" height="2.5" rx="1.25" fill="var(--color-ink-faint)" />
        <rect x="13" y="31" width="9" height="5" rx="2.5" fill="var(--color-accent-soft)" stroke="var(--color-accent)" strokeWidth="1.2" />
        <rect x="24" y="31" width="9" height="5" rx="2.5" fill="var(--color-accent-soft)" stroke="var(--color-accent)" strokeWidth="1.2" />
        <rect x="13" y="39" width="11" height="5" rx="2.5" fill="var(--color-cream)" stroke="var(--color-ink-faint)" strokeWidth="1.2" />
      </g>
    ),
  },
  {
    title: "Live preview & autosave",
    body: "See your formatted resume update as you type, with visible saving/saved state. Your progress is kept automatically, so you can return anytime.",
    art: (
      <g>
        <rect x="8" y="12" width="40" height="30" rx="4" fill="var(--color-cream)" stroke="var(--color-ink-soft)" strokeWidth="1.5" />
        <path d="M8 20h40" stroke="var(--color-ink-faint)" strokeWidth="1.2" />
        <circle cx="13" cy="16" r="1.5" fill="var(--color-ink-faint)" />
        <circle cx="18" cy="16" r="1.5" fill="var(--color-ink-faint)" />
        <rect x="13" y="24" width="14" height="2.5" rx="1.25" fill="var(--color-ink-faint)" />
        <rect x="13" y="30" width="18" height="2.5" rx="1.25" fill="var(--color-ink-faint)" />
        <path d="M40 34c0 3-1.5 4.5-4 4.5" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="m36 40 4.5-.8-1.6-4.3" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 47c2-2.5 6-2.5 8 0" stroke="var(--color-ink-faint)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
      </g>
    ),
  },
  {
    title: "ATS-friendly PDF export",
    body: "Download a clean, selectable-text PDF whose layout matches the live preview exactly — ready for application portals and recruiters alike.",
    art: (
      <g>
        <path d="M14 8h16l8 8v30a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3Z" fill="var(--color-parchment)" stroke="var(--color-ink-soft)" strokeWidth="1.5" />
        <path d="M30 8v8h8" fill="none" stroke="var(--color-ink-soft)" strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="16" y="24" width="16" height="2.5" rx="1.25" fill="var(--color-ink-faint)" />
        <rect x="16" y="30" width="12" height="2.5" rx="1.25" fill="var(--color-ink-faint)" />
        <rect x="16" y="36" width="14" height="2.5" rx="1.25" fill="var(--color-ink-faint)" />
        <circle cx="36" cy="40" r="7" fill="var(--color-accent)" />
        <path d="m33 40 2.2 2.2 4-4.4" stroke="var(--color-cream)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    ),
  },
];

const stats = [
  { value: "1 resume", label: "on the free plan, forever" },
  { value: "10 AI requests", label: "every month, free" },
  { value: "1-click PDF", label: "no watermark on Pro" },
];

export function Features() {
  return (
    <section id="features" aria-labelledby="features-heading" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-wide text-accent uppercase">
            Everything you need
          </p>
          <h2
            id="features-heading"
            className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            A focused toolkit for a resume that clears the filters
          </h2>
          <p className="mt-4 text-pretty text-lg leading-8 text-ink-soft">
            No feature sprawl — just the essentials done properly, from first
            draft to the PDF you actually send out.
          </p>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <li
              key={feature.title}
              className="group rounded-3xl border border-line bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/[0.08]"
            >
              <div className="flex h-24 items-center justify-center rounded-2xl bg-parchment">
                <svg viewBox="0 0 56 64" aria-hidden="true" className="h-16 w-14">
                  {feature.art}
                </svg>
              </div>
              <h3 className="mt-5 text-[17px] font-semibold text-ink">
                {feature.title}
              </h3>
              <p className="mt-2 text-[15px] leading-7 text-ink-soft">
                {feature.body}
              </p>
            </li>
          ))}
        </ul>

        <dl className="mt-14 flex flex-col items-center justify-center gap-8 rounded-3xl border border-line bg-parchment/60 px-8 py-8 text-center sm:flex-row sm:gap-16">
          {stats.map((stat) => (
            <div key={stat.value}>
              <dt className="order-last mt-1 text-sm text-ink-soft">{stat.label}</dt>
              <dd className="text-xl font-semibold tracking-tight text-ink">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-10 text-center text-[15px] text-ink-soft">
          Want the full picture?{" "}
          <Link href="#how" className="font-medium text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent">
            See how it works
          </Link>
        </p>
      </div>
    </section>
  );
}
