"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getAnimal } from "@/content/animals";
import { getHabitat } from "@/content/habitats";
import { forestCallAudioFor } from "@/content/exhibits/forest/calls";
import {
  forestPortraitAsset,
  hasForestPortrait,
} from "@/content/exhibits/forest/portraits";
import {
  formatConservationStatus,
  formatSeasonList,
  formatTimeList,
  relativeHeightForAnimal,
} from "@/lib/animals/profileLabels";
import { AnimalNameplate } from "@/components/animals/AnimalNameplate";
import { AnimalProfileCallButton } from "@/components/animals/AnimalProfileCallButton";
import { SizeComparison, humanSizeSubject } from "@/components/animals/SizeComparison";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { QuietButton } from "@/components/touch/QuietButton";
import { useKioskSession } from "@/hooks/useKioskSession";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";
import { getAnalytics } from "@/lib/analytics";
import { useAnimalProfileStore } from "@/stores/animal-profile.store";
import { useAudioStore } from "@/stores/audio.store";

/**
 * Shared full-screen animal profile — editorial portrait spread over the exhibit.
 */
export function AnimalProfileOverlay() {
  const reducedMotion = useReducedMotion();
  const { registerResetHandler, noteInteraction } = useKioskSession();
  const resumeBackground = useAudioStore((s) => s.resumeBackground);

  const isOpen = useAnimalProfileStore((s) => s.isOpen);
  const animalId = useAnimalProfileStore((s) => s.animalId);
  const animalIds = useAnimalProfileStore((s) => s.animalIds);
  const enableCompare = useAnimalProfileStore((s) => s.enableCompare);
  const closeProfile = useAnimalProfileStore((s) => s.closeProfile);
  const showPrevious = useAnimalProfileStore((s) => s.showPrevious);
  const showNext = useAnimalProfileStore((s) => s.showNext);
  const requestCompare = useAnimalProfileStore((s) => s.requestCompare);

  const [learnMore, setLearnMore] = useState(false);

  const animal = animalId ? getAnimal(animalId) : undefined;

  useEffect(() => {
    return registerResetHandler(() => {
      closeProfile();
      resumeBackground();
    });
  }, [closeProfile, registerResetHandler, resumeBackground]);

  useEffect(() => {
    setLearnMore(false);
  }, [animalId]);

  useEffect(() => {
    if (!isOpen) {
      resumeBackground();
      setLearnMore(false);
    }
  }, [isOpen, resumeBackground]);

  const habitats = animal
    ? animal.habitatIds
        .map((id) => getHabitat(id)?.name)
        .filter(Boolean)
        .slice(0, 3)
        .join(" · ")
    : "";

  const facts = animal
    ? animal.memorableFacts
        .filter((fact) => fact.confidence === "general-knowledge")
        .slice(0, 3)
        .map((fact) => fact.text)
    : [];
  const fallbackFacts =
    animal && facts.length < 2
      ? animal.memorableFacts.slice(0, 3).map((fact) => fact.text)
      : facts;
  const visibleFacts = (facts.length ? facts : fallbackFacts).slice(0, learnMore ? 3 : 2);

  const portrait =
    animal && hasForestPortrait(animal.id)
      ? forestPortraitAsset(animal.id, animal.commonName)
      : animal?.heroImage;

  const guestCaption =
    portrait && !portrait.placeholder && !portrait.caption?.toLowerCase().includes("placeholder")
      ? portrait.caption
      : undefined;

  return (
    <AnimatePresence>
      {isOpen && animal && portrait ? (
        <motion.div
          key={animal.id}
          className="absolute inset-0 z-[60] flex items-stretch justify-center bg-[rgba(4,10,12,0.82)] p-[var(--space-5)] backdrop-blur-[6px]"
          role="dialog"
          aria-modal="true"
          aria-label={`${animal.commonName} profile`}
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={scenicTransition(reducedMotion)}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              noteInteraction();
              closeProfile();
            }
          }}
        >
          <motion.div
            className="flex h-full w-full max-w-[108rem] overflow-hidden rounded-[var(--radius-md)] border border-white/[0.08] bg-[rgba(8,14,16,0.92)] shadow-[0_40px_100px_rgba(0,0,0,0.55)]"
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={scenicTransition(reducedMotion)}
          >
            <div className="grid min-h-0 flex-1 lg:grid-cols-[1.2fr_1fr]">
              {/* Portrait plane */}
              <div className="relative min-h-[16rem] overflow-hidden bg-[#0a1210] lg:min-h-0">
                {/* Native img — avoid next/image fill edge cases on kiosk overlay */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={portrait.src}
                  src={portrait.src}
                  alt={portrait.alt ?? animal.commonName}
                  className="absolute inset-0 h-full w-full object-cover"
                  draggable={false}
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent_55%,rgba(8,14,16,0.55)_100%)]" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(8,14,16,0.75))] p-[var(--space-6)]">
                  {guestCaption ? (
                    <p className="font-[family-name:var(--font-body)] text-[13px] tracking-[0.04em] text-white/70">
                      {guestCaption}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Editorial column */}
              <div className="flex min-h-0 flex-col overflow-hidden px-[var(--space-6)] py-[var(--space-5)] xl:px-[var(--space-8)]">
                <div className="flex items-start justify-between gap-[var(--space-4)]">
                  <AnimalNameplate
                    commonName={animal.commonName}
                    scientificName={animal.scientificName}
                    className="max-w-[28rem]"
                  />
                  <div className="flex shrink-0 flex-wrap justify-end gap-[var(--space-2)]">
                    {animalIds.length > 1 ? (
                      <>
                        <QuietButton
                          onClick={() => {
                            noteInteraction();
                            showPrevious();
                          }}
                        >
                          Previous
                        </QuietButton>
                        <QuietButton
                          onClick={() => {
                            noteInteraction();
                            showNext();
                          }}
                        >
                          Next
                        </QuietButton>
                      </>
                    ) : null}
                    {enableCompare ? (
                      <QuietButton
                        onClick={() => {
                          noteInteraction();
                          requestCompare();
                        }}
                      >
                        Compare
                      </QuietButton>
                    ) : null}
                    <LargeTouchButton
                      onClick={() => {
                        noteInteraction();
                        closeProfile();
                      }}
                    >
                      Close
                    </LargeTouchButton>
                  </div>
                </div>

                <div className="mt-[var(--space-5)] min-h-0 flex-1 space-y-[var(--space-6)] overflow-y-auto pr-1">
                  <p className="max-w-[42ch] font-[family-name:var(--font-body)] text-[length:var(--text-lead)] leading-[1.55] text-white/88">
                    {animal.shortIntroduction}
                  </p>

                  <dl className="grid grid-cols-1 gap-x-[var(--space-6)] gap-y-[var(--space-4)] border-y border-white/[0.08] py-[var(--space-5)] sm:grid-cols-2">
                    <MetaItem label="Habitat" value={habitats || "Northern Ontario landscapes"} />
                    <MetaItem
                      label="Diet"
                      value={
                        animal.diet.status === "placeholder"
                          ? "Seasonal omnivore — habits shift with the year"
                          : animal.diet.text
                      }
                    />
                    <MetaItem label="Season" value={formatSeasonList(animal.activeSeasons)} />
                    <MetaItem label="Active" value={formatTimeList(animal.activeTimeOfDay)} />
                    <MetaItem
                      label="Conservation"
                      value={formatConservationStatus(animal.conservationStatus)}
                    />
                    <MetaItem
                      label="Size"
                      value={
                        animal.averageLength.status === "placeholder"
                          ? "See relative scale"
                          : animal.averageLength.display
                      }
                    />
                  </dl>

                  <SizeComparison
                    maxHeightPx={110}
                    note="Relative silhouettes for feeling scale"
                    subjects={[
                      {
                        id: animal.id,
                        label: animal.commonName,
                        relativeHeight: relativeHeightForAnimal(animal.id, animal.animalGroup),
                      },
                      humanSizeSubject(),
                    ]}
                  />

                  {visibleFacts.length ? (
                    <div>
                      <p className="font-[family-name:var(--font-ui)] text-[11px] tracking-[0.2em] text-[var(--color-museum-warm)] uppercase">
                        Memorable facts
                      </p>
                      <ul className="mt-[var(--space-4)] space-y-[var(--space-4)]">
                        {visibleFacts.map((fact) => (
                          <li
                            key={fact}
                            className="border-l border-[var(--color-aurora-teal)]/40 pl-[var(--space-4)] font-[family-name:var(--font-body)] text-[length:var(--text-body)] leading-[1.6] text-white/85"
                          >
                            {fact}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <QuietButton
                    className="no-underline px-0"
                    onClick={() => {
                      noteInteraction();
                      setLearnMore((value) => {
                        const next = !value;
                        if (next) getAnalytics().track("fact_expanded", { animalId: animal?.id });
                        return next;
                      });
                    }}
                  >
                    {learnMore ? "Show less" : "Read more"}
                  </QuietButton>

                  <AnimatePresence initial={false}>
                    {learnMore ? (
                      <motion.div
                        key="more"
                        initial={reducedMotion ? false : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-[var(--space-3)] overflow-hidden"
                      >
                        <p className="max-w-[46ch] text-[length:var(--text-body-sm)] leading-[1.7] text-white/70">
                          {animal.fullDescription}
                        </p>
                        {animal.adaptationFacts[0] &&
                        !animal.adaptationFacts[0].text.includes("[NEEDS RESEARCH]") ? (
                          <p className="max-w-[46ch] text-[length:var(--text-body-sm)] leading-[1.7] text-white/60">
                            {animal.adaptationFacts[0].text}
                          </p>
                        ) : null}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                <div className="mt-[var(--space-4)] border-t border-white/[0.08] pt-[var(--space-4)]">
                  <AnimalProfileCallButton
                    animal={animal}
                    callOverride={forestCallAudioFor(animal.id)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-[family-name:var(--font-ui)] text-[10px] tracking-[0.18em] text-white/45 uppercase">
        {label}
      </dt>
      <dd className="mt-[var(--space-2)] font-[family-name:var(--font-body)] text-[14px] leading-snug text-white/88">
        {value}
      </dd>
    </div>
  );
}
