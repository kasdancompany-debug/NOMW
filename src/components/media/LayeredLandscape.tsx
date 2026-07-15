"use client";

import { motion } from "framer-motion";
import { PlaceholderBadge } from "@/components/media/PlaceholderBadge";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";

export type LandscapeTone = "welcome-dawn" | "boreal-giants" | "night-canopy" | "habitat-lake" | "habitat-snow";

type LayeredLandscapeProps = {
  tone: LandscapeTone;
  className?: string;
  /** Show the explicit media placeholder label */
  showBadge?: boolean;
  badgeLabel?: string;
  /** Soft looped wash motion when motion is allowed */
  animate?: boolean;
};

/**
 * High-quality CSS/SVG layered landscape beds for the three-station visual MVP.
 * Finals replace these with photography / video under the same composition.
 */
export function LayeredLandscape({
  tone,
  className,
  showBadge = true,
  badgeLabel,
  animate = true,
}: LayeredLandscapeProps) {
  const reducedMotion = useReducedMotion();
  const drift = animate && !reducedMotion;
  const label = badgeLabel ?? defaultBadge(tone);

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <div className={cn("absolute inset-0", skyClass(tone))} />

      {drift ? (
        <motion.div
          className={cn("absolute inset-0 opacity-80", washClass(tone))}
          animate={{ x: [0, 18, 0], opacity: [0.55, 0.85, 0.6] }}
          transition={{ duration: durationFor(tone), repeat: Infinity, ease: "easeInOut" }}
        />
      ) : (
        <div className={cn("absolute inset-0 opacity-70", washClass(tone))} />
      )}

      {/* Midground ridge */}
      <svg
        className="absolute inset-x-0 bottom-[12%] h-[52%] w-full"
        viewBox="0 0 1920 620"
        preserveAspectRatio="none"
      >
        <path fill={ridgeFill(tone)} d={ridgePath(tone)} opacity="0.9" />
      </svg>

      {/* Tree / structure canopy */}
      <svg
        className="absolute inset-x-0 bottom-0 h-[72%] w-full"
        viewBox="0 0 1920 900"
        preserveAspectRatio="xMidYMax slice"
      >
        <path fill={canopyFill(tone)} d={canopyPath(tone)} />
        <path fill={groundFill(tone)} d={groundPath(tone)} opacity="0.95" />
      </svg>

      <div className="absolute inset-0 overlay-vignette opacity-80" />
      {showBadge ? <PlaceholderBadge label={label} /> : null}
    </div>
  );
}

function defaultBadge(tone: LandscapeTone) {
  switch (tone) {
    case "welcome-dawn":
      return "Welcome habitat still · WebP plate";
    case "boreal-giants":
      return "Forest environment loop · H.264 / poster WebP";
    case "night-canopy":
      return "Night canopy still · WebP plate";
    case "habitat-lake":
      return "Shoreline habitat still · WebP plate";
    case "habitat-snow":
      return "Highland / snow habitat still · WebP plate";
  }
}

function skyClass(tone: LandscapeTone) {
  switch (tone) {
    case "welcome-dawn":
      return "bg-[linear-gradient(165deg,#1a2a32_0%,#243840_28%,#3a4f46_58%,#5c6a52_78%,#8a7a58_100%)]";
    case "boreal-giants":
      return "bg-boreal-night";
    case "night-canopy":
      return "bg-[linear-gradient(180deg,#05080f_0%,#080e18_45%,#0a121c_100%)]";
    case "habitat-lake":
      return "bg-deep-lake";
    case "habitat-snow":
      return "bg-snow-mist";
  }
}

function washClass(tone: LandscapeTone) {
  switch (tone) {
    case "welcome-dawn":
      return "bg-[radial-gradient(ellipse_at_70%_20%,rgba(212,176,122,0.28),transparent_55%),radial-gradient(ellipse_at_20%_60%,rgba(94,184,168,0.18),transparent_50%)]";
    case "boreal-giants":
      return "bg-[radial-gradient(ellipse_at_20%_30%,rgba(42,74,56,0.55),transparent_55%),radial-gradient(ellipse_at_80%_40%,rgba(26,51,40,0.65),transparent_50%)]";
    case "night-canopy":
      return "bg-[radial-gradient(circle_at_78%_12%,rgba(180,200,220,0.2),transparent_42%)]";
    case "habitat-lake":
      return "bg-[radial-gradient(ellipse_at_60%_40%,rgba(40,110,140,0.35),transparent_55%)]";
    case "habitat-snow":
      return "bg-[radial-gradient(ellipse_at_40%_20%,rgba(220,230,240,0.35),transparent_50%)]";
  }
}

function ridgeFill(tone: LandscapeTone) {
  switch (tone) {
    case "welcome-dawn":
      return "rgba(28,48,42,0.75)";
    case "boreal-giants":
      return "rgba(18,40,30,0.8)";
    case "night-canopy":
      return "rgba(6,12,20,0.9)";
    case "habitat-lake":
      return "rgba(12,40,56,0.85)";
    case "habitat-snow":
      return "rgba(90,100,110,0.55)";
  }
}

function canopyFill(tone: LandscapeTone) {
  switch (tone) {
    case "welcome-dawn":
      return "rgba(12,28,22,0.92)";
    case "boreal-giants":
      return "rgba(10,28,20,0.95)";
    case "night-canopy":
      return "#02060c";
    case "habitat-lake":
      return "rgba(8,28,40,0.92)";
    case "habitat-snow":
      return "rgba(40,48,56,0.75)";
  }
}

function groundFill(tone: LandscapeTone) {
  switch (tone) {
    case "welcome-dawn":
      return "rgba(16,32,26,0.95)";
    case "boreal-giants":
      return "rgba(8,22,16,0.96)";
    case "night-canopy":
      return "#071018";
    case "habitat-lake":
      return "rgba(6,24,36,0.96)";
    case "habitat-snow":
      return "rgba(70,82,92,0.9)";
  }
}

function durationFor(tone: LandscapeTone) {
  return tone === "night-canopy" ? 26 : tone === "boreal-giants" ? 22 : 18;
}

function ridgePath(tone: LandscapeTone) {
  if (tone === "habitat-lake") {
    return "M0 620 V280 C180 220 320 320 520 250 C720 180 900 300 1120 240 C1340 180 1600 280 1920 220 V620 Z";
  }
  return "M0 620 V300 C160 240 280 340 460 280 C640 220 780 340 980 270 C1180 200 1380 320 1580 260 C1720 220 1840 280 1920 250 V620 Z";
}

function canopyPath(tone: LandscapeTone) {
  if (tone === "night-canopy") {
    return "M0 900 V420 L80 900 Z M120 900 L200 280 L280 900 Z M300 900 L360 360 L440 900 Z M480 900 L560 220 L640 900 Z M700 900 L780 300 L860 900 Z M900 900 L980 180 L1060 900 Z M1120 900 L1200 260 L1280 900 Z M1340 900 L1420 340 L1500 900 Z M1560 900 L1640 240 L1720 900 Z M1760 900 L1840 380 L1920 900 Z";
  }
  return "M0 900 V480 L70 900ZM100 900 L180 260 L260 900ZM300 900 L370 320 L460 900ZM500 900 L590 200 L680 900ZM740 900 L820 280 L920 900ZM980 900 L1080 180 L1180 900ZM1240 900 L1340 300 L1440 900ZM1500 900 L1600 220 L1700 900ZM1760 900 L1840 340 L1920 900Z";
}

function groundPath(tone: LandscapeTone) {
  if (tone === "habitat-lake") {
    return "M0 900 V620 C200 560 400 680 640 600 C880 520 1100 660 1360 580 C1600 520 1760 620 1920 560 V900 Z";
  }
  return "M0 900 V560 C120 500 200 620 320 540 C440 460 520 600 680 520 C840 440 960 600 1120 520 C1280 440 1400 580 1560 500 C1720 420 1800 560 1920 500 V900 Z";
}
