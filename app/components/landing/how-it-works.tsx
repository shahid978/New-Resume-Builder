const steps = [
  {
    number: "01",
    title: "Start with the essentials",
    body: "Create an account and fill in your contact details, summary, work experience, education, and skills — with autosave along the way.",
  },
  {
    number: "02",
    title: "Refine with AI, your call",
    body: "Ask for a sharper summary or stronger bullets. Suggestions arrive as reviewable drafts; you apply exactly what you like, line by line.",
  },
  {
    number: "03",
    title: "Match, then export",
    body: "Optionally paste a job ad to surface keywords worth including, then download a clean ATS-friendly PDF that matches your preview.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      aria-labelledby="how-heading"
      className="relative border-y border-line bg-parchment/50 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-wide text-accent uppercase">
            How it works
          </p>
          <h2
            id="how-heading"
            className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            From blank page to sent-out PDF in three steps
          </h2>
        </div>

        <ol className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
          {steps.map((step, index) => (
            <li key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute left-8 top-8 hidden h-px w-[calc(100%-4rem)] border-t border-dashed border-ink-faint/50 md:block"
                />
              )}
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-line bg-white font-mono text-lg font-medium text-accent shadow-sm">
                {step.number}
              </div>
              <h3 className="mt-5 text-[17px] font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 max-w-sm text-[15px] leading-7 text-ink-soft">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
