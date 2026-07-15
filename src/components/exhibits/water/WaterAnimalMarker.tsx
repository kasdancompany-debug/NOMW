"use client";

import { motion } from "framer-motion";
import { getAnimal } from "@/content/animals";
import type { WaterAnimalPlacement } from "@/content/exhibits/water/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { pressDepthTap, pressTransition } from "@/lib/motion/touch";
import { cn } from "@/utils/cn";

type WaterAnimalMarkerProps = {
  placement: WaterAnimalPlacement;
  selected: boolean;
  onSelect: () => void;
};

export function WaterAnimalMarker({ placement, selected, onSelect }: WaterAnimalMarkerProps) {
  const reducedMotion = useReducedMotion();
  const animal = getAnimal(placement.animalId);
  if (!animal) return null;

  return (
    <motion.button
      type="button"
      className={cn(
        "absolute z-20 touch-target-md touch-pressable -translate-x-1/2 -translate-y-1/2 rounded-full border px-[var(--space-4)]",
        "font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] tracking-[var(--tracking-title)]",
        selected
          ? "border-[var(--color-museum-warm)] bg-[var(--color-museum-warm)] text-[var(--text-on-accent)]"
          : "border-[var(--glass-border)] bg-[rgba(8,24,34,0.72)] text-[var(--text-on-dark)] backdrop-blur-[var(--glass-blur)]",
      )}
      style={{ left: `${placement.x * 100}%`, top: `${placement.y * 100}%` }}
      whileTap={pressDepthTap(reducedMotion)}
      transition={pressTransition(reducedMotion)}
      onClick={onSelect}
      aria-label={animal.commonName}
    >
      {animal.commonName}
    </motion.button>
  );
}
