"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion, reducedMotionQuery } from "@/lib/motion/reduced-motion";
import { useStaffStore } from "@/stores/staff.store";

/** Subscribes to prefers-reduced-motion and optional staff override. */
export function useReducedMotion(): boolean {
  const forceReducedMotion = useStaffStore((state) => state.forceReducedMotion);
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(reducedMotionQuery);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion(forceReducedMotion, matches);
}
