"use client";

/**
 * @deprecated Use `AttractMode` from `@/components/attract`.
 * Thin compatibility wrapper around the cinematic AttractMode system.
 */
import { AttractMode } from "@/components/attract/AttractMode";
import type { AttractModeContent } from "@/types/exhibit-shell";
import type { ReactNode } from "react";

type AttractModeLayerProps = {
  active: boolean;
  title: string;
  subtitle: string;
  children?: ReactNode;
  className?: string;
  onExit?: () => void;
};

export function AttractModeLayer({
  active,
  title,
  subtitle,
  children,
  className,
  onExit,
}: AttractModeLayerProps) {
  const content: AttractModeContent = {
    title,
    invitation: subtitle,
    background: { fallbackTone: "boreal-night", ambientTone: "mist", scrim: "mist" },
    allowAmbientAudio: false,
  };

  return (
    <AttractMode
      active={active}
      content={content}
      onExit={onExit ?? (() => undefined)}
      className={className}
    >
      {children}
    </AttractMode>
  );
}
