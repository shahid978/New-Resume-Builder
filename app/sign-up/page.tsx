import Link from "next/link";
import { AuthForm } from "@/app/components/auth/auth-form";

export const metadata = { robots: { index: false, follow: false } };

export default function SignUpPage() {
  return <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-5 py-12"><Link href="/" className="text-lg font-semibold">Ascent</Link><AuthForm mode="sign-up" /></main>;
}
