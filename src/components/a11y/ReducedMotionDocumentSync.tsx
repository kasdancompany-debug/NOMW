"use client";

import { useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Mirrors prefers-reduced-motion / staff override onto <html data-reduced-motion>
 * so CSS ambient animations obey the same switch as Framer Motion components.
 */
export function ReducedMotionDocumentSync() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = document.documentElement;
    if (reducedMotion) {
      root.dataset.reducedMotion = "true";
    } else {
      delete root.dataset.reducedMotion;
    }
  }, [reducedMotion]);

  return null;
}
