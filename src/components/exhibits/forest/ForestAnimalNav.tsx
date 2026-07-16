"use client";

import { getAnimal } from "@/content/animals";
import {
  FOREST_EXHIBIT_SUBTITLE,
  FOREST_EXHIBIT_TITLE,
  forestAnimals,
  forestCopy,
} from "@/content/exhibits/forest/content";
import {
  AnimalSilhouette,
  silhouetteKindFromAnimalId,
} from "@/components/animals/AnimalSilhouette";
import { StaffLogoHold } from "@/components/staff/StaffLogoHold";
import { Touchable } from "@/components/touch/Touchable";
import { cn } from "@/utils/cn";

type ForestAnimalNavProps = {
  activeIndex: number;
  onSelect: (index: number) => void;
  onCompare: () => void;
};

/**
 * Left rail — brand, exhibit framing, animal list, compare entry.
 */
export function ForestAnimalNav({ activeIndex, onSelect, onCompare }: ForestAnimalNavProps) {
  return (
    <aside className="flex h-full w-[15.5rem] shrink-0 flex-col border-r border-white/[0.06] bg-[rgba(4,10,9,0.42)] px-[var(--space-5)] py-[var(--space-6)] backdrop-blur-[10px] xl:w-[16.5rem]">
      <p className="font-[family-name:var(--font-display)] text-[13px] leading-snug tracking-[0.01em] text-white/90">
        <StaffLogoHold>The Northern Ontario Museum of Wonder</StaffLogoHold>
      </p>

      <div className="mt-[var(--space-8)] border-t border-white/[0.08] pt-[var(--space-6)]">
        <h1 className="font-[family-name:var(--font-ui)] text-[12px] font-semibold tracking-[0.2em] text-white/95 uppercase">
          {FOREST_EXHIBIT_TITLE}
        </h1>
        <p className="mt-[var(--space-3)] max-w-[20ch] text-[13px] leading-relaxed text-white/55">
          {forestCopy.navLead}
        </p>
        <p className="sr-only">{FOREST_EXHIBIT_SUBTITLE}</p>
      </div>

      <nav
        className="mt-[var(--space-6)] min-h-0 flex-1 overflow-y-auto"
        aria-label="Forest animals"
      >
        <ul className="space-y-[2px]">
          {forestAnimals.map((entry, index) => {
            const animal = getAnimal(entry.animalId);
            const active = index === activeIndex;
            if (!animal) return null;
            return (
              <li key={entry.animalId}>
                <Touchable
                  soft
                  glow={!active}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "flex w-full items-center gap-[var(--space-3)] rounded-[var(--radius-sm)] px-[var(--space-3)] py-[0.7rem] text-left transition-colors",
                    active
                      ? "bg-[rgba(90,140,110,0.28)]"
                      : "hover:bg-white/[0.04]",
                  )}
                  onClick={() => onSelect(index)}
                >
                  <span className="flex h-8 w-9 shrink-0 items-end justify-center text-white/85">
                    <AnimalSilhouette
                      kind={silhouetteKindFromAnimalId(entry.animalId)}
                      compact
                      className="h-7 text-white/90"
                    />
                  </span>
                  <span
                    className={cn(
                      "font-[family-name:var(--font-ui)] text-[12px] tracking-[0.14em] uppercase",
                      active ? "text-white" : "text-white/55",
                    )}
                  >
                    {animal.commonName}
                  </span>
                </Touchable>
              </li>
            );
          })}
        </ul>
      </nav>

      <Touchable
        soft
        glow
        className="mt-[var(--space-4)] flex w-full items-center justify-center gap-[var(--space-3)] rounded-[var(--radius-sm)] border border-[rgba(212,176,122,0.35)] px-[var(--space-4)] py-[0.85rem] text-[12px] tracking-[0.16em] text-[var(--color-museum-warm)] uppercase"
        onClick={onCompare}
      >
        {forestCopy.compareMode}
      </Touchable>
    </aside>
  );
}
