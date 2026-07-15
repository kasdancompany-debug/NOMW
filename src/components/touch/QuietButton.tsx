"use client";

import { type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { Touchable } from "@/components/touch/Touchable";
import { cn } from "@/utils/cn";

type QuietButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children: ReactNode;
};

/**
 * Low-emphasis control — still ≥64px; soft press, no hover-only cues.
 */
export function QuietButton({
  children,
  className,
  disabled,
  type = "button",
  ...props
}: QuietButtonProps) {
  return (
    <Touchable
      type={type}
      disabled={disabled}
      soft
      className={cn(
        "rounded-[var(--radius-xs)] px-[var(--space-5)] py-[var(--space-3)]",
        "font-[family-name:var(--font-ui)] text-[length:var(--text-body)]",
        "tracking-[var(--tracking-title)] text-[var(--text-on-dark)]",
        "underline underline-offset-8 decoration-white/25",
        "active:text-[var(--color-museum-warm)] active:decoration-[var(--color-museum-warm)]",
        disabled && "cursor-not-allowed opacity-40",
        className,
      )}
      {...props}
    >
      {children}
    </Touchable>
  );
}
