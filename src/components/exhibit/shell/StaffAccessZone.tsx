"use client";

import { useCallback, useRef } from "react";
import { staffConfig } from "@/content/config/staff.config";
import { useStaffStore } from "@/stores/staff.store";
import { cn } from "@/utils/cn";

type StaffAccessZoneProps = {
  className?: string;
};

/**
 * Legacy corner chord — disabled by default (logo hold is the primary path).
 * When enabled, opens the PIN gate instead of navigating away.
 */
export function StaffAccessZone({ className }: StaffAccessZoneProps) {
  const openPinGate = useStaffStore((s) => s.openPinGate);
  const tapsRef = useRef<number[]>([]);

  const onPointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (!staffConfig.gesture.enabled) return;
      event.stopPropagation();
      const now = Date.now();
      const windowMs = staffConfig.gesture.windowMs;
      const next = [...tapsRef.current.filter((t) => now - t <= windowMs), now];
      tapsRef.current = next;

      if (next.length >= staffConfig.gesture.tapCount) {
        tapsRef.current = [];
        openPinGate();
      }
    },
    [openPinGate],
  );

  if (!staffConfig.gesture.enabled) return null;

  return (
    <button
      type="button"
      aria-label="Staff access"
      className={cn("absolute top-0 right-0 z-50 touch-target opacity-0", className)}
      style={{
        width: staffConfig.gesture.zoneSizePx,
        height: staffConfig.gesture.zoneSizePx,
      }}
      onPointerDown={onPointerDown}
    />
  );
}
