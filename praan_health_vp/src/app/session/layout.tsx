import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Session — Praan Health",
  description: "Your 14-Day Senior Strength & Mobility daily yoga session.",
  robots: { index: false, follow: false }, // Keep session pages private
};

// This layout intentionally has NO SiteNav / SiteFooter / MobileStickyCTA
// The session page is a self-contained fullscreen experience
export default function SessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
