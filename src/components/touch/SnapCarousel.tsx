"use client";

import { motion } from "framer-motion";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useSnapDrag } from "@/hooks/useSnapDrag";
import { cn } from "@/utils/cn";

type SnapCarouselProps = {
  count: number;
  index: number;
  onIndexChange: (index: number) => void;
  children: ReactNode;
  className?: string;
  /** Accessible label for the track */
  label?: string;
};

/**
 * Horizontal pages with drag resistance, momentum, and snap points.
 * Respects reduced motion via useSnapDrag.
 * Each child should be sized to one viewport width.
 */
export function SnapCarousel({
  count,
  index,
  onIndexChange,
  children,
  className,
  label = "Pages",
}: SnapCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [extentPx, setExtentPx] = useState(0);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setExtentPx(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { dragProps } = useSnapDrag({
    axis: "x",
    count,
    index,
    onIndexChange,
    extentPx,
  });

  const { style: dragStyle, ...restDrag } = dragProps;

  return (
    <div
      ref={viewportRef}
      className={cn("relative overflow-hidden touch-pressable", className)}
      aria-label={label}
    >
      <motion.div
        className="flex h-full cursor-grab active:cursor-grabbing"
        style={{
          width: `${Math.max(1, count) * 100}%`,
          ...dragStyle,
        }}
        {...restDrag}
      >
        {children}
      </motion.div>
    </div>
  );
}
