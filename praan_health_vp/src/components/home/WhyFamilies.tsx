"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { fadeUp, stagger } from "@/lib/motion";
import { whyFamilies } from "@/content/home";

export function WhyFamilies() {
  return (
    <section className="relative py-24 md:py-36 bg-ivory-warm/60">
      <Container className="grid gap-14 md:grid-cols-[1fr_1.1fr] md:items-center">
        {/* Left — emotional visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-4/5 w-full overflow-hidden rounded-[32px] bg-brand-soft"
        >
          <Image
            src="/img-family-update.png"
            alt="Family staying connected through Praan"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 45vw"
          />
          {/* soft warm overlay */}
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-brand-soft/60 via-transparent to-transparent"
          />
          <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-ink/5 bg-white/85 px-5 py-4 backdrop-blur">
            <p className="text-[13px] uppercase tracking-[0.2em] text-muted-ink">
              The quiet gap
            </p>
            <p className="mt-2 font-display text-[20px] font-semibold text-ink leading-snug">
              The distance between noticing and doing.
            </p>
          </div>
        </motion.div>

        {/* Right — problem → resolve */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <Eyebrow>{whyFamilies.eyebrow}</Eyebrow>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="font-display mt-5 text-[34px] md:text-[54px] font-semibold tracking-tight text-ink leading-[1.05]"
          >
            {whyFamilies.title}
          </motion.h2>

          <motion.ul variants={stagger} className="mt-10 space-y-3.5">
            {whyFamilies.problems.map((p) => (
              <motion.li
                key={p}
                variants={fadeUp}
                className="group flex items-center gap-4 border-b border-ink/10 pb-3.5"
              >
                <span className="inline-flex size-6 items-center justify-center rounded-full border border-ink/20 text-ink/40 text-xs">
                  ×
                </span>
                <span className="text-[16px] md:text-[18px] text-ink/70 line-through decoration-ink/25 decoration-1">
                  {p}
                </span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            variants={fadeUp}
            className="mt-10 rounded-[24px] border border-brand/15 bg-brand-soft p-6 md:p-7"
          >
            <div className="flex items-start gap-4">
              <span className="mt-1 inline-flex size-9 items-center justify-center rounded-full bg-brand text-ivory">
                <Check className="size-4" />
              </span>
              <div>
                <h3 className="font-display text-[22px] md:text-[26px] font-semibold tracking-tight text-brand">
                  {whyFamilies.resolve.title}
                </h3>
                <p className="mt-2 text-[15px] md:text-[16px] text-ink/75 leading-relaxed">
                  {whyFamilies.resolve.body}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
