"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";

type Point = { x: number; y: number };

type UseSmoothPointerOptions = {
  /** 0–1 lerp factor per frame; higher = snappier */
  smoothing?: number;
  reducedMotion?: boolean;
  initial?: Point;
};

/**
 * Pointer tracking with RAF-smoothed position for large touchscreens.
 * Updates CSS-friendly normalized 0–1 coords relative to a container.
 */
export function useSmoothPointer(
  containerRef: RefObject<HTMLElement | null>,
  options: UseSmoothPointerOptions = {},
) {
  const { smoothing = 0.16, reducedMotion = false, initial = { x: 0.5, y: 0.55 } } = options;
  const [point, setPoint] = useState<Point>(initial);
  const [active, setActive] = useState(false);

  const targetRef = useRef<Point>(initial);
  const currentRef = useRef<Point>(initial);
  const rafRef = useRef<number | null>(null);
  const draggingRef = useRef(false);

  const tick = useCallback(() => {
    const factor = reducedMotion ? 1 : smoothing;
    const cur = currentRef.current;
    const target = targetRef.current;
    const next = {
      x: cur.x + (target.x - cur.x) * factor,
      y: cur.y + (target.y - cur.y) * factor,
    };
    currentRef.current = next;
    setPoint(next);

    const dx = Math.abs(target.x - next.x);
    const dy = Math.abs(target.y - next.y);
    if (dx > 0.0008 || dy > 0.0008 || draggingRef.current) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      rafRef.current = null;
    }
  }, [reducedMotion, smoothing]);

  const ensureTick = useCallback(() => {
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  const setFromClient = useCallback(
    (clientX: number, clientY: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      targetRef.current = {
        x: Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)),
        y: Math.min(1, Math.max(0, (clientY - rect.top) / rect.height)),
      };
      ensureTick();
    },
    [containerRef, ensureTick],
  );

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      draggingRef.current = true;
      setActive(true);
      event.currentTarget.setPointerCapture(event.pointerId);
      setFromClient(event.clientX, event.clientY);
      if (reducedMotion) {
        currentRef.current = { ...targetRef.current };
        setPoint(currentRef.current);
      }
    },
    [reducedMotion, setFromClient],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!draggingRef.current && event.buttons === 0) return;
      setFromClient(event.clientX, event.clientY);
    },
    [setFromClient],
  );

  const onPointerUp = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    draggingRef.current = false;
    setActive(false);
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }
  }, []);

  const reset = useCallback(
    (next: Point = initial) => {
      targetRef.current = next;
      currentRef.current = next;
      setPoint(next);
      setActive(false);
      draggingRef.current = false;
    },
    [initial],
  );

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return {
    point,
    active,
    reset,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
  };
}
