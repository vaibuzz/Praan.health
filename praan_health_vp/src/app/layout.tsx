import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/animated/SmoothScrollProvider";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import { BookingProvider } from "@/components/booking/BookingProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const display = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Praan Health — Premium Longevity Care for Parents",
  description:
    "Doctor-led programs for pain, diabetes, mobility and longevity. Structured care for your parents, with family visibility built in.",
  metadataBase: new URL("https://praanhealth.in"),
  openGraph: {
    title: "Praan Health — Premium Longevity Care for Parents",
    description:
      "Doctor-led programs for pain, diabetes, mobility and longevity. Peace of mind for families living away.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Praan Health — Premium Longevity Care for Parents",
    description:
      "Doctor-led programs for pain, diabetes, mobility and longevity.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${display.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <SmoothScrollProvider>
          <BookingProvider>
            <SiteNav />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <MobileStickyCTA />
          </BookingProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
