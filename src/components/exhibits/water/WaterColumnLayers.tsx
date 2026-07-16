"use client";

import { motion } from "framer-motion";
import type { WaterCondition, WaterZone } from "@/content/exhibits/water/content";
import { waterZones } from "@/content/exhibits/water/content";
import { Touchable } from "@/components/touch/Touchable";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";

type WaterColumnLayersProps = {
  condition: WaterCondition;
  /** 0–1 scroll progress through column (0 = shoreline) */
  progress: number;
  className?: string;
};

/**
 * Layered water column using CSS gradients/masks + subtle parallax offsets.
 * No WebGL — touchscreen-friendly.
 */
export function WaterColumnLayers({ condition, progress, className }: WaterColumnLayersProps) {
  const reducedMotion = useReducedMotion();
  const winter = condition === "winter";

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden>
      {/* Sky / ice canopy */}
      <motion.div
        className={cn(
          "absolute inset-x-0 top-0 h-[18%]",
          winter
            ? "bg-[linear-gradient(180deg,#dce7ef_0%,#9bb4c4_100%)]"
            : "bg-[linear-gradient(180deg,#7eb0c9_0%,#1a4d66_100%)]",
        )}
        style={{
          y: reducedMotion ? 0 : progress * -20,
        }}
      />

      {/* Ice sheet mask for winter */}
      {winter ? (
        <div className="absolute inset-x-0 top-[14%] h-[8%] bg-[linear-gradient(180deg,rgba(255,255,255,0.75),rgba(180,205,220,0.35))] opacity-90 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]" />
      ) : null}

      {/* Water body */}
      <div
        className={cn(
          "absolute inset-x-0 top-[16%] bottom-0",
          winter
            ? "bg-[linear-gradient(180deg,#6f99b0_0%,#244864_42%,#0d2233_100%)]"
            : "bg-[linear-gradient(180deg,#3d8fb0_0%,#1a5f82_35%,#0a2f4a_70%,#061018_100%)]",
        )}
      />

      {/* Caustic / light shafts — summer only */}
      {!winter && !reducedMotion ? (
        <motion.div
          className="absolute inset-x-[10%] top-[20%] h-[45%] opacity-30 mix-blend-screen bg-[radial-gradient(ellipse_at_center,rgba(200,230,255,0.55),transparent_65%)]"
          animate={{ opacity: [0.18, 0.35, 0.18], x: [0, 12, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}

      {/* Zone colour washes */}
      {waterZones.map((zone) => (
        <ZoneBand key={zone.id} zone={zone} condition={condition} progress={progress} reducedMotion={reducedMotion} />
      ))}

      {/* Bottom silt */}
      <div className="absolute inset-x-0 bottom-0 h-[12%] bg-[linear-gradient(180deg,transparent,rgba(30,28,22,0.95))]" />

      {/* Soft vignettes */}
      <div className="absolute inset-0 overlay-vignette opacity-80" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-[linear-gradient(90deg,rgba(6,16,24,0.55),transparent)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-[linear-gradient(270deg,rgba(6,16,24,0.55),transparent)]" />
    </div>
  );
}

function ZoneBand({
  zone,
  condition,
  progress,
  reducedMotion,
}: {
  zone: WaterZone;
  condition: WaterCondition;
  progress: number;
  reducedMotion: boolean;
}) {
  const top = `${Math.max(0, (zone.center - zone.height / 2) * 100)}%`;
  const height = `${zone.height * 100}%`;
  const tint = condition === "winter" ? zone.winterTint : zone.summerTint;
  const parallax = reducedMotion ? 0 : (progress - zone.center) * 18;

  return (
    <motion.div
      className="absolute inset-x-0"
      style={{ top, height, background: tint, y: parallax }}
    />
  );
}

type ZoneRailProps = {
  activeZoneId: WaterZone["id"];
  onSelect: (zoneId: WaterZone["id"]) => void;
};

export function WaterZoneRail({ activeZoneId, onSelect }: ZoneRailProps) {
  return (
    <nav
      aria-label="Water column zones"
      className="flex flex-col gap-[var(--space-2)]"
    >
      {waterZones.map((zone) => {
        const active = zone.id === activeZoneId;
        return (
          <Touchable
            key={zone.id}
            soft
            glow={active}
            className={cn(
              "touch-pressable w-[11.5rem] justify-start rounded-[var(--radius-xs)] border px-[var(--space-3)] text-left text-[length:var(--text-label)] tracking-[var(--tracking-title)]",
              active
                ? "border-[var(--color-aurora-teal)] bg-[rgba(94,184,168,0.18)] text-[var(--text-on-dark)]"
                : "border-[var(--glass-border)] text-[var(--text-on-dark-muted)]",
            )}
            onClick={() => onSelect(zone.id)}
          >
            {zone.name}
          </Touchable>
        );
      })}
    </nav>
  );
}
