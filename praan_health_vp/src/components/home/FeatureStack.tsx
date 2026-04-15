"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Container } from "@/components/ui/container";
import { features } from "@/content/home";

/* ─── Layout constants ───────────────────────────────────────────────── */
/** How many vh of scroll each card gets before the next one takes over */
const SCROLL_PER_CARD = 100; // vh units
/** Where the stack visually pins (from top of viewport) */
const STACK_TOP_VH = 12;
/** Max scale-down for a card that's buried N cards deep */
const SCALE_PER_DEPTH = 0.04;
/** Y offset (px) per depth level — stacked cards peek slightly */
const Y_PER_DEPTH = -14;

/* ─── Per-feature visual config ─────────────────────────────────────── */
type VisualCfg = {
  image: string | null;
  isDark: boolean;
  cardBg: string;
  tagBg: string;
  illuStroke: string;
};

const VISUALS: VisualCfg[] = [
  {
    image: "/img-doctor-assessment.png",
    isDark: false,
    cardBg: "bg-ivory-soft",
    tagBg: "bg-brand text-ivory",
    illuStroke: "#dc4b32",
  },
  {
    image: "/img-care-plan.png",
    isDark: true,
    cardBg: "bg-brand",
    tagBg: "bg-gold/25 text-gold border border-gold/30",
    illuStroke: "#ffffff",
  },
  {
    image: "/img-progress-track.png",
    isDark: false,
    cardBg: "bg-ivory-soft",
    tagBg: "bg-brand text-ivory",
    illuStroke: "#dc4b32",
  },
  {
    image: "/img-family-update.png",
    isDark: true,
    cardBg: "bg-[#1a1410]",
    tagBg: "bg-gold/25 text-gold border border-gold/30",
    illuStroke: "#c9a227",
  },
  {
    image: "/img-nri-update.png",
    isDark: true,
    cardBg: "bg-brand",
    tagBg: "bg-white/20 text-white border border-white/25",
    illuStroke: "#ffffff",
  },
];

/* ─── Tiny SVG kicker icons ─────────────────────────────────────────── */
function KickerIcon({ index, stroke }: { index: number; stroke: string }) {
  const s = stroke;
  const icons = [
    // 01 stethoscope
    <svg key={0} width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="11" stroke={s} strokeWidth="1.3" strokeDasharray="3 2" opacity="0.45"/>
      <path d="M9 10c0 3.5 5 5.5 5 9.5m0-9.5c0 3.5-5 5.5-5 9.5" stroke={s} strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
      <circle cx="14" cy="19.5" r="2" fill={s} opacity="0.55"/>
    </svg>,
    // 02 document
    <svg key={1} width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="5" y="3" width="18" height="22" rx="3" stroke={s} strokeWidth="1.3" opacity="0.45"/>
      <line x1="9" y1="10" x2="19" y2="10" stroke={s} strokeWidth="1.6" strokeLinecap="round" opacity="0.7"/>
      <line x1="9" y1="14" x2="19" y2="14" stroke={s} strokeWidth="1.6" strokeLinecap="round" opacity="0.7"/>
      <line x1="9" y1="18" x2="14" y2="18" stroke={s} strokeWidth="1.6" strokeLinecap="round" opacity="0.5"/>
    </svg>,
    // 03 play/live
    <svg key={2} width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="3" y="7" width="22" height="14" rx="4" stroke={s} strokeWidth="1.3" opacity="0.45"/>
      <polygon points="12,11 20,14 12,17" fill={s} opacity="0.65"/>
    </svg>,
    // 04 bar chart
    <svg key={3} width="28" height="28" viewBox="0 0 28 28" fill="none">
      <line x1="3" y1="24" x2="25" y2="24" stroke={s} strokeWidth="1.3" strokeLinecap="round" opacity="0.4"/>
      <rect x="5" y="13" width="4" height="11" rx="1.5" fill={s} opacity="0.35"/>
      <rect x="12" y="8" width="4" height="16" rx="1.5" fill={s} opacity="0.6"/>
      <rect x="19" y="16" width="4" height="8" rx="1.5" fill={s} opacity="0.8"/>
    </svg>,
    // 05 globe
    <svg key={4} width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="10" stroke={s} strokeWidth="1.3" opacity="0.45"/>
      <ellipse cx="14" cy="14" rx="4.5" ry="10" stroke={s} strokeWidth="1.3" opacity="0.45"/>
      <line x1="4" y1="14" x2="24" y2="14" stroke={s} strokeWidth="1.3" strokeLinecap="round" opacity="0.45"/>
    </svg>,
  ];
  return icons[index] ?? icons[0];
}

/* ─── Gradient illustration for image-less cards ────────────────────── */
function CardArtwork({ index, isDark }: { index: number; isDark: boolean }) {
  if (index === 1) {
    return (
      <div className="relative h-48 w-full overflow-hidden rounded-t-[27px]">
        <div className="absolute inset-0 bg-linear-to-br from-brand-dark via-brand to-[#e06040]" />
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 200" preserveAspectRatio="xMidYMid slice">
          <rect x="80" y="28" width="320" height="144" rx="14" fill="none" stroke="white" strokeWidth="1.2" opacity="0.18"/>
          <line x1="112" y1="62" x2="368" y2="62" stroke="white" strokeWidth="1.4" opacity="0.25"/>
          <line x1="112" y1="86" x2="300" y2="86" stroke="white" strokeWidth="1.4" opacity="0.2"/>
          <line x1="112" y1="110" x2="340" y2="110" stroke="white" strokeWidth="1.4" opacity="0.18"/>
          <line x1="112" y1="134" x2="250" y2="134" stroke="white" strokeWidth="1.4" opacity="0.15"/>
          <circle cx="96" cy="62" r="5" fill="white" opacity="0.3"/>
          <circle cx="96" cy="86" r="5" fill="white" opacity="0.3"/>
          <circle cx="96" cy="110" r="5" fill="white" opacity="0.25"/>
          <circle cx="96" cy="134" r="5" fill="white" opacity="0.2"/>
        </svg>
        <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-1.5 w-24 rounded-full bg-white/30"/>
            <div className="h-1.5 w-36 rounded-full bg-white/18"/>
          </div>
          <span className="rounded-lg border border-gold/50 bg-gold/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-gold backdrop-blur">
            Your Plan
          </span>
        </div>
      </div>
    );
  }
  if (index === 4) {
    return (
      <div className="relative h-48 w-full overflow-hidden rounded-t-[27px]">
        <div className="absolute inset-0 bg-linear-to-br from-[#c93c20] via-brand to-[#a82e14]" />
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 200" preserveAspectRatio="xMidYMid slice">
          <circle cx="240" cy="100" r="75" fill="none" stroke="white" strokeWidth="1.2" opacity="0.18"/>
          <ellipse cx="240" cy="100" rx="35" ry="75" fill="none" stroke="white" strokeWidth="1.2" opacity="0.15"/>
          <line x1="165" y1="100" x2="315" y2="100" stroke="white" strokeWidth="1.2" opacity="0.2"/>
          <line x1="172" y1="72" x2="308" y2="72" stroke="white" strokeWidth="1" opacity="0.12"/>
          <line x1="172" y1="128" x2="308" y2="128" stroke="white" strokeWidth="1" opacity="0.12"/>
          <circle cx="100" cy="60" r="16" fill="white" opacity="0.08"/>
          <circle cx="380" cy="140" r="22" fill="white" opacity="0.06"/>
        </svg>
        <div className="absolute bottom-4 left-6 right-6 flex gap-2">
          {["London", "SF", "Mumbai"].map((c) => (
            <div key={c} className="flex-1 rounded-lg border border-white/20 bg-white/12 px-2 py-1.5 text-center backdrop-blur">
              <p className="text-[9px] uppercase tracking-[0.12em] text-white/55">{c}</p>
              <p className="mt-0.5 text-[11px] font-medium text-white">✓</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

/* ─── Single card (pure visual, no motion here — motion applied by parent) ── */
function FeatureCardInner({
  feature,
  visual,
  index,
  isActive,
}: {
  feature: (typeof features)[number];
  visual: VisualCfg;
  index: number;
  isActive: boolean;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-[28px] border shadow-[0_12px_56px_-16px_rgba(0,0,0,0.22)] ${
        visual.isDark ? "border-white/10" : "border-ink/8"
      } ${visual.cardBg}`}
    >
      {/* Active highlight ring */}
      {isActive && (
        <motion.div
          layoutId="card-ring"
          className="pointer-events-none absolute inset-0 z-10 rounded-[28px] ring-2 ring-brand/50"
        />
      )}

      {/* Top media: real photo or illustrated artwork */}
      {visual.image ? (
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={visual.image}
            alt={feature.title}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 52vw"
          />
          <div
            className={`absolute inset-0 bg-linear-to-t ${
              visual.isDark ? "from-premium-black" : "from-ivory-soft"
            } via-transparent to-transparent`}
          />
          {/* Tag pill floated top-right on photo */}
          <span
            className={`absolute right-4 top-4 inline-flex items-center rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.18em] backdrop-blur-sm ${visual.tagBg}`}
          >
            {feature.tag}
          </span>
        </div>
      ) : (
        <CardArtwork index={index} isDark={visual.isDark} />
      )}

      {/* Text content */}
      <div className="relative z-10 flex flex-col gap-4 px-7 pb-8 pt-6">
        {/* Kicker row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <KickerIcon index={index} stroke={visual.illuStroke} />
            <span
              className={`text-[11px] uppercase tracking-[0.24em] font-medium ${
                visual.isDark ? "text-white/40" : "text-muted-ink"
              }`}
            >
              {feature.kicker} · Feature
            </span>
          </div>
          {/* Tag badge for artwork cards (no photo) */}
          {!visual.image && (
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em] ${visual.tagBg}`}
            >
              {feature.tag}
            </span>
          )}
        </div>

        {/* Headline */}
        <h3
          className={`font-display text-[28px] md:text-[34px] font-semibold tracking-tight leading-[1.1] ${
            visual.isDark ? "text-white" : "text-ink"
          }`}
        >
          {feature.title}
        </h3>

        {/* Body */}
        <p
          className={`text-[15px] md:text-[16px] leading-relaxed max-w-115 ${
            visual.isDark ? "text-white/62" : "text-muted-ink"
          }`}
        >
          {feature.description}
        </p>

        {/* Bottom pill for light/photo cards */}
        {!visual.isDark && visual.image && (
          <span
            className={`mt-1 inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em] font-medium ${visual.tagBg}`}
          >
            {feature.tag}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Main exported section ───────────────────────────────────────────── */
export function FeatureStack() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* Track which card is currently centred in viewport */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIndex(i); },
        { rootMargin: "-35% 0px -35% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToCard = (i: number) =>
    cardRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative bg-ivory"
      style={{ paddingBottom: "12vh" }}
    >
      {/* Ambient blobs */}
      <div aria-hidden className="pointer-events-none absolute -top-32 right-0 size-125 rounded-full bg-brand/4 blur-[90px]" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 -left-32 size-100 rounded-full bg-gold/5 blur-[90px]" />

      <Container>
        <div className="grid gap-16 md:gap-0 md:grid-cols-[1fr_1.25fr] md:items-start">

          {/* ══ LEFT — sticky text + nav ════════════════════════════ */}
          <div
            className="md:sticky md:self-start"
            style={{ top: "96px" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Eyebrow tone="brand">The Praan system</Eyebrow>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display mt-5 text-[36px] md:text-[54px] font-semibold tracking-tight text-ink leading-[1.04]"
            >
              Five pieces.
              <br />
              <span className="text-brand">One plan.</span>
              <br />
              Built to last.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 max-w-95 text-[15px] md:text-[16px] text-muted-ink leading-relaxed"
            >
              Every program at Praan is built on the same care stack — so nothing
              falls through the cracks while you&apos;re at work or a continent away.
            </motion.p>

            {/* Numbered feature nav */}
            <motion.nav
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col"
              aria-label="Feature navigation"
            >
              {features.map((f, i) => {
                const active = i === activeIndex;
                return (
                  <button
                    key={f.kicker}
                    id={`feat-nav-${i}`}
                    onClick={() => scrollToCard(i)}
                    className={`group relative flex items-center gap-4 rounded-xl px-4 py-3 text-left transition-all duration-300 ${
                      active ? "bg-brand/8" : "hover:bg-ink/4"
                    }`}
                  >
                    {/* Left indicator bar */}
                    <span
                      className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-brand transition-all duration-300 ${
                        active ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <span
                      className={`w-6 shrink-0 font-mono text-[12px] tabular-nums transition-colors duration-300 ${
                        active ? "font-bold text-brand" : "text-muted-ink"
                      }`}
                    >
                      {f.kicker}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`text-[14px] md:text-[15px] font-medium leading-snug transition-colors duration-300 ${
                          active ? "text-ink" : "text-muted-ink group-hover:text-ink"
                        }`}
                      >
                        {f.title}
                      </p>
                      <AnimatePresence>
                        {active && (
                          <motion.p
                            key="sub"
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: "auto", marginTop: 2 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.22 }}
                            className="overflow-hidden text-[12px] text-brand"
                          >
                            {f.tag}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                );
              })}
            </motion.nav>
          </div>

          {/* ══ RIGHT — stacking cards ══════════════════════════════ */}
          {/*
            Each card wrapper gets enough margin-bottom to create scroll distance.
            The card itself is NOT sticky — instead we rely on each card coming into
            view sequentially. On top of that, buried cards are visually scaled-down
            using framer-motion animate driven by activeIndex state.
            This approach works with Lenis smooth scroll (no CSS sticky needed).
          */}
          <div className="md:pl-10 pt-24 md:pt-28 pb-8">
            <div className="relative flex flex-col">
              {features.map((f, i) => {
                const depth = activeIndex > i ? activeIndex - i : 0;
                // Cards that have been "scrolled past" shrink slightly to show stack depth
                const scale = 1 - depth * SCALE_PER_DEPTH;
                const ty = depth * Y_PER_DEPTH;

                return (
                  <div
                    key={f.kicker}
                    ref={(el) => { cardRefs.current[i] = el; }}
                    className="relative"
                    /* Give each card enough spacing so user has to scroll to reach next */
                    style={{ marginBottom: i < features.length - 1 ? "clamp(32px, 6vh, 56px)" : 0 }}
                  >
                    <motion.div
                      animate={{ scale, y: ty }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      style={{ transformOrigin: "top center" }}
                    >
                      <FeatureCardInner
                        feature={f}
                        visual={VISUALS[i]}
                        index={i}
                        isActive={i === activeIndex}
                      />
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
