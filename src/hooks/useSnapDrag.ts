"use client";

import { useCallback, useEffect, useRef } from "react";
import { animate, useMotionValue } from "framer-motion";
import { resistEdges, touchDrag } from "@/lib/motion/touch";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Axis = "x" | "y";

type UseSnapDragOptions = {
  axis?: Axis;
  /** Number of snap pages / points */
  count: number;
  index: number;
  onIndexChange: (index: number) => void;
  /** Track length in px (viewport size along axis) */
  extentPx: number;
};

/**
 * Drag with edge resistance, momentum feel, and snap points.
 */
export function useSnapDrag({
  axis = "x",
  count,
  index,
  onIndexChange,
  extentPx,
}: UseSnapDragOptions) {
  const reducedMotion = useReducedMotion();
  const offset = useMotionValue(0);
  const startOffset = useRef(0);
  const dragging = useRef(false);

  const maxTravel = Math.max(0, extentPx * Math.max(0, count - 1));

  const settleToIndex = useCallback(
    (nextIndex: number) => {
      const clamped = Math.min(count - 1, Math.max(0, nextIndex));
      const target = count <= 1 || maxTravel <= 0 ? 0 : -(clamped / (count - 1)) * maxTravel;
      if (reducedMotion) {
        offset.set(target);
      } else {
        void animate(offset, target, {
          type: "spring",
          stiffness: touchDrag.snapStiffness,
          damping: touchDrag.snapDamping,
          mass: 0.7,
        });
      }
      if (clamped !== index) onIndexChange(clamped);
    },
    [count, index, maxTravel, offset, onIndexChange, reducedMotion],
  );

  useEffect(() => {
    if (dragging.current) return;
    const target = count <= 1 || maxTravel <= 0 ? 0 : -(index / (count - 1)) * maxTravel;
    offset.set(target);
  }, [count, index, maxTravel, offset]);

  const onDragStart = () => {
    dragging.current = true;
    startOffset.current = offset.get();
  };

  const onDrag = (_: unknown, info: { offset: { x: number; y: number } }) => {
    const delta = axis === "x" ? info.offset.x : info.offset.y;
    const raw = startOffset.current + delta;
    const resisted = resistEdges(raw, -maxTravel, 0, touchDrag.edgeElastic);
    offset.set(resisted);
  };

  const onDragEnd = (_: unknown, info: { velocity: { x: number; y: number } }) => {
    dragging.current = false;
    const velocity = axis === "x" ? info.velocity.x : info.velocity.y;
    const current = offset.get();
    const momentumPx = reducedMotion ? 0 : velocity * touchDrag.momentum * 0.08;
    const projected = current + momentumPx;
    const fromPos =
      maxTravel <= 0
        ? 0
        : Math.round(Math.min(count - 1, Math.max(0, (-projected / maxTravel) * (count - 1))));
    settleToIndex(fromPos);
  };

  return {
    offset,
    dragProps: {
      drag: (reducedMotion ? false : axis) as false | Axis,
      dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 },
      dragElastic: touchDrag.dragElastic,
      dragMomentum: false,
      onDragStart,
      onDrag,
      onDragEnd,
      style: axis === "x" ? { x: offset } : { y: offset },
    },
    settleToIndex,
  };
}
