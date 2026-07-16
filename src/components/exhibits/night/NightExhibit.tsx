"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  NIGHT_EXHIBIT_SUBTITLE,
  NIGHT_EXHIBIT_TITLE,
  getNightCreature,
  nightCopy,
  nightCreatures,
  type NightDiscoveryId,
} from "@/content/exhibits/night/content";
import { DiscoveryTrail } from "@/components/exhibits/night/DiscoveryTrail";
import { FlashlightLayer } from "@/components/exhibits/night/FlashlightLayer";
import { NightComplete } from "@/components/exhibits/night/NightComplete";
import { NightCreatures, creatureUnderBeam } from "@/components/exhibits/night/NightCreatures";
import { NightFactPanel } from "@/components/exhibits/night/NightFactPanel";
import { NightForestStage } from "@/components/exhibits/night/NightForestStage";
import { QuietButton } from "@/components/touch/QuietButton";
import { useKioskSession } from "@/hooks/useKioskSession";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSmoothPointer } from "@/hooks/useSmoothPointer";

const BEAM_RADIUS = 0.14;
const DISCOVER_DWELL_MS = 420;

/**
 * The Forest After Dark — drag a soft flashlight to reveal nocturnal lives.
 */
export function NightExhibit() {
  const reducedMotion = useReducedMotion();
  const { registerResetHandler, noteInteraction } = useKioskSession();
  const stageRef = useRef<HTMLDivElement>(null);

  const [discovered, setDiscovered] = useState<NightDiscoveryId[]>([]);
  const [selectedId, setSelectedId] = useState<NightDiscoveryId | null>(null);
  const [nightVision, setNightVision] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [hasCompletedOnce, setHasCompletedOnce] = useState(false);
  const [listExplore, setListExplore] = useState(false);

  const exploreByList = reducedMotion || listExplore;

  const { point, active, handlers, reset: resetPointer } = useSmoothPointer(stageRef, {
    smoothing: 0.18,
    reducedMotion,
    initial: { x: 0.5, y: 0.58 },
  });

  const resetNight = useCallback(() => {
    setDiscovered([]);
    setSelectedId(null);
    setNightVision(false);
    setCompleteOpen(false);
    setHasCompletedOnce(false);
    setListExplore(false);
    resetPointer({ x: 0.5, y: 0.58 });
  }, [resetPointer]);

  useEffect(() => registerResetHandler(resetNight), [registerResetHandler, resetNight]);

  const creatureInBeam = creatureUnderBeam(nightCreatures, point, BEAM_RADIUS);

  useEffect(() => {
    if (!creatureInBeam || exploreByList) return;

    // Discovery must complete while the visitor holds the beam still. The old
    // point-change check could never finish unless the pointer kept moving.
    const timer = window.setTimeout(() => {
      setDiscovered((prev) =>
        prev.includes(creatureInBeam) ? prev : [...prev, creatureInBeam],
      );
    }, DISCOVER_DWELL_MS);

    return () => window.clearTimeout(timer);
  }, [creatureInBeam, exploreByList]);

  useEffect(() => {
    if (discovered.length === 0) return;
    noteInteraction();
  }, [discovered.length, noteInteraction]);

  useEffect(() => {
    if (
      discovered.length === nightCreatures.length &&
      !hasCompletedOnce &&
      !completeOpen
    ) {
      const timer = window.setTimeout(() => {
        setCompleteOpen(true);
        setHasCompletedOnce(true);
      }, 700);
      return () => window.clearTimeout(timer);
    }
  }, [completeOpen, discovered.length, hasCompletedOnce]);

  const selectedCreature = selectedId ? getNightCreature(selectedId) : undefined;
  const discoveredSet = new Set(discovered);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#05080f]">
      <div
        ref={stageRef}
        data-testid="night-beam-stage"
        className="absolute inset-0 touch-none select-none"
        style={{ touchAction: "none" }}
        {...handlers}
        onPointerDown={(event) => {
          noteInteraction();
          handlers.onPointerDown(event);
        }}
      >
        <NightForestStage nightVision={nightVision} />
        <NightCreatures
          creatures={nightCreatures}
          flash={point}
          beamRadius={BEAM_RADIUS}
          discovered={discoveredSet}
          nightVision={nightVision}
        />
        <FlashlightLayer x={point.x} y={point.y} nightVision={nightVision} radiusVmin={22} />
        <div
          className="pointer-events-none absolute z-[12] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(238,230,210,0.65)] shadow-[0_0_18px_rgba(238,220,180,0.32)]"
          style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%` }}
          aria-hidden
        />
      </div>

      <div className="pointer-events-none safe-frame relative z-20 flex h-full flex-col justify-between py-[var(--space-3)]">
        <header className="flex items-start justify-between gap-[var(--space-6)]">
          <div className="max-w-[34rem]">
            <p className="text-[length:var(--text-label)] tracking-[var(--tracking-wide)] text-[var(--color-museum-warm)] uppercase">
              Night forest
            </p>
            <h1 className="mt-[var(--space-2)] font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] leading-[var(--leading-display)] text-[var(--text-on-dark)]">
              {NIGHT_EXHIBIT_TITLE}
            </h1>
            <p className="mt-[var(--space-2)] text-[length:var(--text-lead)] text-[var(--text-on-dark-muted)]">
              {NIGHT_EXHIBIT_SUBTITLE}
            </p>
            <p className="mt-[var(--space-3)] max-w-[36ch] text-[length:var(--text-body-sm)] leading-relaxed text-white/72">
              {exploreByList ? nightCopy.hintTap : nightCopy.hint}
            </p>
          </div>

          <div className="pointer-events-auto flex flex-col items-end gap-[var(--space-2)] pt-[4.25rem]">
            <QuietButton
              className="no-underline"
              aria-pressed={exploreByList}
              onClick={() => {
                noteInteraction();
                setListExplore(true);
                setNightVision(true);
              }}
            >
              {exploreByList ? nightCopy.exploringByList : nightCopy.exploreByList}
            </QuietButton>
            <QuietButton
              className="no-underline"
              onClick={() => {
                noteInteraction();
                setNightVision((value) => !value);
              }}
            >
              {nightVision ? nightCopy.nightVisionOn : nightCopy.nightVisionOff}
            </QuietButton>
          </div>
        </header>

        <footer className="pb-[var(--space-2)]">
          {!active && discovered.length === 0 && !exploreByList ? (
            <p className="mb-[var(--space-4)] font-[family-name:var(--font-ui)] text-[11px] tracking-[0.2em] text-white/55 uppercase">
              Touch the forest and guide the light
            </p>
          ) : null}
          <DiscoveryTrail
            creatures={nightCreatures}
            discovered={discovered}
            activeId={selectedId}
            unlockAll={exploreByList}
            onSelect={(id) => {
              noteInteraction();
              setDiscovered((prev) => (prev.includes(id) ? prev : [...prev, id]));
              setSelectedId(id);
            }}
          />
        </footer>
      </div>

      <AnimatePresence>
        {selectedCreature ? (
          <NightFactPanel
            key={selectedCreature.id}
            creature={selectedCreature}
            onClose={() => {
              noteInteraction();
              setSelectedId(null);
            }}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {completeOpen ? (
          <NightComplete
            key="complete"
            onContinue={() => {
              noteInteraction();
              setCompleteOpen(false);
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
