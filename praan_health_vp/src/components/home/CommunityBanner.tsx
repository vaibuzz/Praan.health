"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { fadeUp, stagger } from "@/lib/motion";

/* Inline Instagram SVG — avoids lucide version dependency */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

/* Concentric rings watermark — purely decorative */
function RingsWatermark() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-[520px] opacity-[0.07]"
      viewBox="0 0 520 520"
      fill="none"
    >
      {[60, 110, 160, 210, 260].map((r) => (
        <circle
          key={r}
          cx="520"
          cy="260"
          r={r}
          stroke="#dc4b32"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}

export function CommunityBanner() {
  return (
    <section
      id="community"
      className="relative overflow-hidden bg-[#f5e9d9]"
      style={{ paddingTop: 0, paddingBottom: 0 }}
    >
      {/* Outer card — full bleed at all breakpoints */}
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-10 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col overflow-hidden rounded-[24px] bg-[#faf0e2] shadow-[0_4px_40px_-12px_rgba(26,23,20,0.14)] md:flex-row md:min-h-[280px]"
        >
          {/* ── Decorative rings on the right ── */}
          <RingsWatermark />

          {/* ── LEFT: founders photo ── */}
          <div className="relative w-full shrink-0 md:w-[42%]">
            {/* The image is positioned to fill and bleed to the card edge */}
            <Image
              src="/image_founders.png"
              alt="Praan Health founders family"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 42vw"
              priority
            />
            {/* Right-side fade so image blends into the text area */}
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-[#faf0e2] hidden md:block"
              style={{
                backgroundImage:
                  "linear-gradient(to right, transparent 55%, #faf0e2 100%)",
              }}
            />
            {/* Bottom fade for mobile */}
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-b from-transparent to-[#faf0e2] md:hidden"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, transparent 60%, #faf0e2 100%)",
              }}
            />
            {/* spacer so the div has height on mobile */}
            <div className="relative aspect-4/3 md:aspect-auto md:h-full" />
          </div>

          {/* ── RIGHT: text + CTA ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="relative z-10 flex flex-col justify-center px-8 pb-10 pt-4 md:px-12 md:py-12 md:pl-4"
          >
            {/* Headline */}
            <motion.h2
              variants={fadeUp}
              className="font-display text-[26px] md:text-[34px] font-bold tracking-tight text-ink leading-[1.1] uppercase"
            >
              Join <span className="text-brand">500,000+</span> Families
              <br />
              Redefining Parent Care
            </motion.h2>

            {/* Body copy */}
            <motion.div
              variants={fadeUp}
              className="mt-5 space-y-2.5 max-w-[400px]"
            >
              <p className="text-[15px] md:text-[16px] text-muted-ink leading-relaxed">
                You&apos;re not alone. Praan Health is more than a platform,
                it&apos;s a movement.
              </p>
              <p className="text-[15px] md:text-[16px] text-muted-ink leading-relaxed">
                Brought to you with love by the same family you&apos;ve seen on
                Instagram.
              </p>
            </motion.div>

            {/* CTA button */}
            <motion.div variants={fadeUp} className="mt-8">
              <Link
                href="https://www.instagram.com/praan.health"
                target="_blank"
                rel="noopener noreferrer"
                id="community-instagram-cta"
                className="group inline-flex items-center gap-2.5 rounded-full bg-brand px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-ivory shadow-[0_4px_20px_-6px_rgba(220,75,50,0.5)] transition-all duration-300 hover:bg-brand-dark hover:shadow-[0_6px_28px_-6px_rgba(220,75,50,0.65)] hover:scale-[1.03] active:scale-[0.98]"
              >
                Join the Instagram Community
                <InstagramIcon className="size-4 transition-transform duration-300 group-hover:rotate-12" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
