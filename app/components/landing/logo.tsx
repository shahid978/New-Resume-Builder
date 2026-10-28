import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 font-semibold tracking-tight ${className}`}
      aria-label="Ascent — home"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-6 w-6 shrink-0"
        fill="none"
      >
        <rect
          x="1.5"
          y="1.5"
          width="21"
          height="21"
          rx="6.5"
          className="fill-ink"
        />
        <path
          d="M6.4 16.2 10 8.8l2.2 4.4 1.6-2.4 3.8 5.4"
          stroke="var(--color-cream)"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="16.6" cy="6.9" r="1.4" className="fill-accent-soft" />
      </svg>
      <span className="text-[17px]">Ascent</span>
    </Link>
  );
}
