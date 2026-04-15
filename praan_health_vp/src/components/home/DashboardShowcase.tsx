"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Activity, CalendarCheck2, Heart, Send } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { fadeUp, stagger } from "@/lib/motion";
import { dashboard } from "@/content/home";

const icons = [Heart, CalendarCheck2, Activity, Send];

export function DashboardShowcase() {
  return (
    <section
      id="how-it-works"
      className="relative py-24 md:py-36 bg-ivory-warm/60"
    >
      <Container className="grid gap-14 md:grid-cols-[1fr_1.3fr] md:items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <Eyebrow>{dashboard.eyebrow}</Eyebrow>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-display mt-5 text-[34px] md:text-[52px] font-semibold tracking-tight leading-[1.05] text-ink"
          >
            {dashboard.title}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-120 text-[16px] md:text-[17px] text-muted-ink"
          >
            {dashboard.body}
          </motion.p>

          <motion.ul
            variants={stagger}
            className="mt-10 grid grid-cols-2 gap-3"
          >
            {dashboard.callouts.map((c, i) => {
              const Icon = icons[i] ?? Heart;
              const isBrand = c.tone === "brand";
              return (
                <motion.li
                  key={c.label}
                  variants={fadeUp}
                  className="rounded-2xl border border-ink/8 bg-white p-4 shadow-[0_6px_20px_-12px_rgba(17,17,17,0.1)]"
                >
                  <span
                    className={`inline-flex size-9 items-center justify-center rounded-xl ${
                      isBrand
                        ? "bg-brand/10 text-brand"
                        : "bg-gold/15 text-gold"
                    }`}
                  >
                    <Icon className="size-4" />
                  </span>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-muted-ink">
                    {c.label}
                  </p>
                  <p className="font-display mt-1 text-[18px] font-semibold text-ink">
                    {c.value}
                  </p>
                </motion.li>
              );
            })}
          </motion.ul>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative rounded-[24px] border border-ink/8 bg-white shadow-[0_40px_100px_-30px_rgba(13,92,74,0.25)] overflow-hidden md:p-0">
            {/* splash image strip */}
            <div className="relative h-44 w-full overflow-hidden">
              <Image
                src="/img-doctor-assessment.png"
                alt="Doctor assessment session"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 55vw"
              />
              <div className="absolute inset-0 bg-linear-to-b from-transparent to-white" />
              {/* overlay badge */}
              <div className="absolute left-5 bottom-4 flex items-center gap-2.5 rounded-full bg-brand/90 px-4 py-1.5 backdrop-blur">
                <span className="size-2 rounded-full bg-white animate-ping opacity-80" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-white font-medium">
                  Live session today
                </span>
              </div>
            </div>

            <div className="p-5 md:p-6">
              {/* Window chrome */}
              <div className="flex items-center gap-1.5 pb-4">
                <span className="size-2.5 rounded-full bg-ink/15" />
                <span className="size-2.5 rounded-full bg-ink/15" />
                <span className="size-2.5 rounded-full bg-ink/15" />
                <span className="ml-4 text-[11px] uppercase tracking-[0.2em] text-muted-ink">
                  family.praan.app
                </span>
              </div>

              {/* Header */}
              <div className="rounded-2xl bg-ivory-warm/70 p-5">
                <p className="text-[12px] uppercase tracking-[0.2em] text-muted-ink">
                  This week · Amma
                </p>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="font-display text-[26px] md:text-[30px] font-semibold text-ink leading-none">
                      Stronger than last week
                    </p>
                    <p className="mt-2 text-[13px] text-brand">
                      ↑ 12% consistency · 3 goals hit
                    </p>
                  </div>
                  <span className="rounded-full bg-brand px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-ivory">
                    On track
                  </span>
                </div>
              </div>

              {/* Charts row */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <DashPanel
                  title="HbA1c"
                  value="6.4"
                  delta="↓ 1.8"
                  tone="brand"
                  bars={[72, 68, 60, 55, 50, 48, 44]}
                />
                <DashPanel
                  title="Pain score"
                  value="2"
                  delta="↓ from 7"
                  tone="gold"
                  bars={[80, 75, 60, 48, 40, 28, 22]}
                />
              </div>

              {/* Digest row */}
              <div className="mt-4 flex items-center gap-4 rounded-2xl border border-ink/8 bg-ivory-warm/50 p-4">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Send className="size-4" />
                </span>
                <div className="flex-1">
                  <p className="text-[12px] uppercase tracking-[0.18em] text-muted-ink">
                    Family digest · Sunday
                  </p>
                  <p className="font-display text-[16px] font-semibold text-ink">
                    Sent to Rohan, Priya and 2 others
                  </p>
                </div>
                <span className="text-[12px] text-brand">Delivered</span>
              </div>
            </div>
          </div>

          {/* Floating weekly card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="absolute -bottom-6 -right-4 hidden md:block w-60 rounded-2xl border border-ink/8 bg-white p-4 shadow-[0_20px_40px_-18px_rgba(17,17,17,0.2)]"
          >
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-ink">
              Session streak
            </p>
            <p className="font-display mt-1 text-[28px] font-semibold text-ink">
              28 days
            </p>
            <div className="mt-3 flex gap-1">
              {Array.from({ length: 14 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-5 flex-1 rounded-sm ${
                    i < 12 ? "bg-brand" : "bg-brand/20"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

function DashPanel({
  title,
  value,
  delta,
  tone,
  bars,
}: {
  title: string;
  value: string;
  delta: string;
  tone: "brand" | "gold";
  bars: number[];
}) {
  const isBrand = tone === "brand";
  return (
    <div className="rounded-2xl border border-ink/8 bg-white p-4">
      <p className="text-[12px] uppercase tracking-[0.18em] text-muted-ink">
        {title}
      </p>
      <div className="mt-2 flex items-end justify-between">
        <p className="font-display text-[28px] font-semibold text-ink">
          {value}
        </p>
        <span className={`text-[12px] ${isBrand ? "text-brand" : "text-gold"}`}>
          {delta}
        </span>
      </div>
      <div className="mt-4 flex items-end gap-1 h-14">
        {bars.map((h, i) => (
          <span
            key={i}
            style={{ height: `${h}%` }}
            className={`flex-1 rounded-sm ${
              isBrand ? "bg-brand/80" : "bg-gold/70"
            } ${i === bars.length - 1 ? "opacity-100" : "opacity-70"}`}
          />
        ))}
      </div>
    </div>
  );
}
