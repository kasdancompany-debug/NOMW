"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";

type NightForestStageProps = {
  nightVision: boolean;
};

/**
 * Nearly black forest stage — moonlight and canopy layers for the night beam.
 */
export function NightForestStage({ nightVision }: NightForestStageProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden",
        nightVision && "[filter:hue-rotate(78deg)_saturate(0.45)_brightness(1.12)_contrast(1.05)]",
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#05080f_0%,#080e18_42%,#0a121c_70%,#061018_100%)]" />

      <div className="absolute -top-[12%] right-[4%] h-[58%] w-[48%] rounded-full bg-[radial-gradient(circle,rgba(180,200,220,0.2),transparent_66%)]" />
      <div className="absolute top-[7%] right-[17%] h-20 w-20 rounded-full bg-[radial-gradient(circle,rgba(235,239,236,0.72),rgba(170,195,210,0.18)_54%,transparent_72%)] blur-[1px]" />
      <div className="absolute inset-x-0 top-[8%] h-[40%] bg-[linear-gradient(118deg,transparent_18%,rgba(42,112,108,0.06)_37%,rgba(90,142,126,0.11)_50%,rgba(56,95,112,0.05)_66%,transparent_82%)] blur-2xl" />

      {/* Sparse stars: enough depth to read as night, never a planetarium. */}
      <svg className="absolute inset-x-0 top-0 h-[42%] w-full" viewBox="0 0 1920 420" aria-hidden>
        {[
          [132, 96, 1.8],
          [286, 168, 1.2],
          [442, 78, 1.5],
          [638, 142, 1.1],
          [812, 70, 1.7],
          [1030, 132, 1.3],
          [1210, 62, 1.2],
          [1420, 154, 1.6],
          [1608, 88, 1.1],
          [1780, 190, 1.5],
        ].map(([cx, cy, r], index) => (
          <circle
            key={index}
            cx={cx}
            cy={cy}
            r={r}
            fill="rgba(224,232,232,0.58)"
          />
        ))}
      </svg>

      {!reducedMotion ? (
        <>
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 h-[40%] bg-[radial-gradient(ellipse_at_20%_30%,rgba(40,60,70,0.35),transparent_50%)]"
            animate={{ opacity: [0.35, 0.55, 0.4], x: [0, 12, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute inset-x-[10%] top-[15%] h-[25%] bg-[radial-gradient(ellipse_at_70%_40%,rgba(30,50,60,0.3),transparent_55%)]"
            animate={{ opacity: [0.25, 0.45, 0.3], x: [0, -16, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      ) : (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[40%] bg-[radial-gradient(ellipse_at_20%_30%,rgba(40,60,70,0.35),transparent_50%)]" />
      )}

      {/* Distant ridge and tree line establish depth before the foreground trunks. */}
      <svg
        className="absolute inset-x-0 bottom-[8%] h-[55%] w-full"
        viewBox="0 0 1920 620"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0 620 V410 C160 350 280 410 430 330 C590 250 720 360 900 285 C1080 210 1220 350 1390 275 C1570 195 1710 300 1920 220 V620 Z"
          fill="#0b1a21"
          opacity="0.92"
        />
        <path
          d="M0 620 V485 C170 430 310 490 470 415 C650 335 820 455 980 380 C1160 300 1330 440 1490 355 C1660 270 1790 365 1920 320 V620 Z"
          fill="#071218"
        />
      </svg>

      <svg
        className="absolute inset-x-0 bottom-0 h-[82%] w-full text-[#02060c]"
        viewBox="0 0 1920 900"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M0 900 V390 C24 330 46 260 60 170 C76 270 96 340 122 405 L164 900 Z M165 900 L230 270 C246 195 256 120 268 42 C286 148 296 222 314 286 L382 900 Z M360 900 L430 350 C448 280 462 216 474 128 C490 232 508 296 530 366 L606 900 Z M590 900 L666 258 C686 172 698 105 708 18 C728 124 740 194 758 276 L836 900 Z M826 900 L900 338 C918 260 932 194 944 92 C960 210 976 274 998 354 L1072 900 Z M1062 900 L1136 292 C1154 210 1168 136 1178 48 C1198 162 1210 226 1232 310 L1308 900 Z M1298 900 L1374 372 C1390 296 1402 226 1416 142 C1432 248 1450 318 1470 390 L1548 900 Z M1534 900 L1614 282 C1634 198 1644 126 1656 34 C1674 150 1688 218 1708 302 L1790 900 Z M1770 900 L1840 382 C1858 310 1872 250 1884 164 C1900 266 1914 332 1920 356 V900 Z"
          opacity="0.97"
        />
        <path
          fill="#071018"
          d="M0 900 V560 C120 500 200 620 320 540 C440 460 520 600 680 520 C840 440 960 600 1120 520 C1280 440 1400 580 1560 500 C1720 420 1800 560 1920 500 V900 Z"
          opacity="0.9"
        />
      </svg>

      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-[linear-gradient(180deg,transparent,rgba(18,38,46,0.62))]" />
      {!reducedMotion ? (
        <motion.div
          className="pointer-events-none absolute inset-x-[5%] bottom-[8%] h-[12%] rounded-full bg-white/5 blur-3xl"
          animate={{ opacity: [0.12, 0.22, 0.14], x: [0, 24, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}
    </div>
  );
}
