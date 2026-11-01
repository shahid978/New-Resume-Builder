"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Mode = "sign-up" | "sign-in" | "forgot-password" | "reset-password" | "verify-email";

export function AuthForm({ mode, token }: { mode: Mode; token?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    let endpoint = "";
    let body: Record<string, string> = {};
    if (mode === "sign-up") {
      endpoint = "/sign-up/email";
      body = { name, email, password };
    } else if (mode === "sign-in") {
      endpoint = "/sign-in/email";
      body = { email, password, callbackURL: "/app" };
    } else if (mode === "forgot-password") {
      endpoint = "/request-password-reset";
      body = { email, redirectTo: "/reset-password" };
    } else if (mode === "reset-password") {
      endpoint = "/reset-password";
      body = { newPassword: password, token: token ?? "" };
    } else {
      endpoint = "/send-verification-email";
      body = { email, callbackURL: "/verify-email" };
    }

    try {
      const response = await fetch(`/api/auth${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.error) {
        throw new Error(result.message || result.error?.message || "We couldn’t complete that request. Please try again.");
      }
      if (mode === "sign-up") {
        setMessage("Check your inbox for a verification link. You can sign in after verifying your email.");
      } else if (mode === "sign-in") {
        router.push("/app");
        router.refresh();
      } else if (mode === "forgot-password") {
        setMessage("If an account exists for that email, a password reset link is on its way.");
      } else if (mode === "reset-password") {
        setMessage("Your password has been updated. You can sign in now.");
      } else {
        setMessage("If that address has an account, we’ve sent a verification link.");
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function googleSignIn() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/sign-in/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "google", callbackURL: "/app" }),
      });
      const result = await response.json();
      if (!response.ok || !result.url) throw new Error(result.message || "Google sign-in is unavailable right now.");
      window.location.assign(result.url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Couldn’t start Google sign-in.");
      setBusy(false);
    }
  }

  const title = {
    "sign-up": "Create your account",
    "sign-in": "Welcome back",
    "forgot-password": "Reset your password",
    "reset-password": "Choose a new password",
    "verify-email": "Verify your email",
  }[mode];

  return (
    <section className="w-full max-w-md rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-ink-soft">
        {mode === "sign-up" && "Build and save an ATS-friendly resume with Ascent."}
        {mode === "sign-in" && "Sign in to continue editing your resumes."}
        {mode === "forgot-password" && "We’ll email you a link to choose a new password."}
        {mode === "reset-password" && "Use at least 8 characters for your new password."}
        {mode === "verify-email" && "Enter your account email and we’ll send a fresh verification link."}
      </p>

      {mode === "sign-in" && <button type="button" disabled={busy} onClick={googleSignIn} className="mt-6 h-11 w-full rounded-full border border-line font-medium hover:bg-parchment disabled:opacity-50">Continue with Google</button>}
      {mode === "sign-in" && <div className="my-5 flex items-center gap-3 text-xs text-ink-faint"><span className="h-px flex-1 bg-line" />or use email<span className="h-px flex-1 bg-line" /></div>}

      <form onSubmit={submit} className="space-y-4">
        {mode === "sign-up" && <label className="block text-sm font-medium">Name<input required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 w-full rounded-xl border border-line px-4 py-2.5 font-normal outline-none focus:border-accent" /></label>}
        {mode !== "reset-password" && <label className="block text-sm font-medium">Email<input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 w-full rounded-xl border border-line px-4 py-2.5 font-normal outline-none focus:border-accent" /></label>}
        {(mode === "sign-in" || mode === "sign-up" || mode === "reset-password") && <label className="block text-sm font-medium">{mode === "reset-password" ? "New password" : "Password"}<input type="password" required minLength={8} autoComplete={mode === "sign-in" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 w-full rounded-xl border border-line px-4 py-2.5 font-normal outline-none focus:border-accent" /></label>}
        {error && <p role="alert" className="rounded-xl bg-accent-soft p-3 text-sm text-accent-deep">{error}</p>}
        {message && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
        <button disabled={busy} className="h-11 w-full rounded-full bg-ink font-semibold text-white hover:bg-ink/90 disabled:opacity-50">{busy ? "Please wait…" : mode === "sign-up" ? "Create account" : mode === "sign-in" ? "Sign in" : mode === "forgot-password" ? "Send reset link" : mode === "reset-password" ? "Update password" : "Send verification link"}</button>
      </form>
      <nav className="mt-6 flex flex-wrap justify-between gap-2 text-sm text-accent-deep">
        {mode === "sign-up" && <Link href="/sign-in">Already have an account? Sign in</Link>}
        {mode === "sign-in" && <><Link href="/sign-up">Create account</Link><Link href="/forgot-password">Forgot password?</Link></>}
        {mode === "forgot-password" && <Link href="/sign-in">Back to sign in</Link>}
        {mode === "reset-password" && <Link href="/sign-in">Back to sign in</Link>}
        {mode === "verify-email" && <Link href="/sign-in">Back to sign in</Link>}
      </nav>
    </section>
  );
}
