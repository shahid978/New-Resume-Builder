import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-full bg-ink text-cream shadow-sm transition-colors hover:bg-ink/90 focus-visible:outline-accent disabled:opacity-50 disabled:shadow-none",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white text-ink transition-colors hover:bg-parchment focus-visible:outline-accent disabled:opacity-50",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-full text-ink-soft transition-colors hover:bg-parchment hover:text-ink focus-visible:outline-accent disabled:opacity-50",
  outline:
    "inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-cream text-ink transition-colors hover:border-ink/30 hover:bg-white focus-visible:outline-accent disabled:opacity-50",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-full bg-accent-deep text-white shadow-sm transition-colors hover:bg-accent focus-visible:outline-accent disabled:opacity-50",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[15px]",
  lg: "h-12 px-7 text-[15px]",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={cn(variants[variant], sizes[size], className)}
      {...props}
    >
      {loading && (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-4 w-4 animate-spin"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  size?: Size;
}) {
  return (
    <a
      href={href}
      className={cn(variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </a>
  );
}