import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Ascent — Build a resume that gets you hired",
    template: "%s — Ascent",
  },
  description:
    "Ascent is an AI resume builder for job seekers: write, improve, and tailor an ATS-friendly resume with reviewable AI suggestions, job-description matching, autosave, and one-click PDF export.",
  openGraph: {
    title: "Ascent — Build a resume that gets you hired",
    description:
      "Create, improve, and tailor an ATS-friendly resume in minutes, with AI suggestions you review and apply. Free plan available.",
    type: "website",
    siteName: "Ascent",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ascent — Build a resume that gets you hired",
    description:
      "Create, improve, and tailor an ATS-friendly resume in minutes, with AI suggestions you review and apply. Free plan available.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
