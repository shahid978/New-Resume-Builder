import Link from "next/link";
import { HeroVideo } from "./hero-video";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-svh flex-col overflow-hidden">
      {/* Painted landscape backdrop, matching the video's palette. */}
      <img
        src="/images/meadow.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      {/* Soft scrim so text and the video card stay legible. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(250,246,238,0.92),rgba(250,246,238,0.55)_38%,rgba(250,246,238,0)_72%)]"
      />

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 pb-20 pt-36 text-center sm:pt-40">
        <p className="animate-rise inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-4 py-1.5 text-sm text-ink-soft shadow-sm backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          New — tailor your resume to any job ad in one click
        </p>

        <h1 className="animate-rise mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-ink [animation-delay:80ms] sm:text-6xl">
          Build a resume that gets you hired
        </h1>

        <p className="animate-rise mt-5 max-w-xl text-pretty text-lg leading-8 text-ink-soft [animation-delay:160ms]">
          Astronate writes, improves, and formats an ATS-friendly resume in
          minutes — with AI suggestions you review and apply, and a polished
          PDF in one click.
        </p>

        <div className="animate-rise mt-8 flex flex-col gap-3 sm:flex-row [animation-delay:240ms]">
          <Link
            href="/sign-up"
            className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-7 text-[15px] font-medium text-cream shadow-lg shadow-ink/20 transition-all hover:-translate-y-0.5 hover:bg-ink/90"
          >
            Get started free
          </Link>
          <Link
            href="#pricing"
            className="inline-flex h-12 items-center justify-center rounded-full border border-ink/15 bg-white/70 px-7 text-[15px] font-medium text-ink backdrop-blur transition-colors hover:border-ink/30 hover:bg-white"
          >
            See pricing
          </Link>
        </div>

        {/* Portrait video — the astronaut in the wildflower meadow. */}
        <figure className="animate-rise relative mt-14 w-full max-w-sm [animation-delay:320ms] sm:mt-16">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/60 shadow-2xl shadow-ink/25 ring-1 ring-ink/10">
            <HeroVideo />
            {/* Warm grade over the video to sit it in the scene. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(255,244,214,0.18),transparent_60%)]"
            />
          </div>
          <figcaption className="sr-only">
            An astronaut in a suit of wildflowers standing in a sunlit meadow.
          </figcaption>
        </figure>

        <div
          aria-hidden="true"
          className="animate-drift mt-10 flex flex-col items-center gap-1 text-ink-faint"
        >
          <span className="text-xs tracking-wide uppercase">Scroll to explore</span>
          <svg viewBox="0 0 12 8" className="h-2 w-3 fill-current">
            <path d="M6 8 0 0h12L6 8Z" />
          </svg>
        </div>
      </div>
    </section>
  );
}
