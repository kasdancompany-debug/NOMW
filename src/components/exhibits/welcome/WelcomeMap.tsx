"use client";

import { motion } from "framer-motion";
import { welcomeZones, type WelcomeZone, type WelcomeZoneId } from "@/content/exhibits/welcome/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { baseTransition } from "@/lib/motion/tokens";
import { cn } from "@/utils/cn";

type WelcomeMapProps = {
  activeZoneId?: WelcomeZoneId | null;
  onSelectZone: (zone: WelcomeZone) => void;
  className?: string;
};

/**
 * Stylized offline atlas map — illustrative SVG shapes, not cartography.
 */
export function WelcomeMap({ activeZoneId, onSelectZone, className }: WelcomeMapProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className={cn("relative h-full w-full", className)}>
      <svg
        viewBox="0 0 1000 900"
        className="h-full w-full drop-shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
        role="img"
        aria-label="Illustrated map of Northern Ontario habitats"
      >
        <defs>
          <linearGradient id="atlasWater" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0a2233" />
            <stop offset="100%" stopColor="#143a52" />
          </linearGradient>
          <filter id="atlasSoft" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        {/* Atlas page ground */}
        <rect
          x="40"
          y="30"
          width="920"
          height="840"
          rx="8"
          fill="rgba(12, 28, 34, 0.55)"
          stroke="rgba(238, 243, 246, 0.12)"
          strokeWidth="2"
        />
        <text
          x="70"
          y="78"
          fill="rgba(212, 176, 122, 0.9)"
          fontSize="18"
          letterSpacing="4"
          style={{ fontFamily: "var(--font-museum-body)" }}
        >
          NORTHERN ONTARIO · ILLUSTRATED ATLAS
        </text>
        <text
          x="70"
          y="104"
          fill="rgba(212, 176, 122, 0.55)"
          fontSize="12"
          letterSpacing="2"
          style={{ fontFamily: "var(--font-museum-body)" }}
        >
          PLACEHOLDER MAP ART · NOT CARTOGRAPHY
        </text>

        {/* Soft water field behind land */}
        <ellipse cx="520" cy="520" rx="340" ry="220" fill="url(#atlasWater)" opacity="0.45" />

        {welcomeZones.map((zone) => {
          const active = zone.id === activeZoneId;
          return (
            <g key={zone.id}>
              <motion.path
                d={zone.path}
                fill={active ? zone.activeFill : zone.fill}
                stroke={active ? "rgba(212, 176, 122, 0.95)" : "rgba(238, 243, 246, 0.28)"}
                strokeWidth={active ? 4 : 2}
                filter="url(#atlasSoft)"
                className="cursor-pointer outline-none"
                tabIndex={0}
                role="button"
                aria-label={zone.name}
                whileTap={reducedMotion ? undefined : { scale: 0.985 }}
                transition={baseTransition(reducedMotion)}
                onClick={() => onSelectZone(zone)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectZone(zone);
                  }
                }}
              />
              <text
                x={zone.labelX}
                y={zone.labelY}
                textAnchor="middle"
                fill={active ? "#f3efe6" : "rgba(243, 239, 230, 0.88)"}
                fontSize="22"
                style={{ fontFamily: "var(--font-museum-display)", pointerEvents: "none" }}
              >
                {zone.shortLabel}
              </text>
            </g>
          );
        })}

        {/* Decorative latitude lines — atlas character, not navigation */}
        {[220, 360, 500, 640].map((y) => (
          <line
            key={y}
            x1="80"
            y1={y}
            x2="920"
            y2={y}
            stroke="rgba(238, 243, 246, 0.06)"
            strokeWidth="1"
            strokeDasharray="6 10"
          />
        ))}
      </svg>
    </div>
  );
}
