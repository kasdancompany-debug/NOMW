"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { AmbientOverlay } from "@/components/media/AmbientOverlay";
import { FullscreenMedia } from "@/components/media/FullscreenMedia";
import {
  LayeredLandscape,
  type LandscapeTone,
} from "@/components/media/LayeredLandscape";
import { TouchToExplorePrompt } from "@/components/attract/TouchToExplorePrompt";
import { StaffLogoHold } from "@/components/staff/StaffLogoHold";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";
import type { AttractModeContent } from "@/types/exhibit-shell";
import { cn } from "@/utils/cn";

const DEFAULT_MUSEUM_NAME = "The Northern Ontario Museum of Wonder";

function landscapeToneForAttract(content: AttractModeContent): LandscapeTone {
  const ambient = content.background.ambientTone;
  const fallback = content.background.fallbackTone;
  if (ambient === "night" || content.title.toLowerCase().includes("night")) {
    return "night-canopy";
  }
  if (ambient === "warm" || fallback === "museum-glow") return "welcome-dawn";
  if (fallback === "deep-lake") return "habitat-lake";
  if (fallback === "snow-mist") return "habitat-snow";
  return "boreal-giants";
}

export type AttractModeProps = {
  active: boolean;
  content: AttractModeContent;
  /**
   * Called when the visitor begins a dismiss gesture.
   * Parent should soft-exit attract and arm a brief interaction suppress window.
   */
  onExit: () => void;
  /** Optional custom foreground instead of the default title stack */
  children?: ReactNode;
  className?: string;
};

function fallbackClass(tone: AttractModeContent["background"]["fallbackTone"]): string {
  switch (tone) {
    case "deep-lake":
      return "bg-deep-lake";
    case "snow-mist":
      return "bg-snow-mist";
    case "museum-glow":
      return "bg-museum-glow";
    case "boreal-night":
    default:
      return "bg-boreal-night";
  }
}

/**
 * Cinematic idle attract screen.
 * Exit touch is absorbed here so it does not activate exhibit content underneath.
 */
export function AttractMode({
  active,
  content,
  onExit,
  children,
  className,
}: AttractModeProps) {
  const reducedMotion = useReducedMotion();
  const museumName = content.museumName ?? DEFAULT_MUSEUM_NAME;
  const promptLabel = content.promptLabel ?? "Touch to Explore";
  const ambientTone = content.background.ambientTone ?? "mist";

  const handleExitPointer = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement | null;
      // Logo long-press must not dismiss attract mid-hold
      if (target?.closest?.("[data-staff-hold]")) {
        return;
      }
      // Absorb this gesture entirely — do not let it fall through to exhibit UI.
      event.preventDefault();
      event.stopPropagation();
      onExit();
    },
    [onExit],
  );

  useEffect(() => {
    if (!active) return;
    // Attract owns the viewport; ensure keyboard also exits without colliding with hotkeys.
    const onKey = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
      onExit();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [active, onExit]);

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className={cn(
            "absolute inset-0 z-[42] touch-manipulation overflow-hidden",
            fallbackClass(content.background.fallbackTone),
            className,
          )}
          role="dialog"
          aria-label={`${content.title}. ${promptLabel}`}
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={scenicTransition(reducedMotion)}
          onPointerDownCapture={handleExitPointer}
        >
          {/* Background plane */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute inset-0"
              animate={
                reducedMotion
                  ? undefined
                  : {
                      scale: [1, 1.04, 1],
                    }
              }
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { duration: 28, repeat: Infinity, ease: "easeInOut" }
              }
            >
              {content.background.imageSrc || content.background.videoSrc ? (
                <FullscreenMedia
                  imageSrc={content.background.imageSrc}
                  videoSrc={content.background.videoSrc}
                  posterSrc={content.background.posterSrc}
                  scrim={content.background.scrim ?? "mist"}
                  imageAlt=""
                />
              ) : (
                <LayeredLandscape
                  tone={landscapeToneForAttract(content)}
                  animate={!reducedMotion}
                  showBadge={false}
                />
              )}
            </motion.div>
            {ambientTone !== "none" ? (
              <AmbientOverlay tone={ambientTone} animate={!reducedMotion} />
            ) : null}
          </div>

          {/* Copy + CTA */}
          <div className="safe-frame relative z-10 flex h-full flex-col justify-end">
            {children ?? (
              <motion.div
                className="max-w-[34rem]"
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={scenicTransition(reducedMotion)}
              >
                <p className="text-[length:var(--text-label)] font-[family-name:var(--font-ui)] font-[number:var(--font-weight-medium)] tracking-[var(--tracking-wide)] text-[var(--color-museum-warm)] uppercase">
                  <StaffLogoHold>{museumName}</StaffLogoHold>
                </p>
                <h2 className="mt-[var(--space-4)] font-[family-name:var(--font-display)] text-[length:var(--text-display-lg)] leading-[var(--leading-display)] tracking-[var(--tracking-display)] text-[var(--text-on-dark)]">
                  {content.title}
                </h2>
                <p className="mt-[var(--space-5)] max-w-[36ch] text-[length:var(--text-lead)] leading-[var(--leading-body)] text-[var(--text-on-dark-muted)]">
                  {content.invitation}
                </p>
                <div className="mt-[var(--space-9)]">
                  <TouchToExplorePrompt label={promptLabel} />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
