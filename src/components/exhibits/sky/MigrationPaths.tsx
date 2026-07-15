"use client";

import { motion } from "framer-motion";
import { getAnimal } from "@/content/animals";
import { migrationPaths, skyCopy } from "@/content/exhibits/sky/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { AnimalId } from "@/types/content";

type MigrationPathsProps = {
  highlightAnimalId?: AnimalId | null;
};

/**
 * Simplified animated migration lines over the panorama coordinate space.
 */
export function MigrationPaths({ highlightAnimalId }: MigrationPathsProps) {
  const reducedMotion = useReducedMotion();

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      {migrationPaths.map((path, index) => {
        const animal = getAnimal(path.animalId);
        const active = !highlightAnimalId || highlightAnimalId === path.animalId;
        const d = path.points
          .map((point, i) => {
            const x = point.x * 100;
            const y = point.y * 100;
            return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
          })
          .join(" ");

        return (
          <g key={path.id} opacity={active ? 1 : 0.2}>
            <motion.path
              d={d}
              fill="none"
              stroke={
                index === 0
                  ? "rgba(212,176,122,0.85)"
                  : index === 1
                    ? "rgba(120,200,190,0.8)"
                    : "rgba(180,210,230,0.75)"
              }
              strokeWidth="0.55"
              strokeLinecap="round"
              strokeDasharray="2.5 2"
              initial={reducedMotion ? undefined : { pathLength: 0, opacity: 0.4 }}
              animate={
                reducedMotion
                  ? { pathLength: 1, opacity: 0.85 }
                  : { pathLength: [0.15, 1], opacity: [0.45, 0.9, 0.55] }
              }
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { duration: 8 + index * 1.5, repeat: Infinity, ease: "easeInOut" }
              }
            />
            {animal ? (
              <text
                x={path.points[0]!.x * 100}
                y={path.points[0]!.y * 100 - 2}
                fill="rgba(238,243,246,0.85)"
                fontSize="2.2"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {animal.commonName}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

type MigrationLegendProps = {
  selectedId?: AnimalId | null;
};

export function MigrationLegend({ selectedId }: MigrationLegendProps) {
  const paths = selectedId
    ? migrationPaths.filter((p) => p.animalId === selectedId)
    : migrationPaths;

  return (
    <div className="space-y-[var(--space-2)]">
      <p className="text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
        {skyCopy.migrationLead}
      </p>
      <ul className="space-y-[var(--space-2)]">
        {(paths.length ? paths : migrationPaths).map((path) => {
          const animal = getAnimal(path.animalId);
          if (!animal) return null;
          return (
            <li
              key={path.id}
              className="border-l border-[var(--color-aurora-teal)]/50 pl-[var(--space-3)] text-[length:var(--text-body-sm)] text-[var(--text-on-dark)]"
            >
              <span className="text-[var(--color-museum-warm)]">{animal.commonName}</span>
              {" — "}
              {path.seasonLabel}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
