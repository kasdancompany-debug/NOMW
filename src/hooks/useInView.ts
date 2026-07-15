"use client";

import { useEffect, useState, type RefObject } from "react";

type UseInViewOptions = {
  rootMargin?: string;
  threshold?: number;
  /** Once true, stay true (good for lazy media attach) */
  once?: boolean;
  enabled?: boolean;
};

/** Lightweight IntersectionObserver for deferring media work. */
export function useInView(
  ref: RefObject<Element | null>,
  options: UseInViewOptions = {},
) {
  const {
    rootMargin = "200px 0px",
    threshold = 0.01,
    once = true,
    enabled = true,
  } = options;
  const [inView, setInView] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setInView(true);
      return;
    }
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, once, ref, rootMargin, threshold]);

  return inView;
}
