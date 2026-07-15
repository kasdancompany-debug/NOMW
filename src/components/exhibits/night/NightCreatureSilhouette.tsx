"use client";

import type { NightCreature } from "@/content/exhibits/night/content";
import { cn } from "@/utils/cn";

type NightCreatureSilhouetteProps = {
  kind: NightCreature["silhouette"];
  className?: string;
  lit?: boolean;
};

export function NightCreatureSilhouette({ kind, className, lit }: NightCreatureSilhouetteProps) {
  const tone = lit ? "text-[rgba(230,220,200,0.92)]" : "text-[rgba(160,175,190,0.55)]";

  if (kind === "moths") {
    return (
      <svg viewBox="0 0 120 80" className={cn("h-16 w-24", tone, className)} aria-hidden>
        <ellipse cx="28" cy="36" rx="10" ry="6" fill="currentColor" opacity="0.7" />
        <ellipse cx="52" cy="28" rx="8" ry="5" fill="currentColor" opacity="0.55" />
        <ellipse cx="74" cy="42" rx="11" ry="6" fill="currentColor" opacity="0.65" />
        <ellipse cx="96" cy="30" rx="7" ry="4" fill="currentColor" opacity="0.5" />
        <circle cx="40" cy="50" r="2" fill="currentColor" opacity="0.45" />
        <circle cx="66" cy="54" r="1.5" fill="currentColor" opacity="0.4" />
        <circle cx="88" cy="50" r="2" fill="currentColor" opacity="0.35" />
      </svg>
    );
  }

  const paths: Record<Exclude<NightCreature["silhouette"], "moths">, string> = {
    lynx: "M20 70 C28 40 40 28 52 34 C60 22 72 24 78 38 C92 42 96 58 88 70 Z M48 34 L42 18 M58 32 L62 16",
    fox: "M18 68 C30 48 40 36 54 40 C66 28 84 34 90 50 C96 62 88 72 70 70 C52 74 30 74 18 68 Z M70 42 L88 28",
    owl: "M40 20 C58 12 78 20 82 42 C86 62 70 76 50 78 C30 76 16 60 22 40 C26 28 32 22 40 20 Z M44 44 Q50 50 56 44 M42 56 Q50 62 58 56",
    bat: "M60 40 C48 28 28 24 12 36 C30 34 42 42 48 52 C52 44 56 42 60 40 C64 42 68 44 72 52 C78 42 90 34 108 36 C92 24 72 28 60 40 Z",
    squirrel: "M24 64 C34 44 48 34 62 40 C78 30 96 42 92 58 C86 72 60 76 40 70 C30 74 20 72 24 64 Z M88 50 C102 42 110 48 104 58",
    wolf: "M14 66 C28 48 44 36 62 40 C78 30 98 40 102 56 C98 70 74 74 50 72 C32 74 18 72 14 66 Z M92 44 L110 36",
  };

  return (
    <svg viewBox="0 0 120 90" className={cn("h-20 w-28", tone, className)} aria-hidden>
      <path d={paths[kind]} fill="currentColor" opacity="0.85" />
    </svg>
  );
}
