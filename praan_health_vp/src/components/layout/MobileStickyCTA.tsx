"use client";

import { useEffect, useState } from "react";
import { BookingButton } from "@/components/booking/BookingButton";
import { cn } from "@/lib/utils";
import { site } from "@/content/site";

export function MobileStickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "md:hidden fixed inset-x-0 bottom-0 z-40 px-4 pb-4 pt-3 transition-transform duration-500",
        "bg-linear-to-t from-ivory via-ivory/95 to-transparent",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <BookingButton variant="brand" size="pillLg" className="w-full">
        {site.booking.primary}
      </BookingButton>
    </div>
  );
}
