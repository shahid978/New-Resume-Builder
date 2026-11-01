import Link from "next/link";
import { AuthForm } from "@/app/components/auth/auth-form";

export const instant = false;
export const metadata = { robots: { index: false, follow: false } };

export default async function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-5 py-12"><Link href="/" className="text-lg font-semibold">Ascent</Link><AuthForm mode="reset-password" token={token} /></main>;
}
