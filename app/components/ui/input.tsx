import * as React from "react";
import { cn } from "@/lib/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  error,
  hint,
  id,
  className,
  ...props
}: InputProps) {
  const autoId = React.useId();
  const inputId = id ?? autoId;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-ink"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full rounded-xl border bg-white px-4 py-2.5 text-[15px] text-ink shadow-sm transition-colors placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent",
          error
            ? "border-accent-deep focus:ring-accent-deep/30"
            : "border-line",
          className
        )}
        {...props}
      />
      {hint && !error && (
        <p className="text-xs text-ink-faint">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-accent-deep" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({
  label,
  error,
  hint,
  id,
  className,
  ...props
}: TextareaProps) {
  const autoId = React.useId();
  const inputId = id ?? autoId;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-ink"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          "w-full resize-y rounded-xl border bg-white px-4 py-2.5 text-[15px] text-ink shadow-sm transition-colors placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent",
          error
            ? "border-accent-deep focus:ring-accent-deep/30"
            : "border-line",
          className
        )}
        {...props}
      />
      {hint && !error && (
        <p className="text-xs text-ink-faint">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-accent-deep" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Select({
  label,
  error,
  hint,
  id,
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  hint?: string;
}) {
  const autoId = React.useId();
  const inputId = id ?? autoId;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-ink"
        >
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={cn(
          "w-full rounded-xl border bg-white px-4 py-2.5 text-[15px] text-ink shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent",
          error
            ? "border-accent-deep focus:ring-accent-deep/30"
            : "border-line",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {hint && !error && (
        <p className="text-xs text-ink-faint">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-accent-deep" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}