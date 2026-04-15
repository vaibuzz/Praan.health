import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType;
  size?: "default" | "narrow" | "wide";
};

const sizes = {
  narrow: "max-w-[960px]",
  default: "max-w-[1280px]",
  wide: "max-w-[1440px]",
};

export function Container({
  as: Comp = "div",
  size = "default",
  className,
  children,
  ...rest
}: Props) {
  return (
    <Comp
      className={cn("mx-auto w-full px-6 md:px-10", sizes[size], className)}
      {...rest}
    >
      {children}
    </Comp>
  );
}
