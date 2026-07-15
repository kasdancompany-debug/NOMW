"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getAnimal } from "@/content/animals";
import { getHabitat } from "@/content/habitats";
import {
  formatConservationStatus,
  formatSeasonList,
  formatTimeList,
  relativeHeightForAnimal,
} from "@/lib/animals/profileLabels";
import { AnimalNameplate } from "@/components/animals/AnimalNameplate";
import { AnimalProfileCallButton } from "@/components/animals/AnimalProfileCallButton";
import { SizeComparison, humanSizeSubject } from "@/components/animals/SizeComparison";
import { LocalImage } from "@/components/media/LocalImage";
import { LocalVideo } from "@/components/media/LocalVideo";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { QuietButton } from "@/components/touch/QuietButton";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useKioskSession } from "@/hooks/useKioskSession";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";
import { getAnalytics } from "@/lib/analytics";
import { useAnimalProfileStore } from "@/stores/animal-profile.store";
import { useAudioStore } from "@/stores/audio.store";
import { cn } from "@/utils/cn";

/**
 * Shared full-screen animal profile overlay.
 * Opens over the current exhibit without navigation; closes on kiosk reset.
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

  const caption = animal?.captions[0] || animal?.heroImage.caption;
  const attribution = animal?.attribution || animal?.heroImage.attribution;
  const showVideo = Boolean(animal && !reducedMotion && animal.habitatVideo?.src);

  return (
    <AnimatePresence>
      {isOpen && animal ? (
        <motion.div
          key={animal.id}
          className="absolute inset-0 z-[60] flex items-stretch justify-center bg-[rgba(6,14,20,0.72)] p-[var(--space-4)]"
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
            className="safe-frame flex h-full w-full max-w-[110rem] flex-col"
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={scenicTransition(reducedMotion)}
          >
            <GlassPanel
              density="dense"
              className="flex min-h-0 flex-1 flex-col gap-[var(--space-4)] overflow-hidden py-[var(--space-5)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-[var(--space-4)]">
                <AnimalNameplate
                  commonName={animal.commonName}
                  scientificName={animal.scientificName}
                />
                <div className="flex flex-wrap gap-[var(--space-2)]">
                  {animalIds.length > 1 ? (
                    <>
                      <LargeTouchButton
                        variant="secondary"
                        onClick={() => {
                          noteInteraction();
                          showPrevious();
                        }}
                      >
                        Previous
                      </LargeTouchButton>
                      <LargeTouchButton
                        variant="secondary"
                        onClick={() => {
                          noteInteraction();
                          showNext();
                        }}
                      >
                        Next
                      </LargeTouchButton>
                    </>
                  ) : null}
                  {enableCompare ? (
                    <LargeTouchButton
                      variant="secondary"
                      onClick={() => {
                        noteInteraction();
                        requestCompare();
                      }}
                    >
                      Compare
                    </LargeTouchButton>
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

              <div className="grid min-h-0 flex-1 gap-[var(--space-5)] overflow-y-auto lg:grid-cols-[1.15fr_1fr]">
                <div className="space-y-[var(--space-3)]">
                  <div className="relative min-h-[18rem] overflow-hidden rounded-[var(--radius-sm)] bg-[rgba(255,255,255,0.06)] lg:min-h-[24rem]">
                    {showVideo ? (
                      <LocalVideo
                        key={animal.habitatVideo.src}
                        asset={animal.habitatVideo}
                        poster={animal.habitatVideo.poster ?? animal.heroImage.src}
                        fallbackSrc={animal.heroImage.src}
                        caption={caption}
                        attribution={attribution}
                        className="absolute inset-0"
                        videoClassName="absolute inset-0 h-full w-full object-cover"
                        loop={animal.habitatVideo.loop ?? true}
                        autoPlay
                        muted
                        preload={animal.habitatVideo.preload ?? "metadata"}
                        lazy
                        playWhenVisible
                        showCaption={false}
                        showAttribution={false}
                      />
                    ) : (
                      <LocalImage
                        key={animal.heroImage.src}
                        asset={animal.heroImage}
                        alt={animal.heroImage.alt ?? animal.commonName}
                        fallbackSrc={animal.silhouetteImage.src}
                        className="absolute inset-0"
                        imgClassName="absolute inset-0 h-full w-full object-cover"
                        fill
                        sizes="(max-width: 1920px) 50vw, 960px"
                        showCaption={false}
                        showAttribution={false}
                      />
                    )}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(8,16,22,0.85))] p-[var(--space-4)]">
                      {caption ? (
                        <p className="text-[length:var(--text-body-sm)] text-[var(--text-on-dark)]">
                          {caption}
                        </p>
                      ) : null}
                      {attribution ? (
                        <p className="mt-[var(--space-1)] text-[length:var(--text-micro)] text-[var(--text-on-dark-muted)]">
                          {attribution}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <AnimalProfileCallButton animal={animal} />
                </div>

                <div className="space-y-[var(--space-4)]">
                  <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[var(--text-on-dark)]">
                    {animal.shortIntroduction}
                  </p>

                  <dl className="grid grid-cols-1 gap-[var(--space-3)] sm:grid-cols-2">
                    <MetaItem label="Habitat" value={habitats || "Northern Ontario landscapes"} />
                    <MetaItem
                      label="Diet"
                      value={
                        animal.diet.status === "placeholder"
                          ? "Diet details under curator review"
                          : animal.diet.text
                      }
                    />
                    <MetaItem label="Active season" value={formatSeasonList(animal.activeSeasons)} />
                    <MetaItem label="Active time" value={formatTimeList(animal.activeTimeOfDay)} />
                    <MetaItem
                      label="Conservation"
                      value={formatConservationStatus(animal.conservationStatus)}
                    />
                    <MetaItem
                      label="Size"
                      value={
                        animal.averageLength.status === "placeholder"
                          ? "Relative size below"
                          : animal.averageLength.display
                      }
                    />
                  </dl>

                  <SizeComparison
                    maxHeightPx={120}
                    note="Relative silhouette — not a verified measurement"
                    subjects={[
                      {
                        id: animal.id,
                        label: animal.commonName,
                        relativeHeight: relativeHeightForAnimal(animal.id, animal.animalGroup),
                      },
                      humanSizeSubject(),
                    ]}
                  />

                  <div>
                    <p className="text-[length:var(--text-label)] tracking-[var(--tracking-label)] text-[var(--color-museum-warm)] uppercase">
                      Memorable facts
                    </p>
                    <ul className="mt-[var(--space-3)] space-y-[var(--space-3)]">
                      {visibleFacts.map((fact) => (
                        <li
                          key={fact}
                          className="border-l border-[var(--color-aurora-teal)]/45 pl-[var(--space-4)] text-[length:var(--text-body)] text-[var(--text-on-dark)]"
                        >
                          {fact}
                        </li>
                      ))}
                    </ul>
                  </div>

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
                    {learnMore ? "Show less" : "Learn more"}
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
                        <p className="text-[length:var(--text-body-sm)] leading-[var(--leading-body)] text-[var(--text-on-dark-muted)]">
                          {animal.fullDescription}
                        </p>
                        <p className="text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
                          Range:{" "}
                          {animal.northernOntarioRange.status === "placeholder"
                            ? "Regional range under review"
                            : animal.northernOntarioRange.text}
                        </p>
                        {animal.adaptationFacts[0] ? (
                          <p className="text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
                            Adaptation: {animal.adaptationFacts[0].text}
                          </p>
                        ) : null}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className={cn("rounded-[var(--radius-sm)] bg-white/5 px-[var(--space-3)] py-[var(--space-3)]")}>
      <dt className="text-[length:var(--text-micro)] tracking-[var(--tracking-label)] text-[var(--text-on-dark-muted)] uppercase">
        {label}
      </dt>
      <dd className="mt-[var(--space-1)] text-[length:var(--text-body-sm)] text-[var(--text-on-dark)]">
        {value}
      </dd>
    </div>
  );
}
