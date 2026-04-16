"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { BookingDialog } from "./BookingDialog";

type Ctx = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
  markSubmitted: () => void;
};

const BookingCtx = createContext<Ctx | null>(null);

// Delays in ms: 30s → 1min → 2min → 4min → 8min …
const POPUP_DELAYS = [30_000, 60_000, 120_000, 240_000, 480_000];

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const submitted = useRef(false);
  const attemptRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const scheduleNext = useCallback(() => {
    if (submitted.current) return;
    if (pathname === "/session") return; // Block auto-popup on session page
    const delay =
      POPUP_DELAYS[Math.min(attemptRef.current, POPUP_DELAYS.length - 1)];
    timerRef.current = setTimeout(() => {
      if (!submitted.current) setIsOpen(true);
    }, delay);
  }, [pathname]);

  // Kick off the popup timer, but immediately clear it if on the session page
  useEffect(() => {
    if (pathname === "/session") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsOpen(false);
      return;
    }
    scheduleNext();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [scheduleNext, pathname]);

  const open = useCallback(() => setIsOpen(true), []);

  const close = useCallback(() => {
    setIsOpen(false);
    if (submitted.current) return;
    // Advance to next delay tier and schedule the next auto-popup
    attemptRef.current += 1;
    scheduleNext();
  }, [scheduleNext]);

  const markSubmitted = useCallback(() => {
    submitted.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const value = useMemo(
    () => ({ isOpen, open, close, markSubmitted }),
    [isOpen, open, close, markSubmitted]
  );

  return (
    <BookingCtx.Provider value={value}>
      {children}
      <BookingDialog open={isOpen} onOpenChange={(next) => { if (!next) close(); else setIsOpen(true); }} />
    </BookingCtx.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingCtx);
  if (!ctx)
    throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
