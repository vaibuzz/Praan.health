"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { RevealText } from "@/components/animated/RevealText";
import { BookingButton } from "@/components/booking/BookingButton";
import { fadeUp, fadeUpSm, stagger } from "@/lib/motion";
import { site } from "@/content/site";
import { hero } from "@/content/home";

export function HeroCinematic() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-40 md:pb-32">
      {/* Warm ambient background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_80%_-10%,rgba(201,162,39,0.10),transparent_60%),radial-gradient(70%_50%_at_10%_10%,rgba(13,92,74,0.10),transparent_55%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(250,249,247,0)_0%,var(--background)_85%)]"
      />

      <Container className="grid gap-14 md:grid-cols-[1.05fr_1fr] md:items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="flex flex-col"
        >
          <motion.div variants={fadeUpSm}>
            <Eyebrow tone="brand">{hero.eyebrow}</Eyebrow>
          </motion.div>

          <RevealText
            as="h1"
            text={hero.title}
            className="font-display mt-6 text-[42px] leading-[1.04] font-semibold tracking-tight text-ink md:text-[68px] lg:text-[80px]"
          />

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-140 text-[17px] leading-relaxed text-muted-ink md:text-[19px]"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-3">
            <Button asChild variant="brand" size="pillLg">
              <Link href={site.booking.href}>
                {site.booking.primary}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="ghostBrand" size="pillLg">
              <Link href="#features">{site.booking.secondary}</Link>
            </Button>
          </motion.div>

          <motion.ul
            variants={fadeUp}
            className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-ink/10 pt-6"
          >
            {hero.trust.map((t) => (
              <li key={t.label} className="flex flex-col">
                <span className="font-display text-2xl font-semibold text-ink">
                  {t.value}
                </span>
                <span className="text-[13px] text-muted-ink">{t.label}</span>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Right media column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-4/5 w-full overflow-hidden rounded-[32px] bg-brand-soft shadow-[0_30px_90px_-30px_rgba(13,92,74,0.35)]"
        >
          {/* Hero splash photo */}
          <Image
            src="/img-hero-wellness.png"
            alt="Elderly woman doing morning wellness exercise"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* warm gradient overlay */}
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-brand-soft/70 via-transparent to-transparent"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-brand/10"
          />

          {/* Floating stat cards */}
          <FloatingCard
            className="left-6 top-6"
            icon={<Heart className="size-4" />}
            label="Pain score"
            value="7 → 2"
            tone="brand"
            delay={0.4}
          />
          <FloatingCard
            className="right-6 top-24 md:top-32"
            icon={<ShieldCheck className="size-4" />}
            label="Doctor review"
            value="Weekly"
            tone="gold"
            delay={0.6}
          />
          <FloatingCard
            className="left-6 bottom-8"
            icon={<Sparkles className="size-4" />}
            label="Session streak"
            value="28 days"
            tone="brand"
            delay={0.8}
          />
        </motion.div>
      </Container>


      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="mt-16 flex items-center justify-center text-muted-ink md:mt-24"
      >
        <span className="flex items-center gap-2 text-[12px] uppercase tracking-[0.2em]">
          Scroll <ChevronDown className="size-3.5 animate-bounce" />
        </span>
      </motion.div>
    </section>
  );
}

function FloatingCard({
  icon,
  label,
  value,
  tone,
  className = "",
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "brand" | "gold";
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute flex items-center gap-3 rounded-2xl border border-ink/5 bg-white/90 px-3.5 py-2.5 shadow-[0_12px_30px_-12px_rgba(17,17,17,0.18)] backdrop-blur ${className}`}
    >
      <span
        className={`inline-flex size-8 items-center justify-center rounded-xl ${
          tone === "brand" ? "bg-brand/10 text-brand" : "bg-gold/15 text-gold"
        }`}
      >
        {icon}
      </span>
      <div className="flex flex-col">
        <span className="text-[11px] uppercase tracking-[0.18em] text-muted-ink">
          {label}
        </span>
        <span className="font-display text-[15px] font-semibold text-ink">
          {value}
        </span>
      </div>
    </motion.div>
  );
}
