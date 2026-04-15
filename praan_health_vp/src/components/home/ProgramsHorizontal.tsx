"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { programs } from "@/content/home";

export function ProgramsHorizontal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Translate the horizontal row so all cards pass through the viewport.
  // We translate by a percentage of the track's own width.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-78%"]);

  return (
    <section
      id="programs"
      ref={sectionRef}
      className="relative bg-ivory"
      style={{ height: `${programs.length * 80}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden pt-16 pb-10 md:pt-24">
        <Container className="mb-10 md:mb-14 flex items-end justify-between gap-6">
          <div>
            <Eyebrow>Programs</Eyebrow>
            <h2 className="font-display mt-5 text-[32px] md:text-[52px] font-semibold tracking-tight text-ink leading-[1.05] max-w-160">
              Pick what your parents actually need.
            </h2>
          </div>
          <p className="hidden md:block max-w-75 text-[14px] text-muted-ink">
            Each program is led by a dedicated doctor and built into a daily
            routine — not a PDF.
          </p>
        </Container>

        <div className="relative flex-1">
          <motion.div
            style={{ x }}
            className="flex h-full items-center gap-6 md:gap-8 pl-6 md:pl-10 pr-[20vw]"
          >
            {programs.map((p, i) => (
              <ProgramCard key={p.slug} program={p} index={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ProgramCard({
  program,
  index,
}: {
  program: (typeof programs)[number];
  index: number;
}) {
  const accent = program.accent === "gold" ? "gold" : "brand";
  const isBrand = accent === "brand";

  return (
    <div
      className={`relative flex h-[72vh] w-[78vw] md:w-120 shrink-0 flex-col justify-between rounded-[32px] p-7 md:p-9 transition-transform ${
        isBrand
          ? "bg-brand text-ivory"
          : "bg-white border border-ink/5 text-ink"
      }`}
      style={{
        boxShadow: isBrand
          ? "0 30px 80px -30px rgba(13,92,74,0.5)"
          : "0 20px 50px -20px rgba(17,17,17,0.12)",
      }}
    >
      <div>
        <span
          className={`text-[11px] uppercase tracking-[0.25em] ${
            isBrand ? "text-ivory/60" : "text-muted-ink"
          }`}
        >
          Program · 0{index + 1}
        </span>
        <h3 className="font-display mt-5 text-[30px] md:text-[40px] font-semibold tracking-tight leading-[1.05]">
          {program.name}
        </h3>
        <p
          className={`mt-4 max-w-90 text-[15px] md:text-[16px] leading-relaxed ${
            isBrand ? "text-ivory/75" : "text-muted-ink"
          }`}
        >
          {program.blurb}
        </p>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <span
          className={`text-[13px] ${
            isBrand ? "text-ivory/70" : "text-ink/60"
          }`}
        >
          Learn more
        </span>
        <span
          className={`inline-flex size-11 items-center justify-center rounded-full ${
            isBrand
              ? "bg-ivory text-brand"
              : "bg-brand text-ivory"
          }`}
        >
          <ArrowUpRight className="size-5" />
        </span>
      </div>

      {/* decorative corner */}
      <div
        aria-hidden
        className={`absolute right-6 top-6 size-14 rounded-full border ${
          isBrand ? "border-ivory/20" : "border-brand/20"
        }`}
      />
    </div>
  );
}
