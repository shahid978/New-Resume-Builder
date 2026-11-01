"use client";

import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();
  async function signOut() {
    await fetch("/api/auth/sign-out", { method: "POST" });
    router.push("/");
    router.refresh();
  }
  return <button type="button" onClick={signOut} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink-soft hover:bg-parchment">Sign out</button>;
}
