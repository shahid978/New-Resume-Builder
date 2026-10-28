import Link from "next/link";
import { Logo } from "./logo";

const groups = [
  {
    heading: "Product",
    links: [
      { href: "#features", label: "Features" },
      { href: "#how", label: "How it works" },
      { href: "#pricing", label: "Pricing" },
      { href: "#faq", label: "FAQ" },
    ],
  },
  {
    heading: "Account",
    links: [
      { href: "/sign-up", label: "Sign up" },
      { href: "/sign-in", label: "Sign in" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-parchment">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <Logo className="text-ink" />
            <p className="mt-4 text-[15px] leading-7 text-ink-soft">
              The AI resume builder for job seekers — reviewable suggestions,
              honest quotas, and an ATS-friendly PDF that matches your preview.
            </p>
          </div>
          <nav aria-label="Footer" className="flex gap-14">
            {groups.map((group) => (
              <div key={group.heading}>
                <h3 className="text-sm font-semibold text-ink">{group.heading}</h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[15px] text-ink-soft transition-colors hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-faint">
            © 2026 Ascent. All rights reserved.
          </p>
          <p className="text-sm text-ink-faint">
            Public landing page demo — account routes are not built yet.
          </p>
        </div>
      </div>
    </footer>
  );
}
