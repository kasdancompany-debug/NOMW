"use client";

import type { ClueMotif } from "@/content/exhibits/tracks/content";
import { cn } from "@/utils/cn";

type ClueVisualProps = {
  motif: ClueMotif;
  className?: string;
};

/**
 * Shared motif registry — challenges only pass a data key, never their own component.
 */
export function ClueVisual({ motif, className }: ClueVisualProps) {
  return (
    <div
      className={cn(
        "flex min-h-[14rem] w-full items-center justify-center rounded-[var(--radius-sm)] bg-white/6 p-[var(--space-4)]",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 280 180" className="h-44 w-full max-w-md text-[var(--color-museum-warm)]">
        {renderMotif(motif)}
      </svg>
    </div>
  );
}

function renderMotif(motif: ClueMotif) {
  switch (motif) {
    case "print-moose":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="3.5">
          <path d="M70 50 C78 30 98 28 108 48 C112 58 104 70 92 72 C80 74 68 64 70 50 Z" />
          <path d="M118 58 C126 38 146 36 156 56 C160 66 152 78 140 80 C128 82 116 72 118 58 Z" />
          <path d="M90 95 C70 120 60 150 78 160" strokeOpacity="0.35" strokeDasharray="5 7" />
        </g>
      );
    case "print-wolf":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="3">
          <ellipse cx="110" cy="70" rx="28" ry="34" />
          <circle cx="92" cy="48" r="7" />
          <circle cx="112" cy="42" r="7" />
          <circle cx="130" cy="48" r="7" />
          <circle cx="140" cy="62" r="6" />
          <path d="M110 110 V150" strokeOpacity="0.35" strokeDasharray="4 6" />
        </g>
      );
    case "print-hare":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="3">
          <ellipse cx="150" cy="70" rx="36" ry="18" />
          <ellipse cx="150" cy="100" rx="36" ry="18" />
          <ellipse cx="95" cy="120" rx="16" ry="12" />
          <ellipse cx="205" cy="120" rx="16" ry="12" />
        </g>
      );
    case "print-bear":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="3">
          <ellipse cx="140" cy="95" rx="48" ry="36" />
          {[95, 118, 140, 162, 185].map((x) => (
            <circle key={x} cx={x} cy="58" r="8" />
          ))}
        </g>
      );
    case "print-deer":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="3.5">
          <path d="M110 40 C120 28 138 28 146 42 C150 52 142 62 132 64 C120 66 108 54 110 40 Z" />
          <path d="M148 48 C158 36 176 36 184 50 C188 60 180 70 170 72 C158 74 146 62 148 48 Z" />
        </g>
      );
    case "fur-lynx":
      return (
        <g fill="currentColor">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path
              key={i}
              d={`M${80 + i * 22} 140 Q${90 + i * 22} 40 ${100 + i * 22} 140`}
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              opacity={0.55 + i * 0.07}
            />
          ))}
        </g>
      );
    case "fur-fox":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="4">
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M${90 + i * 24} 130 Q${100 + i * 24} 50 ${108 + i * 24} 130`}
              opacity={0.6}
            />
          ))}
          <circle cx="200" cy="48" r="6" fill="currentColor" stroke="none" opacity="0.7" />
        </g>
      );
    case "feather-loon":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M60 120 C120 40 200 40 240 100" />
          <path d="M80 110 C130 60 190 58 230 95" opacity="0.5" />
          <path d="M100 100 L150 70 M120 95 L165 72 M140 92 L180 76" opacity="0.45" />
        </g>
      );
    case "feather-owl":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M70 110 C130 30 210 30 250 105" />
          <path d="M90 100 Q140 70 190 72 Q220 74 240 95" strokeDasharray="3 5" opacity="0.7" />
        </g>
      );
    case "nest-eagle":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M140 30 V80" />
          <path d="M70 100 C100 80 180 80 210 100 L190 140 C160 155 120 155 90 140 Z" />
          <path d="M85 115 H195 M95 128 H185" opacity="0.45" />
        </g>
      );
    case "lodge-beaver":
      return (
        <g fill="currentColor" opacity="0.85">
          <ellipse cx="140" cy="120" rx="70" ry="40" />
          <path d="M90 110 Q140 60 190 110" fill="none" stroke="currentColor" strokeWidth="4" />
          <rect x="40" y="130" width="200" height="10" opacity="0.35" />
        </g>
      );
    case "den-fox":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M40 140 L120 60 L240 140" />
          <ellipse cx="140" cy="125" rx="28" ry="18" fill="rgba(8,18,24,0.6)" />
        </g>
      );
    case "feeding-bark":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M90 150 L120 40" />
          <path d="M120 40 L145 150" />
          <path d="M160 150 L175 70 L195 150" />
          <circle cx="210" cy="130" r="4" fill="currentColor" />
          <circle cx="225" cy="140" r="3" fill="currentColor" />
          <circle cx="200" cy="145" r="3" fill="currentColor" />
        </g>
      );
    case "feeding-fish-remains":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M70 90 C110 60 170 60 210 95" />
          <path d="M90 110 C130 85 170 88 200 115" opacity="0.5" />
          <circle cx="100" cy="130" r="3" fill="currentColor" />
          <circle cx="125" cy="140" r="2.5" fill="currentColor" />
          <circle cx="155" cy="135" r="3" fill="currentColor" />
          <circle cx="180" cy="145" r="2" fill="currentColor" />
        </g>
      );
    case "feeding-browse":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M140 160 V50" />
          <path d="M140 70 L90 40 M140 90 L95 70 M140 110 L100 100" />
          <path d="M140 70 L190 35 M140 95 L200 75 M140 115 L185 105" />
        </g>
      );
    case "sil-moose":
      return (
        <path
          d="M40 140 L70 90 L95 70 L120 75 L150 55 L180 70 L210 65 L235 90 L250 140 Z"
          fill="currentColor"
          opacity="0.8"
        />
      );
    case "sil-crane":
      return (
        <path
          d="M60 140 L90 100 L110 50 L120 20 L130 55 L160 95 L200 110 L230 140"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />
      );
    case "sil-sturgeon":
      return (
        <path
          d="M40 100 C90 70 170 70 230 95 C200 120 120 130 50 115 Z"
          fill="currentColor"
          opacity="0.8"
        />
      );
    case "sil-bat":
      return (
        <path
          d="M140 95 C110 70 70 65 40 85 C80 90 110 105 125 120 C132 108 140 105 140 95 C140 105 148 108 155 120 C170 105 200 90 240 85 C210 65 170 70 140 95 Z"
          fill="currentColor"
          opacity="0.85"
        />
      );
    case "call-wave":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M40 100 C70 70 100 70 130 100 C160 130 190 130 220 100 C240 85 255 85 270 95" />
          <path
            d="M40 120 C70 90 100 90 130 120 C160 150 190 150 220 120"
            opacity="0.45"
          />
          <circle cx="70" cy="60" r="5" fill="currentColor" opacity="0.5" />
          <circle cx="95" cy="48" r="3" fill="currentColor" opacity="0.4" />
        </g>
      );
    default:
      return null;
  }
}
