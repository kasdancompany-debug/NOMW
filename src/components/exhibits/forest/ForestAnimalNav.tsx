"use client";

import { getAnimal } from "@/content/animals";
import {
  FOREST_EXHIBIT_SUBTITLE,
  FOREST_EXHIBIT_TITLE,
  forestAnimals,
  forestCopy,
  forestSilhouetteSrc,
} from "@/content/exhibits/forest/content";
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
    <aside className="flex h-full w-[17.5rem] shrink-0 flex-col border-r border-[rgba(111,143,94,0.22)] bg-[rgba(6,14,12,0.72)] px-4 py-5 backdrop-blur-[6px] xl:w-[19rem] xl:px-5">
      <p className="font-[family-name:var(--font-display)] text-[length:var(--text-body-sm)] leading-snug tracking-[0.02em] text-[var(--text-on-dark)]">
        <StaffLogoHold>The Northern Ontario Museum of Wonder</StaffLogoHold>
      </p>

      <div className="mt-6 flex items-start gap-2">
        <h1 className="font-[family-name:var(--font-ui)] text-[15px] font-semibold tracking-[0.14em] text-[var(--text-on-dark)] uppercase">
          {FOREST_EXHIBIT_TITLE}
        </h1>
        <span aria-hidden className="mt-0.5 text-[var(--color-aurora-teal)]">
          ⌃
        </span>
      </div>
      <p className="mt-3 text-[length:var(--text-body-sm)] leading-relaxed text-[var(--text-on-dark-muted)]">
        {forestCopy.navLead}
      </p>
      <p className="sr-only">{FOREST_EXHIBIT_SUBTITLE}</p>

      <nav className="mt-6 min-h-0 flex-1 overflow-y-auto pr-1" aria-label="Forest animals">
        <ul className="space-y-1.5">
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
                    "flex w-full items-center gap-3 rounded-[10px] px-3 py-3 text-left",
                    active
                      ? "bg-[rgba(42,74,56,0.85)] ring-1 ring-[rgba(111,143,94,0.55)]"
                      : "hover:bg-white/5",
                  )}
                  onClick={() => onSelect(index)}
                >
                  <span className="flex h-10 w-12 shrink-0 items-end justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={forestSilhouetteSrc(entry.animalId)}
                      alt=""
                      className="max-h-10 max-w-full object-contain brightness-0 invert opacity-90"
                      draggable={false}
                    />
                  </span>
                  <span
                    className={cn(
                      "font-[family-name:var(--font-ui)] text-[13px] tracking-[0.12em] uppercase",
                      active ? "text-[var(--text-on-dark)]" : "text-[var(--text-on-dark-muted)]",
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
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-[10px] border border-[rgba(212,176,122,0.45)] bg-[rgba(12,24,20,0.65)] px-4 py-3.5 text-[13px] tracking-[0.14em] text-[var(--color-museum-warm)] uppercase"
        onClick={onCompare}
      >
        <span aria-hidden className="text-base opacity-80">
          ▣▣
        </span>
        {forestCopy.compareMode}
      </Touchable>
    </aside>
  );
}
