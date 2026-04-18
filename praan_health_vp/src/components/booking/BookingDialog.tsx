"use client";

import { useState } from "react";
import { Dialog } from "radix-ui";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Phone, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooking } from "./BookingProvider";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type Status = "idle" | "submitting" | "success" | "error";

export function BookingDialog({ open, onOpenChange }: Props) {
  const { markSubmitted } = useBooking();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setPhone("");
    setStatus("idle");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError("Please share your full name so our team can reach out.");
      return;
    }
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      setError("Enter a valid phone number with country code.");
      return;
    }

    setStatus("submitting");
    try {
      // Normalise phone: strip non-digits, ensure leading +91
      const digits = phone.replace(/\D/g, "");
      const e164 = digits.startsWith("91") ? `+${digits}` : `+91${digits}`;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone_number: e164, name: name.trim() }),
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.detail ?? "Registration failed");
      }

      setStatus("success");
      markSubmitted(); // Stop future auto-popups permanently

      // Directly redirect current tab to WhatsApp (Never blocked by popup blockers)
      const waMessage = encodeURIComponent("join crack-stream");
      window.location.href = `https://wa.me/14155238886?text=${waMessage}`;

    } catch (err: unknown) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again or call us."
      );
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setTimeout(reset, 300);
      }}
    >
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-32px)] max-w-[440px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] border border-ink/10 bg-ivory-soft p-6 md:p-8 shadow-[0_40px_120px_-30px_rgba(220,75,50,0.35)] focus:outline-none"
              >
                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label="Close"
                    className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full text-ink/60 hover:bg-ink/5 hover:text-ink transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </Dialog.Close>

                {status === "success" ? (
                  <SuccessPanel name={name} onClose={() => onOpenChange(false)} />
                ) : (
                  <FormPanel
                    name={name}
                    phone={phone}
                    status={status}
                    error={error}
                    onName={setName}
                    onPhone={setPhone}
                    onSubmit={handleSubmit}
                  />
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

function FormPanel({
  name,
  phone,
  status,
  error,
  onName,
  onPhone,
  onSubmit,
}: {
  name: string;
  phone: string;
  status: Status;
  error: string | null;
  onName: (v: string) => void;
  onPhone: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const submitting = status === "submitting";
  return (
    <>
      <div className="mb-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-brand">
          <span aria-hidden className="size-1.5 rounded-full bg-brand" />
          14-Day Free Trial
        </span>
        <Dialog.Title className="font-display mt-4 text-[26px] md:text-[30px] font-semibold tracking-tight leading-[1.1] text-ink">
          Let's get your parents stronger.
        </Dialog.Title>
        <Dialog.Description className="mt-2 text-[14px] text-muted-ink">
          Share your details and we'll connect you on WhatsApp to get started instantly.
        </Dialog.Description>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field
          label="Your name"
          icon={<User className="size-4" />}
          id="booking-name"
        >
          <input
            id="booking-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="e.g. Rohan Kapoor"
            value={name}
            onChange={(e) => onName(e.target.value)}
            className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-muted-ink/60"
          />
        </Field>

        <Field
          label="Phone number"
          icon={<Phone className="size-4" />}
          id="booking-phone"
        >
          <input
            id="booking-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+91 98XXX XXXXX"
            value={phone}
            onChange={(e) => onPhone(e.target.value)}
            className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-muted-ink/60"
          />
        </Field>

        {error && (
          <p className="text-[13px] text-brand-dark">{error}</p>
        )}

        <Button
          type="submit"
          variant="brand"
          size="pillLg"
          className="w-full mt-2"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending…
            </>
          ) : (
            "Start My 14-Day Free Trial 🧘"
          )}
        </Button>

        <p className="text-center text-[11px] text-muted-ink">
          By submitting, you agree to our Privacy Policy. No spam, no pressure.
        </p>
      </form>
    </>
  );
}

function Field({
  label,
  icon,
  id,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className="group flex flex-col gap-1.5 rounded-2xl border border-ink/10 bg-white px-4 py-3 transition-colors focus-within:border-brand/60 focus-within:shadow-[0_0_0_4px_rgba(220,75,50,0.1)]"
    >
      <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-ink">
        <span className="inline-flex size-5 items-center justify-center rounded-md bg-brand/10 text-brand">
          {icon}
        </span>
        {label}
      </span>
      {children}
    </label>
  );
}

function SuccessPanel({
  name,
  onClose,
}: {
  name: string;
  onClose: () => void;
}) {
  return (
    <div className="py-6 text-center">
      <div className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-brand/10 text-brand">
        <Check className="size-6" />
      </div>
      <Dialog.Title className="font-display mt-5 text-[26px] md:text-[30px] font-semibold tracking-tight text-ink">
        Thank you{name ? `, ${name.split(" ")[0]}` : ""}.
      </Dialog.Title>
      <Dialog.Description className="mx-auto mt-2 max-w-[320px] text-[14px] text-muted-ink">
        Our care team will reach out within 24 hours with next steps. Keep an
        eye on your phone.
      </Dialog.Description>

      <Button
        type="button"
        variant="brand"
        size="pillLg"
        disabled
        className="mt-8 w-full opacity-80"
      >
        <span className="flex items-center justify-center gap-2">
          Connecting to WhatsApp...
        </span>
      </Button>
    </div>
  );
}
