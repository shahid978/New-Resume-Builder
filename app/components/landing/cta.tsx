import Link from "next/link";

export function Cta() {
  return (
    <section aria-labelledby="cta-heading" className="relative overflow-hidden">
      <img
        src="/images/meadow.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(250,246,238,0.9),rgba(250,246,238,0.6)_45%,rgba(250,246,238,0.85))]"
      />

      <div className="relative mx-auto max-w-3xl px-6 py-28 text-center sm:py-36">
        <h2
          id="cta-heading"
          className="text-balance text-3xl font-semibold tracking-tight text-ink sm:text-5xl"
        >
          Your next role is a good resume away
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-8 text-ink-soft">
          Start free with one resume and 10 AI requests a month. Upgrade only
          when your job hunt outgrows it.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/sign-up"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-ink px-8 text-[15px] font-medium text-cream shadow-lg shadow-ink/20 transition-all hover:-translate-y-0.5 hover:bg-ink/90 sm:w-auto"
          >
            Get started free
          </Link>
          <Link
            href="/pricing"
            className="inline-flex h-12 w-full items-center justify-center rounded-full border border-ink/15 bg-white/70 px-8 text-[15px] font-medium text-ink backdrop-blur transition-colors hover:border-ink/30 hover:bg-white sm:w-auto"
          >
            Compare plans
          </Link>
        </div>
      </div>
    </section>
  );
}
