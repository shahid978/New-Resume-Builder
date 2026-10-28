const faqs = [
  {
    question: "How does the AI assistance work?",
    answer:
      "You request a summary or bullet rewrite, and the AI returns a draft suggestion. Nothing changes your resume until you review and apply it — you stay in control of every line.",
  },
  {
    question: "What does ATS-friendly actually mean?",
    answer:
      "Your resume uses one clean, professional template with selectable text, clear hierarchy, and readable margins — the format applicant tracking systems parse reliably. The PDF layout always matches your live preview.",
  },
  {
    question: "What's included in the free plan?",
    answer:
      "One resume and 10 AI requests per month, shared between writing and job-description matching, plus live preview, autosave, and PDF export. It's free forever — not a trial.",
  },
  {
    question: "What happens to my job ad when I use matching?",
    answer:
      "The job ad is sent only to generate your keyword suggestions, and it's disclosed in the UI. Raw job-ad content is never used for other purposes or included in analytics.",
  },
  {
    question: "Can I cancel Pro anytime?",
    answer:
      "Yes. Cancel from your account page and your paid access remains until the end of the billing period you've already paid for. No cancellation fees.",
  },
  {
    question: "Can I delete my account and data?",
    answer:
      "Yes. Account deletion removes your personal resume and account data promptly, retaining only what billing law requires.",
  },
];

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="border-t border-line bg-parchment/50 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="text-sm font-medium tracking-wide text-accent uppercase">FAQ</p>
          <h2
            id="faq-heading"
            className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            Questions, answered
          </h2>
        </div>

        <div className="mt-12 flex flex-col gap-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-line bg-white px-6 shadow-sm open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[17px] font-medium text-ink [&::-webkit-details-marker]:hidden">
                {faq.question}
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-ink-faint transition-transform duration-300 group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m5 8 5 5 5-5" />
                </svg>
              </summary>
              <p className="pb-6 pr-8 text-[15px] leading-7 text-ink-soft">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
