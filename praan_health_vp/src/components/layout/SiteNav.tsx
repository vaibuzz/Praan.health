"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { BookingButton } from "@/components/booking/BookingButton";
import { cn } from "@/lib/utils";
import { site } from "@/content/site";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background,border,backdrop-filter] duration-500",
        scrolled
          ? "bg-ivory/80 backdrop-blur-md border-b border-ink/5"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <Container className="flex h-16 md:h-20 items-center justify-between">
        <Link
          href="/"
          aria-label="Praan Health home"
          className="flex items-center gap-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Praan Health"
            className="h-8 md:h-9 w-auto object-contain"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[14px] font-medium text-ink/70 hover:text-ink transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <BookingButton variant="brand" size="pill">
            {site.booking.primary}
          </BookingButton>
        </div>

        <button
          type="button"
          aria-label="Open menu"
          className="md:hidden inline-flex size-10 items-center justify-center rounded-full border border-ink/10 bg-white/80 text-ink"
          onClick={() => setOpen(true)}
        >
          <Menu className="size-5" />
        </button>
      </Container>

      {/* Mobile sheet */}
      <div
        className={cn(
          "fixed inset-0 z-60 md:hidden transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      >
        <div
          className="absolute inset-0 bg-brand"
          onClick={() => setOpen(false)}
        />
        <div className="relative flex h-full w-full flex-col p-6 text-ivory">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              aria-label="Praan Health home"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Praan Health"
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="inline-flex size-10 items-center justify-center rounded-full border border-ivory/20"
            >
              <X className="size-5" />
            </button>
          </div>
          <nav className="mt-16 flex flex-col gap-6">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-display text-4xl font-semibold tracking-tight"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <BookingButton
              variant="ivory"
              size="pillLg"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              {site.booking.primary}
            </BookingButton>
          </div>
        </div>
      </div>
    </header>
  );
}
