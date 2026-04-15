import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "brand" | "gold" | "ink";
};

const tones = {
  brand: "text-brand border-brand/20 bg-brand/5",
  gold: "text-gold border-gold/30 bg-gold/5",
  ink: "text-ink border-ink/15 bg-ink/5",
};

export function Eyebrow({ tone = "brand", className, children, ...rest }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em]",
        tones[tone],
        className,
      )}
      {...rest}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          tone === "brand" && "bg-brand",
          tone === "gold" && "bg-gold",
          tone === "ink" && "bg-ink",
        )}
      />
      {children}
    </span>
  );
}
