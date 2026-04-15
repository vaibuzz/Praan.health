"use client";

import { useRef } from "react";
import type { MotionValue } from "framer-motion";
import { motion, useScroll, useTransform } from "framer-motion";
import { emotional } from "@/content/home";

export function EmotionalScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const lines = emotional.lines;
  const total = lines.length + 1; // +1 for resolve
  const step = 1 / total;

  // Background fade to premium black as we near the resolve
  const bg = useTransform(
    scrollYProgress,
    [0, 0.75, 1],
    ["#faf9f7", "#1a1a1a", "#0b0b0b"],
  );
  const fg = useTransform(
    scrollYProgress,
    [0, 0.75, 1],
    ["#111111", "#faf9f7", "#faf9f7"],
  );

  return (
    <motion.section
      ref={sectionRef}
      style={{ backgroundColor: bg, color: fg }}
      className="relative"
    >
      <div style={{ height: `${(lines.length + 1) * 100}vh` }}>
        <div className="sticky top-0 flex h-screen items-center justify-center px-6 text-center">
          <div className="relative w-full max-w-225">
            {lines.map((line, i) => (
              <EmotionalLine
                key={line}
                line={line}
                index={i}
                step={step}
                progress={scrollYProgress}
              />
            ))}
            <ResolveLine
              text={emotional.resolve}
              start={lines.length * step}
              progress={scrollYProgress}
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function EmotionalLine({
  line,
  index,
  step,
  progress,
}: {
  line: string;
  index: number;
  step: number;
  progress: MotionValue<number>;
}) {
  const start = index * step;
  const peak = start + step * 0.5;
  const end = start + step;
  const opacity = useTransform(progress, [start, peak, end], [0, 1, 0]);
  const y = useTransform(progress, [start, peak, end], [40, 0, -40]);

  return (
    <motion.p
      style={{ opacity, y }}
      className="font-display absolute inset-0 m-auto flex items-center justify-center text-[34px] font-semibold tracking-tight md:text-[64px] lg:text-[80px] leading-[1.05]"
    >
      {line}
    </motion.p>
  );
}

function ResolveLine({
  text,
  start,
  progress,
}: {
  text: string;
  start: number;
  progress: MotionValue<number>;
}) {
  const peak = start + (1 - start) * 0.4;
  const opacity = useTransform(progress, [start, peak, 1], [0, 1, 1]);
  const scale = useTransform(progress, [start, peak, 1], [0.94, 1, 1.02]);

  return (
    <motion.div
      style={{ opacity, scale }}
      className="absolute inset-0 m-auto flex flex-col items-center justify-center gap-4"
    >
      <span className="text-[11px] uppercase tracking-[0.25em] text-gold">
        Praan
      </span>
      <p className="font-display text-[40px] font-semibold tracking-tight md:text-[80px] lg:text-[104px] leading-[1.02]">
        {text}
      </p>
    </motion.div>
  );
}
