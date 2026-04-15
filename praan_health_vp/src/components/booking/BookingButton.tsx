"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useBooking } from "./BookingProvider";

type ButtonProps = React.ComponentProps<typeof Button>;

/**
 * A drop-in replacement for any CTA that should open the booking dialog.
 * Forwards every Button prop so variants, sizes, and classNames work the same.
 */
export function BookingButton({
  onClick,
  children,
  ...rest
}: ButtonProps) {
  const { open } = useBooking();
  return (
    <Button
      type="button"
      onClick={(e) => {
        onClick?.(e);
        open();
      }}
      {...rest}
    >
      {children}
    </Button>
  );
}
