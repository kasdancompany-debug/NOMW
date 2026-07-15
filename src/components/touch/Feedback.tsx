"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import {
  incorrectShakeVariants,
  revealVariants,
  successVariants,
  touchTiming,
} from "@/lib/motion/touch";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";

type SoftSuccessProps = {
  active: boolean;
  className?: string;
  children?: ReactNode;
};

/** Soft scale bloom — success without fireworks. */
export function SoftSuccess({ active, className, children }: SoftSuccessProps) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={cn("relative", className)}
      variants={successVariants(reducedMotion)}
      animate={active ? "success" : "rest"}
    >
      {children}
      <AnimatePresence>
        {active && !reducedMotion ? (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[rgba(90,170,150,0.12)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: touchTiming.success * 0.5 }}
          />
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

type IncorrectShakeProps = {
  trigger: boolean;
  className?: string;
  children?: ReactNode;
  onComplete?: () => void;
};

/** Subtle horizontal shake for incorrect answers — never harsh. */
export function IncorrectShake({
  trigger,
  className,
  children,
  onComplete,
}: IncorrectShakeProps) {
  const reducedMotion = useReducedMotion();
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (trigger) setKey((value) => value + 1);
  }, [trigger]);

  return (
    <motion.div
      key={key}
      className={cn(className)}
      variants={incorrectShakeVariants(reducedMotion)}
      initial="rest"
      animate={trigger ? "shake" : "rest"}
      onAnimationComplete={() => {
        if (trigger) onComplete?.();
      }}
    >
      {children}
    </motion.div>
  );
}

type RevealProps = {
  show: boolean;
  className?: string;
  children: ReactNode;
};

/** Short reveal transition for answer panels / overlays. */
export function Reveal({ show, className, children }: RevealProps) {
  const reducedMotion = useReducedMotion();
  return (
    <AnimatePresence mode="wait">
      {show ? (
        <motion.div
          key="reveal"
          className={className}
          variants={revealVariants(reducedMotion)}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
