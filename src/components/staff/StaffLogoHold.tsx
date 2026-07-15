"use client";

import { useRef, type ReactNode } from "react";
import { staffConfig } from "@/content/config/staff.config";
import { useHoldProgress } from "@/hooks/useHoldProgress";
import { useStaffStore } from "@/stores/staff.store";
import { cn } from "@/utils/cn";

type StaffLogoHoldProps = {
  children: ReactNode;
  className?: string;
  /** Visitor-facing accessible name — keep generic (no “staff”) */
  label?: string;
};

/**
 * Hidden staff entry: press and hold the museum lockup for six seconds,
 * then the PIN gate opens. Progress is nearly invisible so visitors never notice.
 */
export function StaffLogoHold({
  children,
  className,
  label = "The Northern Ontario Museum of Wonder",
}: StaffLogoHoldProps) {
  const openPinGate = useStaffStore((s) => s.openPinGate);
  const panelOpen = useStaffStore((s) => s.panelOpen);
  const pinGateOpen = useStaffStore((s) => s.pinGateOpen);
  const completedRef = useRef(false);

  const { progress, holding, handlers } = useHoldProgress({
    durationMs: staffConfig.logoHoldMs,
    disabled: panelOpen || pinGateOpen,
    ignoreReducedMotion: true,
    onComplete: () => {
      if (completedRef.current) return;
      completedRef.current = true;
      openPinGate();
      window.setTimeout(() => {
        completedRef.current = false;
      }, 800);
    },
  });

  return (
    <span
      role="text"
      aria-label={label}
      data-staff-hold="true"
      className={cn(
        "relative inline-block touch-manipulation select-none",
        className,
      )}
      style={{ touchAction: "manipulation" }}
      onPointerDown={(event) => {
        event.stopPropagation();
        handlers.onPointerDown(event);
      }}
      onPointerUp={(event) => {
        event.stopPropagation();
        handlers.onPointerUp();
      }}
      onPointerCancel={(event) => {
        event.stopPropagation();
        handlers.onPointerCancel();
      }}
      onClick={(event) => {
        // Absorb click so attract dismiss / navigation does not fire from a failed hold
        if (holding || progress > 0.05) {
          event.preventDefault();
          event.stopPropagation();
        }
      }}
    >
      {children}
      {/* Near-invisible hold progress — staff feel it, visitors do not */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-1 h-[2px] overflow-hidden rounded-full bg-transparent"
      >
        <span
          className="block h-full bg-[var(--color-museum-warm)]/35 transition-[width] duration-75"
          style={{ width: `${holding ? progress * 100 : 0}%` }}
        />
      </span>
    </span>
  );
}
