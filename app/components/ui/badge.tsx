import * as React from "react";
import { cn } from "@/lib/cn";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full bg-parchment px-2.5 py-1 text-xs font-medium text-ink-soft",
        className
      )}
      {...props}
    />
  );
}

export function StatusBadge({
  status,
  className,
}: {
  status: "saved" | "saving" | "error" | "pending" | "unsaved";
  className?: string;
}) {
  const styles: Record<string, string> = {
    saved: "bg-accent-soft text-accent-deep",
    saving: "bg-parchment text-ink-faint",
    error: "bg-accent-soft text-accent-deep",
    pending: "bg-parchment text-ink-faint",
    unsaved: "bg-parchment text-ink-faint",
  };
  const labels: Record<string, string> = {
    saved: "Saved",
    saving: "Saving…",
    error: "Save failed",
    pending: "Saving…",
    unsaved: "Unsaved",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        styles[status],
        className
      )}
    >
      {status === "saving" || status === "pending" ? (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-3 w-3 animate-spin"
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
      ) : status === "saved" ? (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-3 w-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : status === "error" ? (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-3 w-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ) : null}
      {labels[status]}
    </span>
  );
}