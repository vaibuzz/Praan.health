"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { fadeUp, stagger } from "@/lib/motion";
import { testimonials } from "@/content/home";

export function TestimonialsReel() {
  // Duplicate for seamless marquee
  const reel = [...testimonials, ...testimonials];

  return (
    <section className="relative overflow-hidden py-24 md:py-36 bg-ivory">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={stagger}
          className="max-w-180"
        >
          <motion.div variants={fadeUp}>
            <Eyebrow>Real families</Eyebrow>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-display mt-5 text-[34px] md:text-[56px] font-semibold tracking-tight leading-[1.05] text-ink"
          >
            Peace of mind, in their own words.
          </motion.h2>
        </motion.div>
      </Container>

      {/* Marquee */}
      <div
        className="relative mt-14 md:mt-20 mask-[linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]"
      >
        <motion.div
          className="flex gap-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 60, ease: "linear", repeat: Infinity }}
        >
          {reel.map((t, i) => (
            <article
              key={`${t.name}-${i}`}
              className="flex w-[320px] md:w-105 shrink-0 flex-col justify-between rounded-[24px] border border-ink/8 bg-white p-6 md:p-8 shadow-[0_12px_30px_-18px_rgba(17,17,17,0.12)]"
            >
              <Quote className="size-6 text-brand/60" />
              <p className="mt-4 font-display text-[18px] md:text-[22px] leading-snug text-ink">
                "{t.quote}"
              </p>
              <div className="mt-8 flex items-center gap-3 border-t border-ink/5 pt-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-brand/10 font-display text-[15px] font-semibold text-brand">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-ink">{t.name}</p>
                  <p className="text-[12px] text-muted-ink">{t.role}</p>
                </div>
                <span className="ml-auto text-right text-[11px] uppercase tracking-[0.18em] text-gold">
                  {t.parent}
                </span>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
