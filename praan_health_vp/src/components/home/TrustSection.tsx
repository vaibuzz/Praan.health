"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { fadeUp, stagger } from "@/lib/motion";
import { doctors, press } from "@/content/home";

/* Map each doctor (by index) to their portrait filename */
const DOCTOR_IMAGES = [
  "/img-doctor-arjun.png",
  "/img-doctor-kavya.png",
  "/img-nutritionist-tanvi1.jpg",
];

/* Subtle hover-lift badge colours alternating brand / gold */
const BADGE_TONES = [
  { badge: "bg-brand text-ivory", num: "text-ivory" },
  { badge: "bg-gold text-ink", num: "text-ink" },
  { badge: "bg-brand text-ivory", num: "text-ivory" },
];

export function TrustSection() {
  return (
    <section id="trust" className="relative bg-ivory-warm/40 py-24 md:py-36">
      <Container>
        {/* ── Heading block ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={stagger}
          className="max-w-[680px]"
        >
          <motion.div variants={fadeUp}>
            <Eyebrow>Clinical backbone</Eyebrow>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-display mt-5 text-[34px] md:text-[56px] font-semibold tracking-tight leading-[1.05] text-ink"
          >
            A real team of doctors
            <br />
            behind every plan.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-5 text-[16px] md:text-[18px] text-muted-ink"
          >
            No shortcuts. Every Praan member is backed by practising clinicians
            and certified specialists.
          </motion.p>
        </motion.div>

        {/* ── Doctor portrait cards ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={stagger}
          className="mt-14 grid gap-6 md:grid-cols-3"
        >
          {doctors.map((d, i) => {
            const tone = BADGE_TONES[i];
            const imgSrc = DOCTOR_IMAGES[i];
            return (
              <motion.article
                key={d.name}
                variants={fadeUp}
                className="group relative overflow-hidden rounded-[28px] border border-ink/8 bg-white shadow-[0_4px_24px_-8px_rgba(26,23,20,0.08)] transition-shadow duration-300 hover:shadow-[0_12px_40px_-12px_rgba(26,23,20,0.16)]"
              >
                {/* Portrait photo */}
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={imgSrc}
                    alt={`Portrait of ${d.name}`}
                    fill
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />

                  {/* Bottom-up gradient for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714]/70 via-[#1a1714]/10 to-transparent" />

                  {/* Numbered badge — top-left */}
                  <span
                    className={`absolute left-4 top-4 inline-flex size-9 items-center justify-center rounded-full text-[13px] font-bold shadow-sm ${tone.badge}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Name + role pinned at bottom of photo */}
                  <div className="absolute bottom-0 inset-x-0 px-5 pb-5">
                    <p className="font-display text-[20px] font-semibold text-white leading-tight">
                      {d.name}
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/70">
                      {d.role.split("·")[0].trim()}
                    </p>
                  </div>
                </div>

                {/* Bio text below the photo */}
                <div className="px-6 py-5">
                  {/* credential pill */}
                  <span className="inline-flex items-center rounded-full bg-brand/8 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-brand font-medium">
                    {d.role.includes("·")
                      ? d.role.split("·")[1]?.trim()
                      : d.role}
                  </span>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted-ink">
                    {d.bio}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        {/* ── Press logos ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 border-t border-ink/10 pt-10"
        >
          <p className="text-center text-[11px] uppercase tracking-[0.25em] text-muted-ink">
            Featured in
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {press.map((p) => (
              <span
                key={p}
                className="font-display text-[18px] font-semibold tracking-tight text-ink/40 transition-colors hover:text-ink/60"
              >
                {p}
              </span>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
