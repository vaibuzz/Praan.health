"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, animate } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  to: number;
  from?: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  format?: (n: number) => string;
  className?: string;
};

export function Counter({
  to,
  from = 0,
  duration = 2,
  suffix = "",
  prefix = "",
  format,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const mv = useMotionValue(from);
  const [display, setDisplay] = useState<string>(
    format ? format(from) : from.toLocaleString("en-IN"),
  );

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(v) {
        const rounded = Math.round(v);
        setDisplay(format ? format(rounded) : rounded.toLocaleString("en-IN"));
      },
    });
    return () => controls.stop();
  }, [inView, to, duration, mv, format]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
