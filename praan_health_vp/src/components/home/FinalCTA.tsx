"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { BookingButton } from "@/components/booking/BookingButton";
import { fadeUp, stagger } from "@/lib/motion";
import { finalCta } from "@/content/home";
import { site } from "@/content/site";

export function FinalCTA() {
  return (
    <section id="book" className="relative overflow-hidden bg-brand text-ivory py-28 md:py-40">
      {/* ambient gold glow */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_30%,rgba(201,162,39,0.18),transparent_70%),radial-gradient(50%_60%_at_100%_100%,rgba(250,249,247,0.08),transparent_60%)]"
      />
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={stagger}
          className="mx-auto max-w-225 text-center"
        >
          <motion.p
            variants={fadeUp}
            className="text-[12px] uppercase tracking-[0.25em] text-gold"
          >
            Your turn
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="font-display mt-6 text-[40px] md:text-[88px] font-semibold tracking-tight leading-[1.02]"
          >
            {finalCta.title}
            <br />
            <span className="text-gold">{finalCta.subtitle}</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-6 mx-auto max-w-135 text-[16px] md:text-[18px] text-ivory/75"
          >
            {finalCta.body}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <BookingButton variant="ivory" size="pillLg">
              {site.booking.primary}
              <ArrowRight className="size-4" />
            </BookingButton>
            <Button
              asChild
              size="pillLg"
              className="bg-transparent text-ivory border border-ivory/30 hover:bg-ivory/10"
            >
              <Link href="#programs">Explore programs</Link>
            </Button>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-8 text-[13px] text-ivory/60"
          >
            Free · 30-minute call · No commitment
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}
