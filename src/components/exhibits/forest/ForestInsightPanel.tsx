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
  const common = "mt-0.5 h-5 w-5 shrink-0 text-[var(--color-aurora-teal)]";
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
 * Right insight panel — tabs, provisional stats, narrative, call / profile actions.
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
    <section className="flex h-full w-[min(100%,26rem)] shrink-0 flex-col xl:w-[28rem]">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[var(--radius-md)] border border-[rgba(111,143,94,0.32)] bg-[rgba(8,18,16,0.78)] px-[var(--space-6)] py-[var(--space-5)] shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-[10px]">
        <div
          className="flex flex-wrap gap-[var(--space-2)]"
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
                  "rounded-[var(--radius-sm)] px-[var(--space-4)] py-[var(--space-2)] text-[11px] tracking-[0.14em] uppercase",
                  active
                    ? "bg-[rgba(90,140,110,0.95)] text-[#0c1612]"
                    : "bg-white/[0.05] text-[var(--text-on-dark-muted)]",
                )}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.label}
              </Touchable>
            );
          })}
        </div>

        <div className="mt-[var(--space-6)] min-h-0 flex-1 overflow-y-auto pr-1" role="tabpanel">
          {activeTab === "meet" ? (
            <div className="grid gap-[var(--space-6)] sm:grid-cols-[0.85fr_1.15fr]">
              <ul className="space-y-[var(--space-5)]">
                {stats.map((stat) => (
                  <li key={stat.id} className="flex items-start gap-[var(--space-3)]">
                    <StatIcon id={stat.id} />
                    <div>
                      <p className="text-[10px] tracking-[0.16em] text-[var(--text-on-dark-muted)] uppercase">
                        {stat.label}
                      </p>
                      <p className="mt-[var(--space-1)] text-[15px] leading-snug text-[var(--text-on-dark)]">
                        {stat.value}
                      </p>
                    </div>
                  </li>
                ))}
                <li className="pt-[var(--space-1)] text-[10px] tracking-[0.08em] text-[rgba(212,176,122,0.7)] uppercase">
                  {forestCopy.statsPending}
                </li>
              </ul>

              <div>
                <p className="text-[11px] tracking-[0.16em] text-[var(--color-aurora-teal)] uppercase">
                  {forestCopy.aboutTitle} the {animal.commonName.toLowerCase()}
                </p>
                <p className="mt-[var(--space-3)] text-[length:var(--text-body-sm)] leading-[1.65] text-[var(--text-on-dark)]">
                  {expanded ? animal.fullDescription : animal.shortIntroduction}
                </p>
                <QuietButton
                  className="mt-[var(--space-3)] px-0"
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

                {didYouKnow ? (
                  <div className="mt-[var(--space-6)] rounded-[var(--radius-md)] border border-[rgba(111,143,94,0.28)] bg-[rgba(20,40,34,0.55)] px-[var(--space-4)] py-[var(--space-4)]">
                    <p className="flex items-center gap-[var(--space-2)] text-[11px] tracking-[0.14em] text-[var(--color-museum-warm)] uppercase">
                      <span aria-hidden>✽</span>
                      {forestCopy.didYouKnow}
                    </p>
                    <p className="mt-[var(--space-3)] text-[length:var(--text-body-sm)] leading-[1.65] text-[var(--text-on-dark-muted)]">
                      {didYouKnow}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {activeTab === "size" ? (
            <SizeComparison
              maxHeightPx={180}
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
            <p className="max-w-[36ch] text-[length:var(--text-body)] leading-[1.7] text-[var(--text-on-dark)]">
              {content.habitatBlurb}
            </p>
          ) : null}

          {activeTab === "food" ? (
            <p className="max-w-[36ch] text-[length:var(--text-body)] leading-[1.7] text-[var(--text-on-dark)]">
              {content.foodBlurb}
            </p>
          ) : null}

          {activeTab === "survival" ? (
            <p className="max-w-[36ch] text-[length:var(--text-body)] leading-[1.7] text-[var(--text-on-dark)]">
              {content.survivalBlurb}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-[var(--space-5)] flex flex-col gap-[var(--space-3)] sm:flex-row sm:items-stretch">
        <div className="min-w-0 flex-1">
          <AnimalCallButton animal={animal} prominent />
        </div>
        <LargeTouchButton
          variant="secondary"
          className="min-w-[10.5rem] border-white/15 bg-[rgba(12,22,20,0.75)]"
          onClick={onOpenFullProfile}
        >
          {forestCopy.fullProfile} ›
        </LargeTouchButton>
      </div>
    </section>
  );
}
