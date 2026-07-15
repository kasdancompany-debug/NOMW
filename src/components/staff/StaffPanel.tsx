"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { APP_NAME, APP_VERSION } from "@/lib/app/version";
import { staffConfig } from "@/content/config/staff.config";
import { HoldProgressButton } from "@/components/touch/HoldProgressButton";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { QuietButton } from "@/components/touch/QuietButton";
import { Touchable } from "@/components/touch/Touchable";
import { useKioskSession } from "@/hooks/useKioskSession";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  clearKioskLocalSettings,
  useFullscreenState,
  useMediaLoadingStatus,
  useScreenResolution,
} from "@/lib/staff/helpers";
import { useOfflineReadiness } from "@/hooks/useOfflineReadiness";
import { silenceStationAudio } from "@/lib/media/audioManager";
import { scenicTransition } from "@/lib/motion/tokens";
import { StaffAnalyticsView } from "@/components/staff/StaffAnalyticsView";
import { StaffStationAssignment } from "@/components/staff/StaffStationAssignment";
import { useStationAssignment } from "@/components/station/StationProvider";
import { stationExhibitPath, stationLabel } from "@/lib/kiosk/station";
import { useAudioStore } from "@/stores/audio.store";
import { useStaffStore, type StaffView } from "@/stores/staff.store";
import { cn } from "@/utils/cn";

function formatMs(ms: number | null | undefined) {
  if (ms == null) return "—";
  const sec = Math.max(0, Math.round(ms / 1000));
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/8 py-2">
      <span className="text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">{label}</span>
      <span className="text-right font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] text-[var(--text-on-dark)]">
        {value}
      </span>
    </div>
  );
}

/**
 * Authenticated staff control surface — museum-safe controls only.
 * No OS shell, no network admin, no filesystem browsers.
 */
export function StaffPanel() {
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();
  const router = useRouter();

  const panelOpen = useStaffStore((s) => s.panelOpen);
  const view = useStaffStore((s) => s.view);
  const setView = useStaffStore((s) => s.setView);
  const lock = useStaffStore((s) => s.lock);
  const setForceReducedMotion = useStaffStore((s) => s.setForceReducedMotion);

  const {
    phase,
    remainingMs,
    remainingAttractMs,
    settings,
    exhibitConfig,
    heartbeat,
    softReset,
    updateSettings,
    noteInteraction,
    dismissAttract,
  } = useKioskSession();

  const muted = useAudioStore((s) => s.muted);
  const volume = useAudioStore((s) => s.volume);
  const unlocked = useAudioStore((s) => s.unlocked);
  const activeMajorId = useAudioStore((s) => s.activeMajorId);
  const setMuted = useAudioStore((s) => s.setMuted);
  const setVolume = useAudioStore((s) => s.setVolume);

  const { assignment } = useStationAssignment();

  const offline = useOfflineReadiness();
  const screen = useScreenResolution();
  const media = useMediaLoadingStatus();
  const fullscreen = useFullscreenState();

  const effectiveInactivity =
    settings.inactivityTimeoutMs ?? exhibitConfig?.inactivityTimeoutMs ?? null;
  const effectiveAttract =
    settings.attractModeDelayMs ?? exhibitConfig?.attractModeDelayMs ?? null;

  // Panel idle auto-close
  useEffect(() => {
    if (!panelOpen) return;
    let last = Date.now();
    const bump = () => {
      last = Date.now();
      noteInteraction();
    };
    const events = ["pointerdown", "keydown"] as const;
    for (const name of events) window.addEventListener(name, bump, true);
    const id = window.setInterval(() => {
      if (Date.now() - last >= staffConfig.panelIdleTimeoutMs) {
        lock();
      }
    }, 2000);
    return () => {
      for (const name of events) window.removeEventListener(name, bump, true);
      window.clearInterval(id);
    };
  }, [lock, noteInteraction, panelOpen]);

  const returnToExhibit = () => {
    lock();
    dismissAttract();
    noteInteraction();
    const fallback = assignment
      ? stationExhibitPath(assignment.stationId)
      : exhibitConfig?.exhibitId
        ? `/exhibit/${exhibitConfig.exhibitId}`
        : "/";
    if (pathname === staffConfig.route || pathname !== fallback) {
      router.push(fallback);
    }
  };

  const restartExhibit = () => {
    silenceStationAudio(false);
    dismissAttract();
    softReset("staff-restart");
    noteInteraction();
  };

  const reloadApp = () => {
    silenceStationAudio(true);
    window.location.reload();
  };

  const clearSettings = () => {
    clearKioskLocalSettings();
    updateSettings({
      muted: false,
      volume: 0.45,
      forceReducedMotion: null,
      inactivityTimeoutMs: null,
      attractModeDelayMs: null,
    });
    setForceReducedMotion(null);
    setMuted(false);
    setVolume(0.45);
    noteInteraction();
    lock();
    window.location.assign("/");
  };

  return (
    <AnimatePresence>
      {panelOpen ? (
        <motion.div
          className="absolute inset-0 z-[85] overflow-auto bg-[rgba(8,14,20,0.94)]"
          role="dialog"
          aria-modal
          aria-label="Staff control panel"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={scenicTransition(reducedMotion)}
          onPointerDown={() => noteInteraction()}
        >
          <div className="safe-frame py-[var(--space-6)]">
            <header className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[length:var(--text-label)] tracking-[var(--tracking-label)] text-[var(--color-museum-warm)] uppercase">
                  Staff panel
                </p>
                <h2 className="mt-1 font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] text-[var(--text-on-dark)]">
                  {APP_NAME}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["panel", "Controls"],
                    ["diagnostics", "Diagnostics"],
                    ["analytics", "Analytics"],
                  ] as const satisfies ReadonlyArray<readonly [StaffView, string]>
                ).map(([id, label]) => (
                  <QuietButton
                    key={id}
                    onClick={() => setView(id)}
                    className={cn(view === id && "bg-white/15 text-[var(--text-on-dark)]")}
                  >
                    {label}
                  </QuietButton>
                ))}
                <LargeTouchButton variant="secondary" onClick={returnToExhibit}>
                  Return to exhibit
                </LargeTouchButton>
              </div>
            </header>

            {view === "diagnostics" ? (
              <DiagnosticsBlock
                pathname={pathname}
                phase={phase}
                remainingMs={remainingMs}
                remainingAttractMs={remainingAttractMs}
                exhibitId={exhibitConfig?.exhibitId ?? "—"}
                offlineLabel={offline.label}
                screen={screen}
                media={media}
                muted={muted}
                volume={volume}
                unlocked={unlocked}
                activeMajorId={activeMajorId}
                heartbeat={heartbeat}
                effectiveInactivity={effectiveInactivity}
                effectiveAttract={effectiveAttract}
                fullscreen={fullscreen.active}
              />
            ) : view === "analytics" ? (
              <StaffAnalyticsView />
            ) : (
              <div className="mt-[var(--space-6)] grid gap-[var(--space-6)] lg:grid-cols-2">
                <section className="rounded-[var(--radius-sm)] border border-white/10 bg-white/5 p-[var(--space-5)]">
                  <h3 className="text-[length:var(--text-title)] text-[var(--text-on-dark)]">Status</h3>
                  <div className="mt-3">
                    <Row
                      label="Station"
                      value={
                        assignment
                          ? stationLabel(assignment.stationId)
                          : String(exhibitConfig?.exhibitId ?? "—")
                      }
                    />
                    <Row label="Exhibit ID" value={String(exhibitConfig?.exhibitId ?? "—")} />
                    <Row label="App version" value={APP_VERSION} />
                    <Row label="Route" value={pathname} />
                    <Row label="Session" value={phase} />
                    <Row label="Time until reset" value={formatMs(remainingMs)} />
                    <Row label="Attract in" value={formatMs(remainingAttractMs)} />
                    <Row
                      label="Screen"
                      value={
                        screen.width
                          ? `${screen.width}×${screen.height} @${screen.dpr}x`
                          : "—"
                      }
                    />
                    <Row label="Network / offline" value={offline.label} />
                    <Row label="Media" value={`${media.status} — ${media.detail}`} />
                    <Row
                      label="Audio"
                      value={`${muted ? "Muted" : "Unmuted"} · vol ${Math.round(volume * 100)}% · ${unlocked ? "unlocked" : "locked"}${activeMajorId ? ` · playing ${activeMajorId}` : ""}`}
                    />
                    <Row label="Fullscreen" value={fullscreen.active ? "Yes" : "No"} />
                  </div>
                </section>

                <section className="space-y-[var(--space-5)] rounded-[var(--radius-sm)] border border-white/10 bg-white/5 p-[var(--space-5)]">
                  <h3 className="text-[length:var(--text-title)] text-[var(--text-on-dark)]">Settings</h3>

                  <ToggleRow
                    label="Reduced motion"
                    detail={
                      settings.forceReducedMotion === null
                        ? "Follow system"
                        : settings.forceReducedMotion
                          ? "Forced on"
                          : "Forced off"
                    }
                    onCycle={() => {
                      const next =
                        settings.forceReducedMotion === null
                          ? true
                          : settings.forceReducedMotion === true
                            ? false
                            : null;
                      updateSettings({ forceReducedMotion: next });
                      setForceReducedMotion(next);
                    }}
                  />

                  <div>
                    <p className="text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
                      Volume ({Math.round(volume * 100)}%)
                    </p>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round(volume * 100)}
                      className="mt-2 h-10 w-full accent-[var(--color-museum-warm)]"
                      onChange={(event) => {
                        const next = Number(event.target.value) / 100;
                        setVolume(next);
                        updateSettings({ volume: next });
                      }}
                    />
                    <div className="mt-2 flex gap-2">
                      <QuietButton
                        onClick={() => {
                          const next = !muted;
                          setMuted(next);
                          updateSettings({ muted: next });
                          if (next) silenceStationAudio(false);
                        }}
                      >
                        {muted ? "Unmute" : "Mute"}
                      </QuietButton>
                    </div>
                  </div>

                  <TimeoutControl
                    label="Inactivity timeout"
                    valueMs={effectiveInactivity}
                    onCommit={(ms) => updateSettings({ inactivityTimeoutMs: ms })}
                    onClear={() => updateSettings({ inactivityTimeoutMs: null })}
                  />

                  <TimeoutControl
                    label="Attract mode delay"
                    valueMs={effectiveAttract}
                    onCommit={(ms) => updateSettings({ attractModeDelayMs: ms })}
                    onClear={() => updateSettings({ attractModeDelayMs: null })}
                  />
                </section>

                <StaffStationAssignment />

                <section className="space-y-3 rounded-[var(--radius-sm)] border border-white/10 bg-white/5 p-[var(--space-5)] lg:col-span-2">
                  <h3 className="text-[length:var(--text-title)] text-[var(--text-on-dark)]">Actions</h3>
                  <p className="text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
                    Hold-to-confirm for deliberate changes. No OS or browser developer tools are exposed.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <LargeTouchButton onClick={restartExhibit}>Restart exhibit</LargeTouchButton>
                    <HoldProgressButton label="Reload application" onComplete={reloadApp} durationMs={900} />
                    <LargeTouchButton variant="secondary" onClick={() => void fullscreen.enter()}>
                      Enter fullscreen
                    </LargeTouchButton>
                    <LargeTouchButton variant="secondary" onClick={() => void fullscreen.exit()}>
                      Exit fullscreen
                    </LargeTouchButton>
                    <HoldProgressButton
                      label="Clear local settings"
                      onComplete={clearSettings}
                      durationMs={1100}
                    />
                    <LargeTouchButton variant="secondary" onClick={() => setView("diagnostics")}>
                      Open diagnostics
                    </LargeTouchButton>
                    <LargeTouchButton variant="secondary" onClick={() => setView("analytics")}>
                      Open analytics
                    </LargeTouchButton>
                    <LargeTouchButton onClick={returnToExhibit}>Return to exhibit</LargeTouchButton>
                  </div>
                </section>
              </div>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function ToggleRow({
  label,
  detail,
  onCycle,
}: {
  label: string;
  detail: string;
  onCycle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-[length:var(--text-body)] text-[var(--text-on-dark)]">{label}</p>
        <p className="text-[length:var(--text-micro)] text-[var(--text-on-dark-muted)]">{detail}</p>
      </div>
      <Touchable soft className="min-h-[3rem] rounded-[var(--radius-sm)] bg-white/10 px-4" onClick={onCycle}>
        Cycle
      </Touchable>
    </div>
  );
}

function TimeoutControl({
  label,
  valueMs,
  onCommit,
  onClear,
}: {
  label: string;
  valueMs: number | null;
  onCommit: (ms: number) => void;
  onClear: () => void;
}) {
  const seconds = valueMs != null ? Math.round(valueMs / 1000) : null;
  return (
    <div>
      <p className="text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
        {label}: {seconds != null ? `${seconds}s` : "exhibit default"}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {[60, 90, 120, 180].map((sec) => (
          <Touchable
            key={sec}
            soft
            className={cn(
              "min-h-[2.75rem] rounded-[var(--radius-sm)] px-3 text-[length:var(--text-body-sm)]",
              seconds === sec ? "bg-[var(--color-museum-warm)] text-[#1a2430]" : "bg-white/10 text-[var(--text-on-dark)]",
            )}
            onClick={() => onCommit(sec * 1000)}
          >
            {sec}s
          </Touchable>
        ))}
        <Touchable soft className="min-h-[2.75rem] rounded-[var(--radius-sm)] bg-white/10 px-3 text-[length:var(--text-body-sm)]" onClick={onClear}>
          Default
        </Touchable>
      </div>
    </div>
  );
}

function DiagnosticsBlock(props: {
  pathname: string;
  phase: string;
  remainingMs: number;
  remainingAttractMs: number | null;
  exhibitId: string;
  offlineLabel: string;
  screen: { width: number; height: number; dpr: number };
  media: { status: string; detail: string };
  muted: boolean;
  volume: number;
  unlocked: boolean;
  activeMajorId: string | null;
  heartbeat: { at: number; resetCount: number; uptimeMs: number; lastErrorAt: number | null } | null;
  effectiveInactivity: number | null;
  effectiveAttract: number | null;
  fullscreen: boolean;
}) {
  return (
    <section className="mt-[var(--space-6)] rounded-[var(--radius-sm)] border border-white/10 bg-white/5 p-[var(--space-5)]">
      <h3 className="text-[length:var(--text-title)] text-[var(--text-on-dark)]">Diagnostics</h3>
      <p className="mt-2 max-w-xl text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
        Read-only station health. Safe for floor technicians — no shell escapes. Offline is normal for museum LAN
        without internet.
      </p>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div>
          <Row label="App" value={`${APP_NAME} ${APP_VERSION}`} />
          <Row label="Exhibit" value={props.exhibitId} />
          <Row label="Route" value={props.pathname} />
          <Row label="Phase" value={props.phase} />
          <Row label="Reset in" value={formatMs(props.remainingMs)} />
          <Row label="Attract in" value={formatMs(props.remainingAttractMs)} />
          <Row label="Inactivity cfg" value={formatMs(props.effectiveInactivity)} />
          <Row label="Attract cfg" value={formatMs(props.effectiveAttract)} />
        </div>
        <div>
          <Row
            label="Viewport"
            value={
              props.screen.width
                ? `${props.screen.width}×${props.screen.height} (DPR ${props.screen.dpr})`
                : "—"
            }
          />
          <Row label="Network / offline" value={props.offlineLabel} />
          <Row label="Media" value={`${props.media.status}: ${props.media.detail}`} />
          <Row
            label="Audio"
            value={`${props.muted ? "muted" : "hot"} / ${Math.round(props.volume * 100)}% / ${props.unlocked ? "unlocked" : "gesture-locked"}${props.activeMajorId ? ` / ${props.activeMajorId}` : ""}`}
          />
          <Row label="Fullscreen" value={props.fullscreen ? "active" : "windowed"} />
          <Row
            label="Heartbeat age"
            value={props.heartbeat ? formatMs(Date.now() - props.heartbeat.at) : "—"}
          />
          <Row label="Reset count" value={String(props.heartbeat?.resetCount ?? "—")} />
          <Row label="Uptime" value={formatMs(props.heartbeat?.uptimeMs)} />
          <Row
            label="Last error"
            value={
              props.heartbeat?.lastErrorAt
                ? new Date(props.heartbeat.lastErrorAt).toLocaleTimeString()
                : "none"
            }
          />
        </div>
      </div>
    </section>
  );
}
