import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Account pages depend on the incoming session and are intentionally request rendered.
export const instant = false;

export default function PrivateAppLayout({ children }: LayoutProps<"/app">) {
  return children;
}
