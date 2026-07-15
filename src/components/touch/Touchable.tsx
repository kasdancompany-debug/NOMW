"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { useState, type ReactNode } from "react";
import { pressDepthTap, pressTransition, softPressTap } from "@/lib/motion/touch";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";

type TouchableProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children: ReactNode;
  /** firmer press for primary CTAs */
  firm?: boolean;
  soft?: boolean;
  /** Soft glow bloom on press (not hover) */
  glow?: boolean;
};

/**
 * Reusable touch target: immediate press depth + scale, optional glow.
 * No hover dependency — feedback is pointer/touch driven.
 */
export function Touchable({
  children,
  className,
  disabled,
  firm = false,
  soft = false,
  glow = false,
  type = "button",
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  ...props
}: TouchableProps) {
  const reducedMotion = useReducedMotion();
  const [pressed, setPressed] = useState(false);

  const tap = soft
    ? softPressTap(reducedMotion)
    : pressDepthTap(reducedMotion, firm);

  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileTap={disabled ? undefined : tap}
      transition={pressTransition(reducedMotion)}
      onPointerDown={(event) => {
        if (!disabled) setPressed(true);
        onPointerDown?.(event);
      }}
      onPointerUp={(event) => {
        setPressed(false);
        onPointerUp?.(event);
      }}
      onPointerCancel={(event) => {
        setPressed(false);
        onPointerCancel?.(event);
      }}
      className={cn(
        "touch-target relative inline-flex items-center justify-center",
        "select-none touch-manipulation",
        "transition-[box-shadow,background-color,filter] duration-150 ease-out",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]",
        glow &&
          pressed &&
          !reducedMotion &&
          "shadow-[0_0_0_1px_rgba(212,176,122,0.35),0_0_28px_rgba(212,176,122,0.22)]",
        disabled && "cursor-not-allowed opacity-40",
        className,
      )}
      data-pressed={pressed ? "true" : undefined}
      {...props}
    >
      {children}
      {glow && pressed && !reducedMotion ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[rgba(212,176,122,0.1)]"
        />
      ) : null}
    </motion.button>
  );
}
