"use client";

import { cn } from "@/utils/cn";

export type SilhouetteKind =
  | "moose"
  | "black-bear"
  | "grey-wolf"
  | "woodland-caribou"
  | "white-tailed-deer"
  | "canada-lynx"
  | "human"
  | "generic";

type AnimalSilhouetteProps = {
  kind: SilhouetteKind;
  className?: string;
  /** Fill uses currentColor */
  prominent?: boolean;
  /** Hide placeholder caption — for compact nav / chrome icons */
  compact?: boolean;
};

/**
 * Stylized species silhouettes for MVP scale + presence.
 * Replace with photographic cutouts / illustrated finals later — keep relative scale via height.
 */
export function AnimalSilhouette({
  kind,
  className,
  prominent = true,
  compact = false,
}: AnimalSilhouetteProps) {
  return (
    <svg
      viewBox="0 0 200 220"
      className={cn(
        "h-full w-auto",
        prominent ? "text-[var(--color-canopy)]" : "text-[var(--color-canopy)]/50",
        kind === "human" && (prominent ? "text-[var(--color-mist)]/70" : "text-[var(--color-mist)]/45"),
        className,
      )}
      aria-hidden
    >
      <path d={pathFor(kind)} fill="currentColor" />
    </svg>
  );
}

export function silhouetteKindFromAnimalId(animalId: string): SilhouetteKind {
  switch (animalId) {
    case "moose":
    case "black-bear":
    case "grey-wolf":
    case "woodland-caribou":
    case "white-tailed-deer":
    case "canada-lynx":
      return animalId;
    default:
      return "generic";
  }
}

function pathFor(kind: SilhouetteKind): string {
  switch (kind) {
    case "moose":
      return "M28 188 C40 150 52 120 70 108 C78 88 92 72 110 78 C128 70 148 86 152 108 C168 118 178 140 172 168 C168 186 150 196 128 192 L118 200 L96 198 L88 188 C70 196 48 198 28 188 Z M108 78 C118 52 132 40 148 48 C138 62 128 70 118 78 Z M96 70 C86 48 72 40 58 48 C70 58 84 66 96 70 Z M152 100 L168 86 M62 96 L48 84";
    case "black-bear":
      return "M40 190 C48 150 58 120 78 108 C96 96 120 100 136 118 C152 130 164 152 160 176 C156 194 132 204 104 200 C78 204 52 200 40 190 Z M92 108 C88 90 78 80 68 84 C78 92 86 100 92 108 Z M124 108 C130 90 142 82 152 88 C144 96 134 104 124 108 Z";
    case "grey-wolf":
      return "M24 188 C40 150 58 120 86 112 C108 100 136 110 152 132 C168 148 172 170 160 186 C148 200 118 204 88 198 C62 202 36 198 24 188 Z M140 120 L172 96 L168 112 Z M96 108 C92 88 80 76 66 82 C78 90 88 100 96 108 Z";
    case "woodland-caribou":
      return "M36 190 C48 155 62 128 84 118 C102 106 128 112 144 130 C158 144 166 166 160 184 C152 200 124 204 96 198 C70 202 46 200 36 190 Z M108 112 C118 78 138 58 158 62 C148 82 130 98 114 112 Z M88 108 C78 82 62 66 44 72 C56 86 72 98 88 108 Z M152 108 L176 88";
    case "white-tailed-deer":
      return "M48 192 C58 155 70 128 90 118 C110 106 134 114 148 136 C158 152 160 172 150 188 C138 202 112 204 88 198 C66 202 52 200 48 192 Z M118 114 C126 88 140 72 156 76 C146 92 132 104 120 114 Z M96 110 C88 86 74 72 58 78 C70 90 84 102 96 110 Z M148 128 L170 118";
    case "canada-lynx":
      return "M52 192 C62 160 74 138 96 132 C118 124 144 136 152 160 C158 178 148 194 124 198 C98 204 68 200 52 192 Z M108 130 C112 108 124 96 136 100 C130 114 120 124 110 130 Z M92 128 C86 108 72 96 60 102 C70 112 82 122 92 128 Z M118 104 L112 88 M130 102 L138 86";
    case "human":
      return "M92 48 C104 48 112 56 112 68 C112 80 104 88 92 88 C80 88 72 80 72 68 C72 56 80 48 92 48 Z M68 96 H116 L122 150 H108 L104 200 H80 L76 150 H62 Z";
    case "generic":
    default:
      return "M60 190 C70 150 82 120 100 112 C118 104 140 118 148 148 C154 172 140 196 112 200 C84 204 64 198 60 190 Z M100 112 C104 92 116 80 128 86 C120 98 110 106 100 112 Z";
  }
}
