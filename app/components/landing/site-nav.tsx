"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./logo";

const links = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav
        aria-label="Main"
        className="relative flex h-14 w-full max-w-3xl items-center justify-between rounded-full border border-white/60 bg-white/75 pl-4 pr-2 shadow-lg shadow-ink/[0.06] backdrop-blur-md"
      >
        <Logo />

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-full px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-parchment hover:text-ink"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <Link
            href="/sign-in"
            className="hidden rounded-full px-3 py-2 text-sm text-ink-soft transition-colors hover:text-ink sm:block"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-ink/85"
          >
            Get started
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-parchment md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div
            id="mobile-menu"
            className="absolute inset-x-0 top-16 rounded-3xl border border-line bg-white p-3 shadow-xl shadow-ink/10"
          >
            <ul className="flex flex-col">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-[15px] text-ink-soft transition-colors hover:bg-parchment hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="mt-1 border-t border-line pt-2">
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-[15px] text-ink-soft transition-colors hover:bg-parchment hover:text-ink"
                >
                  Sign in
                </Link>
              </li>
              <li className="mt-1">
                <Link
                  href="/sign-up"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl bg-ink px-4 py-3 text-center text-[15px] font-medium text-cream transition-colors hover:bg-ink/85"
                >
                  Get started free
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
