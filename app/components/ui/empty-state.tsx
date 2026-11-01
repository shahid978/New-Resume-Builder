import * as React from "react";
import { Button } from "./button";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-5 rounded-3xl border border-dashed border-line bg-parchment/40 px-6 py-16 text-center",
        className
      )}
    >
      {icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-accent">
          {icon}
        </div>
      )}
      <div className="max-w-sm">
        <h3 className="text-lg font-semibold text-ink">{title}</h3>
        <p className="mt-2 text-[15px] leading-7 text-ink-soft">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}