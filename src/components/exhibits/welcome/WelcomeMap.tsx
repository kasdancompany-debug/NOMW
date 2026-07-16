"use client";

import { motion } from "framer-motion";
import {
  NORTHERN_ONTARIO_LAND_PATH,
  welcomeZones,
  type WelcomeZone,
  type WelcomeZoneId,
} from "@/content/exhibits/welcome/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { baseTransition } from "@/lib/motion/tokens";
import { cn } from "@/utils/cn";

type WelcomeMapProps = {
  activeZoneId?: WelcomeZoneId | null;
  onSelectZone: (zone: WelcomeZone) => void;
  className?: string;
};

const FOREST_PATH = welcomeZones.find((zone) => zone.id === "boreal-forest")!.path;

/**
 * Illustrated Northern Ontario atlas — one landmass, five clear habitat regions.
 */
export function WelcomeMap({ activeZoneId, onSelectZone, className }: WelcomeMapProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className={cn("relative h-full w-full", className)}>
      <svg
        viewBox="0 0 1000 900"
        className="h-full w-full drop-shadow-[0_24px_48px_rgba(0,0,0,0.4)]"
        role="img"
        aria-label="Illustrated map of Northern Ontario habitats"
      >
        <defs>
          <linearGradient id="atlasPage" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(14, 28, 34, 0.78)" />
            <stop offset="100%" stopColor="rgba(8, 18, 24, 0.92)" />
          </linearGradient>
          <linearGradient id="hudsonBay" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0c2a3c" />
            <stop offset="100%" stopColor="#164860" />
          </linearGradient>
          <linearGradient id="greatLakesWater" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#0a3048" />
            <stop offset="100%" stopColor="#1a5870" />
          </linearGradient>
          <pattern id="forestGrain" width="20" height="24" patternUnits="userSpaceOnUse">
            <path
              d="M10 3 L10 20 M6 10 L10 3 L14 10"
              stroke="rgba(16, 36, 24, 0.4)"
              strokeWidth="1.15"
              fill="none"
            />
          </pattern>
          <clipPath id="landClip">
            <path d={NORTHERN_ONTARIO_LAND_PATH} />
          </clipPath>
          <filter id="landShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#000" floodOpacity="0.5" />
          </filter>
        </defs>

        <rect
          x="36"
          y="28"
          width="928"
          height="844"
          rx="12"
          fill="url(#atlasPage)"
          stroke="rgba(212, 176, 122, 0.28)"
          strokeWidth="1.5"
        />

        <text
          x="68"
          y="72"
          fill="rgba(212, 176, 122, 0.92)"
          fontSize="15"
          letterSpacing="3.5"
          style={{ fontFamily: "var(--font-museum-body)" }}
        >
          NORTHERN ONTARIO
        </text>
        <text
          x="68"
          y="98"
          fill="rgba(238, 243, 246, 0.48)"
          fontSize="13"
          letterSpacing="1.8"
          style={{ fontFamily: "var(--font-museum-body)" }}
        >
          Illustrated atlas · touch a habitat
        </text>

        <ellipse cx="500" cy="148" rx="268" ry="62" fill="url(#hudsonBay)" opacity="0.62" />
        <text
          x="500"
          y="142"
          textAnchor="middle"
          fill="rgba(160, 200, 220, 0.5)"
          fontSize="11"
          letterSpacing="2.2"
          style={{ fontFamily: "var(--font-museum-body)", pointerEvents: "none" }}
        >
          HUDSON BAY
        </text>

        <path
          d="M250 790 C350 835 500 860 640 845 C760 832 830 780 845 720 C800 770 710 805 590 812 C450 820 330 805 250 790 Z"
          fill="url(#greatLakesWater)"
          opacity="0.75"
        />
        <text
          x="560"
          y="848"
          textAnchor="middle"
          fill="rgba(160, 200, 220, 0.42)"
          fontSize="11"
          letterSpacing="2.2"
          style={{ fontFamily: "var(--font-museum-body)", pointerEvents: "none" }}
        >
          GREAT LAKES
        </text>

        <path
          d={NORTHERN_ONTARIO_LAND_PATH}
          fill="#152820"
          stroke="rgba(212, 176, 122, 0.42)"
          strokeWidth="2.75"
          filter="url(#landShadow)"
        />

        <g clipPath="url(#landClip)">
          {welcomeZones.map((zone) => {
            const active = zone.id === activeZoneId;
            return (
              <motion.path
                key={zone.id}
                d={zone.path}
                fill={active ? zone.activeFill : zone.fill}
                stroke={active ? "rgba(243, 239, 230, 0.9)" : "rgba(6, 14, 18, 0.65)"}
                strokeWidth={active ? 3 : 2}
                className="cursor-pointer outline-none"
                tabIndex={0}
                role="button"
                aria-label={zone.name}
                whileHover={
                  reducedMotion
                    ? undefined
                    : { filter: "brightness(1.08)" }
                }
                whileTap={reducedMotion ? undefined : { scale: 0.995 }}
                transition={baseTransition(reducedMotion)}
                style={{ transformOrigin: `${zone.labelX}px ${zone.labelY}px` }}
                onClick={() => onSelectZone(zone)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectZone(zone);
                  }
                }}
              />
            );
          })}
          <path d={FOREST_PATH} fill="url(#forestGrain)" pointerEvents="none" opacity="0.5" />
        </g>

        {/* Land outline on top so seams read cleanly */}
        <path
          d={NORTHERN_ONTARIO_LAND_PATH}
          fill="none"
          stroke="rgba(212, 176, 122, 0.55)"
          strokeWidth="2.5"
          pointerEvents="none"
        />

        {welcomeZones.map((zone) => {
          const active = zone.id === activeZoneId;
          const width = zone.shortLabel.length > 8 ? 132 : 112;
          return (
            <g key={`label-${zone.id}`} style={{ pointerEvents: "none" }}>
              <rect
                x={zone.labelX - width / 2}
                y={zone.labelY - 16}
                width={width}
                height="32"
                rx="5"
                fill={active ? "rgba(6, 14, 18, 0.78)" : "rgba(6, 14, 18, 0.55)"}
                stroke={active ? "rgba(212, 176, 122, 0.55)" : "rgba(238, 243, 246, 0.12)"}
                strokeWidth="1"
              />
              <text
                x={zone.labelX}
                y={zone.labelY + 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={active ? "#f3efe6" : "rgba(243, 239, 230, 0.94)"}
                fontSize="15"
                letterSpacing="0.4"
                style={{ fontFamily: "var(--font-museum-display)" }}
              >
                {zone.shortLabel}
              </text>
            </g>
          );
        })}

        <g transform="translate(888, 118)" opacity="0.6">
          <circle r="26" fill="none" stroke="rgba(212, 176, 122, 0.55)" strokeWidth="1.25" />
          <path d="M0 -16 L4.5 0 L0 16 L-4.5 0 Z" fill="rgba(212, 176, 122, 0.7)" />
          <text
            y="-32"
            textAnchor="middle"
            fill="rgba(212, 176, 122, 0.75)"
            fontSize="10"
            letterSpacing="2"
            style={{ fontFamily: "var(--font-museum-body)" }}
          >
            N
          </text>
        </g>
      </svg>
    </div>
  );
}
