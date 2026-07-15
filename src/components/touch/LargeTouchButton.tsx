"use client";

import type { HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { Touchable } from "@/components/touch/Touchable";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { pressTransition } from "@/lib/motion/touch";
import { cn } from "@/utils/cn";

type LargeTouchButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

/**
 * Primary museum CTA. Immediate press depth + glow — no hover dependency.
 */
export function LargeTouchButton({
  children,
  className,
  variant = "primary",
  disabled,
  type = "button",
  ...props
}: LargeTouchButtonProps) {
  const reducedMotion = useReducedMotion();

  return (
    <Touchable
      type={type}
      disabled={disabled}
      firm={variant === "primary"}
      glow={variant === "primary"}
      transition={pressTransition(reducedMotion)}
      className={cn(
        "touch-target-md gap-[var(--space-3)]",
        "rounded-[var(--radius-sm)] px-[var(--space-8)] py-[var(--space-5)]",
        "font-[family-name:var(--font-ui)] text-[length:var(--text-lead)]",
        "font-[number:var(--font-weight-medium)] tracking-[var(--tracking-title)]",
        "transition-[background,box-shadow,color,border-color] duration-[var(--duration-fast)] ease-[var(--ease-out)]",
        variant === "primary" &&
          "bg-[var(--color-museum-warm)] text-[var(--text-on-accent)] shadow-[var(--elevation-glow-warm)]",
        variant === "secondary" &&
          "border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-on-dark)] backdrop-blur-[var(--glass-blur)]",
        disabled && "cursor-not-allowed opacity-40",
        className,
      )}
      {...props}
    >
      {children}
    </Touchable>
  );
}
