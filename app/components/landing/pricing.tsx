"use client";

import Link from "next/link";
import { useState } from "react";

const plans = [
  {
    name: "Free",
    tagline: "Everything you need to land your first interviews.",
    monthly: { price: "$0", period: "forever" },
    annual: { price: "$0", period: "forever" },
    cta: { label: "Get started free", href: "/sign-up" },
    features: [
      "1 resume",
      "10 AI requests per month (writing + matching)",
      "Live preview and autosave",
      "PDF export with watermark-free layout",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    tagline: "For active job hunts across multiple applications.",
    monthly: { price: "$15", period: "per month, billed monthly" },
    annual: { price: "$9", period: "per month, billed annually ($108/yr)" },
    cta: { label: "Start Pro", href: "/pricing" },
    features: [
      "Unlimited resumes under fair use",
      "Generous AI usage under a documented cap",
      "Priority AI quality and speed",
      "Cancel anytime — access stays until period end",
    ],
    highlighted: true,
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium tracking-wide text-accent uppercase">
            Pricing
          </p>
          <h2
            id="pricing-heading"
            className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            Simple plans, no trial tricks
          </h2>
          <p className="mt-4 text-pretty text-lg leading-8 text-ink-soft">
            Start free. Upgrade when you&apos;re ready. Cancel anytime and keep
            access until the end of your billing period.
          </p>

          <div className="mt-8 inline-flex items-center rounded-full border border-line bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              aria-pressed={!annual}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                !annual ? "bg-ink text-cream" : "text-ink-soft hover:text-ink"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              aria-pressed={annual}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                annual ? "bg-ink text-cream" : "text-ink-soft hover:text-ink"
              }`}
            >
              Annual{" "}
              <span className={!annual ? "text-cream/70" : "text-accent"}>−40%</span>
            </button>
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {plans.map((plan) => {
            const current = annual ? plan.annual : plan.monthly;
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-3xl border p-8 ${
                  plan.highlighted
                    ? "border-accent/40 bg-white shadow-xl shadow-accent/10"
                    : "border-line bg-white shadow-sm"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-medium text-white shadow-sm">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-ink">{plan.name}</h3>
                <p className="mt-1 text-[15px] leading-7 text-ink-soft">{plan.tagline}</p>
                <p className="mt-6 flex items-baseline gap-2">
                  <span className="text-5xl font-semibold tracking-tight text-ink">
                    {current.price}
                  </span>
                  <span className="text-sm text-ink-faint">{current.period}</span>
                </p>
                <ul className="mt-7 flex flex-1 flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-[15px] text-ink-soft">
                      <svg
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        className="mt-0.5 h-5 w-5 shrink-0 fill-accent-soft"
                      >
                        <path d="M10 1 3 10l7 9 7-9-7-9Z" opacity="0" />
                        <circle cx="10" cy="10" r="9" />
                        <path
                          d="m6.2 10.4 2.4 2.4 5-5"
                          fill="none"
                          stroke="var(--color-accent-deep)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.cta.href}
                  className={`mt-8 inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-medium transition-colors ${
                    plan.highlighted
                      ? "bg-accent text-white shadow-lg shadow-accent/25 hover:bg-accent-deep"
                      : "border border-ink/15 bg-cream text-ink hover:border-ink/30"
                  }`}
                >
                  {plan.cta.label}
                </Link>
              </div>
            );
          })}
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-sm leading-6 text-ink-faint">
          Note: exact Pro pricing and quotas are launch decisions tracked in the
          product plan — the figures above are reviewable placeholders, not a
          final offer.
        </p>
      </div>
    </section>
  );
}
