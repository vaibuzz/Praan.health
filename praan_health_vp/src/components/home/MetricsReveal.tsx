"use client";

import { motion } from "framer-motion";
import { Counter } from "@/components/animated/Counter";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { fadeUp, stagger } from "@/lib/motion";
import { metrics } from "@/content/home";

export function MetricsReveal() {
  return (
    <section
      id="metrics"
      className="relative overflow-hidden bg-premium-black text-ivory py-24 md:py-36"
    >
      {/* soft gradient & grain */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,122,58,0.45),transparent_70%),radial-gradient(40%_40%_at_100%_100%,rgba(255,168,76,0.18),transparent_60%)]"
      />

      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={stagger}
          className="mx-auto max-w-[820px] text-center"
        >
          <motion.div variants={fadeUp} className="flex justify-center">
            <Eyebrow tone="gold">The outcomes</Eyebrow>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-display mt-6 text-[36px] md:text-[64px] font-semibold tracking-tight leading-[1.05]"
          >
            Proof, not promises.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-5 text-[16px] md:text-[18px] text-ivory/70"
          >
            Every number below is from members under active care. No vanity
            metrics, no rounded-up claims.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={stagger}
          className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-y-12 md:gap-y-0"
        >
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              variants={fadeUp}
              className={`relative px-4 md:px-8 text-center ${
                i > 0 ? "md:border-l md:border-ivory/10" : ""
              }`}
            >
              <div className="font-display text-[44px] md:text-[72px] font-semibold tracking-tight leading-none">
                <Counter
                  to={m.value}
                  suffix={m.suffix}
                  duration={2.2}
                  format={
                    "decimals" in m && m.decimals
                      ? (n) =>
                          (n / Math.pow(10, m.decimals!)).toFixed(m.decimals!)
                      : undefined
                  }
                />
              </div>
              <div className="mt-3 h-px w-10 mx-auto bg-gold/60" />
              <p className="mt-4 text-[13px] md:text-[14px] uppercase tracking-[0.18em] text-ivory/60">
                {m.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
