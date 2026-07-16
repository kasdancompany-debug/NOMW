"use client";

import { useState } from "react";
import type { Animal } from "@/types/content";
import type { ForestProfileTab } from "@/content/exhibits/forest/content";
import {
  forestCopy,
  forestProfileTabs,
  getForestProvisionalStats,
  type ForestAnimalPresentation,
} from "@/content/exhibits/forest/content";
import { SizeComparison, humanSizeSubject } from "@/components/animals/SizeComparison";
import { AnimalCallButton } from "@/components/exhibits/forest/AnimalCallButton";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { QuietButton } from "@/components/touch/QuietButton";
import { Touchable } from "@/components/touch/Touchable";
import { getAnalytics } from "@/lib/analytics";
import { cn } from "@/utils/cn";

type ForestInsightPanelProps = {
  animal: Animal;
  content: ForestAnimalPresentation;
  activeTab: ForestProfileTab;
  onTabChange: (tab: ForestProfileTab) => void;
  onOpenFullProfile: () => void;
};

function StatIcon({ id }: { id: string }) {
  const common = "mt-0.5 h-[18px] w-[18px] shrink-0 text-[var(--color-aurora-teal)]/90";
  switch (id) {
    case "height":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 4v16M18 4v16M6 4h3M6 20h3M18 4h-3M18 20h-3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "weight":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M7 8h10l1 12H6L7 8Z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10 8a2 2 0 0 1 4 0" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "lifespan":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 8v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <ellipse cx="9" cy="14" rx="4" ry="5.5" stroke="currentColor" strokeWidth="1.6" />
          <ellipse cx="16" cy="14" rx="3.2" ry="4.5" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
  }
}

/**
 * Right insight panel — calm editorial museum panel.
 */
export function ForestInsightPanel({
  animal,
  content,
  activeTab,
  onTabChange,
  onOpenFullProfile,
}: ForestInsightPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const stats = getForestProvisionalStats(animal.id);
  const didYouKnow =
    animal.memorableFacts.find((f) => f.confidence === "general-knowledge")?.text ??
    animal.adaptationFacts.find((f) => f.confidence === "general-knowledge")?.text;

  return (
    <section className="flex h-full w-[min(100%,24.5rem)] shrink-0 flex-col xl:w-[26rem]">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[var(--radius-md)] border border-white/[0.1] bg-[rgba(6,14,12,0.72)] px-[var(--space-5)] py-[var(--space-5)] backdrop-blur-[10px]">
        <div
          className="flex flex-wrap gap-x-[var(--space-1)] gap-y-[var(--space-2)]"
          role="tablist"
          aria-label={`${animal.commonName} profile`}
        >
          {forestProfileTabs.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <Touchable
                key={tab.id}
                soft
                glow={!active}
                role="tab"
                aria-selected={active}
                className={cn(
                  "rounded-[var(--radius-sm)] px-[0.85rem] py-[0.45rem] text-[10px] tracking-[0.16em] uppercase",
                  active
                    ? "bg-[rgba(90,140,110,0.92)] text-[#0c1612]"
                    : "text-white/50 hover:bg-white/[0.05] hover:text-white/75",
                )}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.label}
              </Touchable>
            );
          })}
        </div>

        <div className="mt-[var(--space-6)] min-h-0 flex-1 overflow-y-auto" role="tabpanel">
          {activeTab === "meet" ? (
            <div className="flex flex-col gap-[var(--space-6)]">
              <ul className="grid grid-cols-2 gap-x-[var(--space-4)] gap-y-[var(--space-5)]">
                {stats.map((stat) => (
                  <li key={stat.id} className="flex items-start gap-[var(--space-3)]">
                    <StatIcon id={stat.id} />
                    <div>
                      <p className="text-[10px] tracking-[0.16em] text-white/45 uppercase">
                        {stat.label}
                      </p>
                      <p className="mt-1 text-[14px] leading-snug text-white/92">{stat.value}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="text-[10px] tracking-[0.1em] text-[rgba(212,176,122,0.55)] uppercase">
                {forestCopy.statsPending}
              </p>

              <div className="border-t border-white/[0.08] pt-[var(--space-5)]">
                <p className="text-[10px] tracking-[0.16em] text-[var(--color-aurora-teal)] uppercase">
                  {forestCopy.aboutTitle} the {animal.commonName.toLowerCase()}
                </p>
                <p className="mt-[var(--space-3)] text-[14px] leading-[1.7] text-white/82">
                  {expanded ? animal.fullDescription : animal.shortIntroduction}
                </p>
                <QuietButton
                  className="mt-[var(--space-3)] px-0 text-[13px]"
                  onClick={() =>
                    setExpanded((value) => {
                      const next = !value;
                      if (next) getAnalytics().track("fact_expanded");
                      return next;
                    })
                  }
                >
                  {expanded ? forestCopy.showLess : forestCopy.learnMore}
                </QuietButton>
              </div>

              {didYouKnow ? (
                <div className="rounded-[var(--radius-sm)] border border-white/[0.08] bg-white/[0.03] px-[var(--space-4)] py-[var(--space-4)]">
                  <p className="text-[10px] tracking-[0.16em] text-[var(--color-museum-warm)] uppercase">
                    {forestCopy.didYouKnow}
                  </p>
                  <p className="mt-[var(--space-3)] text-[13px] leading-[1.65] text-white/65">
                    {didYouKnow}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          {activeTab === "size" ? (
            <SizeComparison
              maxHeightPx={160}
              note={forestCopy.sizeNote}
              subjects={[
                {
                  id: animal.id,
                  label: animal.commonName,
                  relativeHeight: content.relativeHeight,
                },
                humanSizeSubject(),
              ]}
            />
          ) : null}

          {activeTab === "habitat" ? (
            <p className="max-w-[34ch] text-[15px] leading-[1.75] text-white/85">
              {content.habitatBlurb}
            </p>
          ) : null}

          {activeTab === "food" ? (
            <p className="max-w-[34ch] text-[15px] leading-[1.75] text-white/85">
              {content.foodBlurb}
            </p>
          ) : null}

          {activeTab === "survival" ? (
            <p className="max-w-[34ch] text-[15px] leading-[1.75] text-white/85">
              {content.survivalBlurb}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-[var(--space-4)] grid grid-cols-[1.2fr_1fr] gap-[var(--space-3)]">
        <AnimalCallButton animal={animal} prominent />
        <LargeTouchButton
          variant="secondary"
          className="border-white/12 bg-[rgba(8,16,14,0.7)] text-[13px]"
          onClick={onOpenFullProfile}
        >
          {forestCopy.fullProfile} ›
        </LargeTouchButton>
      </div>
    </section>
  );
}
