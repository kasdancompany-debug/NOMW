"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { AttractMode } from "@/components/attract/AttractMode";
import { AnimalProfileOverlay } from "@/components/animals/AnimalProfileOverlay";
import { AmbientOverlay } from "@/components/media/AmbientOverlay";
import { FullscreenMedia } from "@/components/media/FullscreenMedia";
import { ProgressDots } from "@/components/navigation/ProgressDots";
import { BackToStartButton } from "@/components/touch/BackToStartButton";
import { ExhibitErrorBoundary } from "@/components/exhibit/shell/ExhibitErrorBoundary";
import { ExhibitLoadingState } from "@/components/exhibit/shell/ExhibitLoadingState";
import { KioskNavigationGuard } from "@/components/exhibit/shell/KioskNavigationGuard";
import { SoundControl } from "@/components/exhibit/shell/SoundControl";
import { StaffAccessZone } from "@/components/exhibit/shell/StaffAccessZone";
import { StaffLogoHold } from "@/components/staff/StaffLogoHold";
import { TouchRipples, type TouchRipple } from "@/components/exhibit/shell/TouchFeedbackLayer";
import { IdleWarningOverlay } from "@/components/kiosk/IdleWarningOverlay";
import { KioskViewport } from "@/components/kiosk/KioskViewport";
import { getExhibit } from "@/content/config/exhibits.registry";
import { idleConfig } from "@/content/config/idle.config";
import { useExhibitAmbientAudio } from "@/hooks/useExhibitAmbientAudio";
import { useKioskSession } from "@/hooks/useKioskSession";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getAnalytics } from "@/lib/analytics";
import { useAudioStore } from "@/stores/audio.store";
import { useExhibitUiStore } from "@/stores/exhibit-ui.store";
import type { AttractModeContent, ExhibitConfig, ExhibitProgressState } from "@/types/exhibit-shell";
import { cn } from "@/utils/cn";

/** Ignore content hits briefly after attract exit so the same gesture cannot activate UI. */
const ATTRACT_EXIT_SUPPRESS_MS = 450;

export type ExhibitShellProps = {
  config: ExhibitConfig;
  children: ReactNode;
  progress?: ExhibitProgressState;
  isLoading?: boolean;
  /** Override attract content; defaults to config.attract */
  attract?: AttractModeContent;
  /** Replace default attract foreground composition */
  attractContent?: ReactNode;
  hideTitleArea?: boolean;
  className?: string;
};

function fallbackClass(tone: ExhibitConfig["defaultBackground"]["fallbackTone"]): string {
  switch (tone) {
    case "deep-lake":
      return "bg-deep-lake";
    case "snow-mist":
      return "bg-snow-mist";
    case "museum-glow":
      return "bg-museum-glow";
    case "boreal-night":
    default:
      return "bg-boreal-night";
  }
}

export function ExhibitShell({
  config,
  children,
  progress,
  isLoading = false,
  attract,
  attractContent,
  hideTitleArea = false,
  className,
}: ExhibitShellProps) {
  const exhibitPath = `/exhibit/${config.id}`;
  const exhibitContent = getExhibit(config.id);
  const reducedMotion = useReducedMotion();
  const shellRef = useRef<HTMLElement>(null);
  const suppressUntilRef = useRef(0);

  const unlockAudio = useAudioStore((s) => s.unlock);
  const resetToHome = useExhibitUiStore((s) => s.resetToHome);
  const activeSceneId = useExhibitUiStore((s) => s.activeSceneId);

  const {
    configureExhibit,
    registerResetHandler,
    softReset,
    noteInteraction,
    isAttract,
    dismissAttract,
    settings,
  } = useKioskSession();

  const [bootstrapping, setBootstrapping] = useState(true);
  const [ripples, setRipples] = useState<TouchRipple[]>([]);
  const [contentPointerSafe, setContentPointerSafe] = useState(true);

  const attractContentConfig = attract ?? config.attract;
  const suppressAmbient =
    isAttract && attractContentConfig.allowAmbientAudio !== true;

  useExhibitAmbientAudio(config.defaultAudio, { suppress: suppressAmbient });

  useEffect(() => {
    configureExhibit({
      exhibitId: config.id,
      inactivityTimeoutMs: settings.inactivityTimeoutMs ?? config.inactivityTimeoutMs,
      attractModeDelayMs: settings.attractModeDelayMs ?? config.attractModeDelayMs,
      warningMs: idleConfig.warningMs,
      homeSceneId: exhibitContent.homeSceneId,
    });
  }, [
    configureExhibit,
    config.id,
    config.inactivityTimeoutMs,
    config.attractModeDelayMs,
    exhibitContent.homeSceneId,
    settings.inactivityTimeoutMs,
    settings.attractModeDelayMs,
  ]);

  useEffect(() => {
    return registerResetHandler(() => {
      resetToHome(exhibitContent.homeSceneId);
    });
  }, [registerResetHandler, resetToHome, exhibitContent.homeSceneId]);

  useEffect(() => {
    resetToHome(exhibitContent.homeSceneId);
    const timer = window.setTimeout(() => setBootstrapping(false), 400);
    return () => window.clearTimeout(timer);
  }, [config.id, exhibitContent.homeSceneId, resetToHome]);

  useEffect(() => {
    document.documentElement.dataset.exhibitId = config.id;
    if (reducedMotion) {
      document.documentElement.dataset.reducedMotion = "true";
    } else {
      delete document.documentElement.dataset.reducedMotion;
    }
  }, [config.id, reducedMotion]);

  const exitSuppressTimerRef = useRef<number | null>(null);

  const armExitSuppress = useCallback(() => {
    suppressUntilRef.current = Date.now() + ATTRACT_EXIT_SUPPRESS_MS;
    setContentPointerSafe(false);
    if (exitSuppressTimerRef.current != null) {
      window.clearTimeout(exitSuppressTimerRef.current);
    }
    exitSuppressTimerRef.current = window.setTimeout(() => {
      exitSuppressTimerRef.current = null;
      if (Date.now() >= suppressUntilRef.current) {
        setContentPointerSafe(true);
      }
    }, ATTRACT_EXIT_SUPPRESS_MS + 16);
  }, []);

  useEffect(() => {
    return () => {
      if (exitSuppressTimerRef.current != null) {
        window.clearTimeout(exitSuppressTimerRef.current);
      }
    };
  }, []);

  const handleAttractExit = useCallback(() => {
    armExitSuppress();
    dismissAttract();
    noteInteraction();
    getAnalytics().track("attract_exited", { exhibitId: config.id });
    getAnalytics().beginSession(config.id);
    // Do not unlock audio here — attract must not imply ambient autoplay.
    // Unlock happens on the next intentional explore touch after suppress clears.
  }, [armExitSuppress, config.id, dismissAttract, noteInteraction]);

  const handleHome = useCallback(() => {
    getAnalytics().endSession("home-control");
    softReset("home-control");
    noteInteraction();
    dismissAttract();
  }, [dismissAttract, noteInteraction, softReset]);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (isAttract) {
        // AttractMode absorbs and exits; skip shell effects for this gesture.
        return;
      }

      if (Date.now() < suppressUntilRef.current) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      unlockAudio();
      noteInteraction();

      if (reducedMotion || !shellRef.current) return;
      const rect = shellRef.current.getBoundingClientRect();
      setRipples((current) => [
        ...current.slice(-5),
        {
          id: Date.now() + Math.random(),
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        },
      ]);
    },
    [isAttract, noteInteraction, reducedMotion, unlockAudio],
  );

  const showTitle = config.showTitleArea && !hideTitleArea;
  const showProgress =
    config.showProgress && progress && progress.count > 0 && !isAttract;
  const showLoading = isLoading || bootstrapping;
  const ambientTone = config.defaultBackground.ambientTone ?? "mist";
  const showAttract = isAttract && !showLoading;

  return (
    <ExhibitErrorBoundary exhibitTitle={config.title} onReset={handleHome}>
      <KioskNavigationGuard
        exhibitPath={exhibitPath}
        navigation={config.allowedNavigation}
      />

      <KioskViewport className={className}>
        <main
          ref={shellRef}
          className={cn(
            "relative h-full w-full overflow-hidden text-[var(--text-on-dark)]",
            fallbackClass(config.defaultBackground.fallbackTone),
          )}
          data-exhibit={config.id}
          data-scene={activeSceneId ?? exhibitContent.homeSceneId}
          data-attract={showAttract ? "true" : "false"}
          onPointerDownCapture={handlePointerDown}
        >
          <div className="pointer-events-none absolute inset-0 z-0">
            <FullscreenMedia
              imageSrc={config.defaultBackground.imageSrc}
              videoSrc={config.defaultBackground.videoSrc}
              posterSrc={config.defaultBackground.posterSrc}
              scrim={config.defaultBackground.scrim ?? "mist"}
              imageAlt=""
              playbackActive={!showAttract}
            />
            {ambientTone !== "none" ? (
              <AmbientOverlay tone={ambientTone} animate={!showAttract && !reducedMotion} />
            ) : null}
          </div>

          {!reducedMotion && !showAttract ? (
            <TouchRipples
              ripples={ripples}
              onComplete={(id) =>
                setRipples((current) => current.filter((ripple) => ripple.id !== id))
              }
            />
          ) : null}

          {/*
            Unmount exhibit tree during attract — soft-reset already returned to home.
            Stops scenic Framer loops + media decode for long idle hours (8-station).
          */}
          {!showAttract ? (
            <div
              className={cn(
                "relative z-10 h-full w-full",
                !contentPointerSafe && "pointer-events-none",
              )}
            >
              {children}
            </div>
          ) : null}

          <div
            className={cn(
              "pointer-events-none absolute inset-0 z-40",
              showAttract && "opacity-0",
            )}
          >
            <div className="safe-frame pointer-events-none flex h-full flex-col justify-between">
              <div className="pointer-events-auto flex items-start justify-between gap-[var(--space-4)]">
                <div className="min-w-0 flex-1 pr-[var(--space-6)]">
                  {config.showShellBrand !== false ? (
                    <p className="text-[length:var(--text-label)] tracking-[var(--tracking-wide)] text-[var(--color-museum-warm)] uppercase">
                      <StaffLogoHold>Northern Ontario Museum of Wonder</StaffLogoHold>
                    </p>
                  ) : (
                    <span className="inline-block">
                      <StaffLogoHold>
                        <span className="sr-only">Northern Ontario Museum of Wonder</span>
                      </StaffLogoHold>
                    </span>
                  )}
                  {showTitle ? (
                    <h1 className="mt-[var(--space-2)] font-[family-name:var(--font-display)] text-[length:var(--text-title)] leading-[var(--leading-title)] tracking-[var(--tracking-title)]">
                      {config.title}
                    </h1>
                  ) : null}
                </div>

                <div className="flex shrink-0 items-center gap-[var(--space-2)]">
                  <SoundControl />
                  {config.allowedNavigation.allowHomeRestart ? (
                    <BackToStartButton onPress={handleHome} label="Restart" />
                  ) : null}
                </div>
              </div>

              <div
                className={cn(
                  "flex items-end justify-between gap-[var(--space-4)]",
                  // Only capture pointers when bottom chrome has real controls —
                  // an empty pointer-events-auto strip blocks exhibit home bars.
                  (showTitle || showProgress) && "pointer-events-auto",
                )}
              >
                {showTitle ? (
                  <p className="max-w-[36ch] text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
                    {config.subtitle}
                  </p>
                ) : (
                  <span />
                )}
                {showProgress && progress ? (
                  <ProgressDots
                    count={progress.count}
                    activeIndex={progress.activeIndex}
                    onSelect={progress.onSelect}
                    label={progress.label ?? `${config.title} progress`}
                  />
                ) : null}
              </div>
            </div>
          </div>

          <IdleWarningOverlay />

          {/* Shared profile — overlays exhibit content without route change */}
          {!showAttract ? <AnimalProfileOverlay /> : null}

          <AttractMode
            active={showAttract}
            content={attractContentConfig}
            onExit={handleAttractExit}
          >
            {attractContent}
          </AttractMode>

          {showLoading ? <ExhibitLoadingState label={`Preparing ${config.title}…`} /> : null}

          <StaffAccessZone />
        </main>
      </KioskViewport>
    </ExhibitErrorBoundary>
  );
}
