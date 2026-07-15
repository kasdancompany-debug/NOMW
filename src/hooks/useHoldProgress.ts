"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { touchTiming } from "@/lib/motion/touch";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type UseHoldProgressOptions = {
  /** Hold duration in ms before complete */
  durationMs?: number;
  disabled?: boolean;
  onComplete?: () => void;
  /**
   * When true, never short-circuit under reduced motion
   * (staff security holds must stay intentional).
   */
  ignoreReducedMotion?: boolean;
};

/**
 * Hold-to-confirm progress (0–1). Visual only until complete — no hover path.
 */
export function useHoldProgress(options: UseHoldProgressOptions = {}) {
  const { durationMs = touchTiming.holdMs, disabled = false, onComplete, ignoreReducedMotion = false } = options;
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const completedRef = useRef(false);

  const clear = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const cancel = useCallback(() => {
    clear();
    setHolding(false);
    setProgress(0);
    completedRef.current = false;
  }, [clear]);

  const tick = useCallback(() => {
    const elapsed = performance.now() - startRef.current;
    const next = Math.min(1, elapsed / durationMs);
    setProgress(next);
    if (next >= 1) {
      if (!completedRef.current) {
        completedRef.current = true;
        setHolding(false);
        onComplete?.();
      }
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [durationMs, onComplete]);

  const start = useCallback(() => {
    if (disabled) return;
    if (reducedMotion && !ignoreReducedMotion) {
      setProgress(1);
      setHolding(false);
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
      return;
    }
    completedRef.current = false;
    setHolding(true);
    startRef.current = performance.now();
    clear();
    rafRef.current = requestAnimationFrame(tick);
  }, [clear, disabled, ignoreReducedMotion, onComplete, reducedMotion, tick]);

  useEffect(() => () => clear(), [clear]);

  return {
    progress,
    holding,
    start,
    cancel,
    handlers: {
      onPointerDown: (event: ReactPointerEvent<HTMLElement>) => {
        event.currentTarget.setPointerCapture?.(event.pointerId);
        start();
      },
      onPointerUp: cancel,
      onPointerCancel: cancel,
      onPointerLeave: cancel,
    },
  };
}
