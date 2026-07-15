"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { STATIONS, type StationId } from "@/content/config/stations";
import { HoldProgressButton } from "@/components/touch/HoldProgressButton";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { QuietButton } from "@/components/touch/QuietButton";
import { getAnalytics } from "@/lib/analytics";
import {
  SIMULATOR_CHANNEL,
  exhibitSimulatorSrc,
  postSimulatorCommand,
  setSimulatorMediaFailure,
  setSimulatorOffline,
  type SimulatorCommandBody,
  type SimulatorFrameState,
} from "@/lib/dev/simulator";
import { clearKioskLocalSettings } from "@/lib/staff/helpers";
import { cn } from "@/utils/cn";

type ViewportPreset = {
  id: string;
  label: string;
  width: number;
  height: number;
};

const VIEWPORTS: ViewportPreset[] = [
  { id: "1080", label: "1920×1080", width: 1920, height: 1080 },
  { id: "900", label: "1600×900", width: 1600, height: 900 },
  { id: "720", label: "1280×720", width: 1280, height: 720 },
  { id: "576", label: "1024×576", width: 1024, height: 576 },
];

type FrameRefs = Record<StationId, HTMLIFrameElement | null>;

/**
 * Development museum floor simulator — eight real exhibit iframes + shared controls.
 */
export function MuseumSimulator() {
  const frameRefs = useRef<Partial<FrameRefs>>({});
  const [selectedId, setSelectedId] = useState<StationId>("welcome");
  const [viewportId, setViewportId] = useState("1080");
  const [muted, setMuted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mediaFailure, setMediaFailure] = useState(false);
  const [offline, setOffline] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [frameState, setFrameState] = useState<SimulatorFrameState | null>(null);
  const [analyticsJson, setAnalyticsJson] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  const viewport = VIEWPORTS.find((entry) => entry.id === viewportId) ?? VIEWPORTS[0]!;

  const broadcast = useCallback((command: SimulatorCommandBody) => {
    for (const station of STATIONS) {
      const frame = frameRefs.current[station.id];
      postSimulatorCommand(frame?.contentWindow ?? null, command);
    }
  }, []);

  const sendSelected = useCallback(
    (command: SimulatorCommandBody) => {
      const frame = frameRefs.current[selectedId];
      postSimulatorCommand(frame?.contentWindow ?? null, command);
    },
    [selectedId],
  );

  const refreshState = useCallback(() => {
    sendSelected({ action: "requestState" });
  }, [sendSelected]);

  const refreshAnalytics = useCallback(() => {
    setAnalyticsJson(getAnalytics().exportJson());
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as { type?: string; action?: string; state?: SimulatorFrameState };
      if (data?.type !== SIMULATOR_CHANNEL || data.action !== "state" || !data.state) return;
      setFrameState(data.state);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    refreshAnalytics();
    const id = window.setInterval(() => {
      refreshState();
      refreshAnalytics();
    }, 2000);
    return () => window.clearInterval(id);
  }, [refreshAnalytics, refreshState, selectedId, reloadToken]);

  const reloadFrames = () => setReloadToken((value) => value + 1);

  const selectedStation = useMemo(
    () => STATIONS.find((station) => station.id === selectedId)!,
    [selectedId],
  );

  return (
    <div className="min-h-[100dvh] bg-[#071018] text-[var(--text-on-dark)]">
      <header className="border-b border-white/10 px-6 py-4">
        <p className="text-[length:var(--text-label)] tracking-[var(--tracking-label)] text-[var(--color-museum-warm)] uppercase">
          Development only
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-[length:var(--text-title)]">
          Museum simulator
        </h1>
        <p className="mt-2 max-w-3xl text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
          Eight live 16:9 previews of production exhibits (`/exhibit/…?simulator=1`). Controls call the
          same session reset, attract, mute, and media fallback paths as the floor build — not mocks.
        </p>
      </header>

      <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[length:var(--text-label)] text-[var(--text-on-dark-muted)] uppercase tracking-[var(--tracking-label)]">
              Viewport
            </span>
            {VIEWPORTS.map((entry) => (
              <QuietButton
                key={entry.id}
                className={cn(
                  "no-underline",
                  viewportId === entry.id && "bg-white/15 text-[var(--text-on-dark)]",
                )}
                onClick={() => setViewportId(entry.id)}
              >
                {entry.label}
              </QuietButton>
            ))}
            <QuietButton
              className="no-underline"
              onClick={() => setFocusMode((value) => !value)}
            >
              {focusMode ? "Show all eight" : "Focus selected"}
            </QuietButton>
          </div>

          <div
            className={cn(
              "grid gap-4",
              focusMode ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-4",
            )}
          >
            {STATIONS.filter((station) => !focusMode || station.id === selectedId).map((station) => {
              const active = station.id === selectedId;
              return (
                <button
                  key={`${station.id}-${reloadToken}`}
                  type="button"
                  onClick={() => setSelectedId(station.id)}
                  className={cn(
                    "overflow-hidden rounded-[var(--radius-sm)] border text-left transition-[box-shadow,border-color]",
                    active
                      ? "border-[var(--color-museum-warm)] shadow-[0_0_0_1px_rgba(212,176,122,0.35)]"
                      : "border-white/10",
                  )}
                >
                  <div className="flex items-center justify-between gap-2 bg-white/5 px-3 py-2">
                    <span className="text-[length:var(--text-body-sm)] text-[var(--text-on-dark)]">
                      {station.displayNumber}. {station.shortLabel}
                    </span>
                    <a
                      href={exhibitSimulatorSrc(station.id)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[length:var(--text-label)] text-[var(--color-aurora-teal)] underline"
                      onClick={(event) => event.stopPropagation()}
                    >
                      Open
                    </a>
                  </div>
                  <div
                    className="relative w-full bg-black"
                    style={{ aspectRatio: "16 / 9" }}
                  >
                    <div
                      className="absolute left-0 top-0 origin-top-left"
                      style={{
                        width: viewport.width,
                        height: viewport.height,
                        transform: `scale(${Math.min(1, 1 /* overwritten by container */)})`,
                      }}
                    >
                      <SimulatorScaledFrame
                        stationId={station.id}
                        width={viewport.width}
                        height={viewport.height}
                        src={`${exhibitSimulatorSrc(station.id)}&v=${reloadToken}`}
                        onMount={(node) => {
                          frameRefs.current[station.id] = node;
                        }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="space-y-5 rounded-[var(--radius-sm)] border border-white/10 bg-white/5 p-4">
          <div>
            <h2 className="text-[length:var(--text-body)] text-[var(--text-on-dark)]">
              Selected — {selectedStation.label}
            </h2>
            <p className="mt-1 text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
              Commands target the selected preview unless marked “all”.
            </p>
          </div>

          <ControlGroup label="Exhibit">
            <LargeTouchButton
              variant="secondary"
              onClick={() => window.open(exhibitSimulatorSrc(selectedId), "_blank")}
            >
              Open exhibit
            </LargeTouchButton>
            <QuietButton
              className="no-underline bg-white/10"
              onClick={() => sendSelected({ action: "softReset", reason: "simulator" })}
            >
              Reset exhibit
            </QuietButton>
            <QuietButton
              className="no-underline bg-white/10"
              onClick={() => sendSelected({ action: "triggerInactivity" })}
            >
              Trigger inactivity
            </QuietButton>
            <QuietButton
              className="no-underline bg-white/10"
              onClick={() => sendSelected({ action: "triggerAttract" })}
            >
              Trigger attract
            </QuietButton>
            <QuietButton
              className="no-underline bg-white/10"
              onClick={() => sendSelected({ action: "noteInteraction" })}
            >
              Note interaction
            </QuietButton>
          </ControlGroup>

          <ControlGroup label="Audio & motion">
            <QuietButton
              className="no-underline bg-white/10"
              aria-pressed={muted}
              onClick={() => {
                const next = !muted;
                setMuted(next);
                broadcast({ action: "setMuted", muted: next });
              }}
            >
              {muted ? "Unmute all" : "Mute all"}
            </QuietButton>
            <QuietButton
              className="no-underline bg-white/10"
              aria-pressed={reducedMotion}
              onClick={() => {
                const next = !reducedMotion;
                setReducedMotion(next);
                broadcast({ action: "setReducedMotion", value: next ? true : null });
              }}
            >
              {reducedMotion ? "Reduced motion on" : "Enable reduced motion"}
            </QuietButton>
          </ControlGroup>

          <ControlGroup label="Failure modes">
            <QuietButton
              className="no-underline bg-white/10"
              aria-pressed={mediaFailure}
              onClick={() => {
                const next = !mediaFailure;
                setMediaFailure(next);
                setSimulatorMediaFailure(next);
                broadcast({ action: "setMediaFailure", enabled: next });
                reloadFrames();
              }}
            >
              {mediaFailure ? "Media failure on" : "Simulate media failure"}
            </QuietButton>
            <QuietButton
              className="no-underline bg-white/10"
              aria-pressed={offline}
              onClick={() => {
                const next = !offline;
                setOffline(next);
                setSimulatorOffline(next);
                broadcast({ action: "setOffline", enabled: next });
              }}
            >
              {offline ? "Offline sim on" : "Simulate offline"}
            </QuietButton>
          </ControlGroup>

          <ControlGroup label="Inspect">
            <QuietButton className="no-underline bg-white/10" onClick={refreshState}>
              Refresh exhibit state
            </QuietButton>
            <QuietButton className="no-underline bg-white/10" onClick={refreshAnalytics}>
              Refresh analytics
            </QuietButton>
            <pre className="max-h-40 overflow-auto rounded-[var(--radius-sm)] bg-black/40 p-3 text-[length:var(--text-micro)] text-[var(--text-on-dark-muted)]">
              {frameState
                ? JSON.stringify(frameState, null, 2)
                : "No state yet — wait for iframe boot or press refresh."}
            </pre>
            <pre className="max-h-48 overflow-auto rounded-[var(--radius-sm)] bg-black/40 p-3 text-[length:var(--text-micro)] text-[var(--text-on-dark-muted)]">
              {analyticsJson || "Analytics empty"}
            </pre>
          </ControlGroup>

          <ControlGroup label="Danger">
            <HoldProgressButton
              label="Clear all local storage"
              durationMs={1100}
              onComplete={() => {
                try {
                  window.localStorage.clear();
                  window.sessionStorage.clear();
                } catch {
                  /* ignore */
                }
                clearKioskLocalSettings();
                getAnalytics().clear();
                setMediaFailure(false);
                setOffline(false);
                setMuted(false);
                setReducedMotion(false);
                refreshAnalytics();
                reloadFrames();
              }}
            />
          </ControlGroup>
        </aside>
      </div>
    </div>
  );
}

function ControlGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2 border-t border-white/10 pt-4">
      <p className="text-[length:var(--text-label)] tracking-[var(--tracking-label)] text-[var(--color-museum-warm)] uppercase">
        {label}
      </p>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function SimulatorScaledFrame({
  stationId,
  width,
  height,
  src,
  onMount,
}: {
  stationId: StationId;
  width: number;
  height: number;
  src: string;
  onMount: (node: HTMLIFrameElement | null) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);

  useEffect(() => {
    const node = wrapRef.current?.parentElement;
    if (!node) return;
    const measure = () => {
      const rect = node.getBoundingClientRect();
      const next = Math.min(rect.width / width, rect.height / height);
      setScale(Number.isFinite(next) && next > 0 ? next : 0.2);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [height, width]);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden bg-[#05080f]">
      <iframe
        title={`Simulator ${stationId}`}
        src={src}
        ref={(node) => onMount(node)}
        className="absolute left-0 top-0 border-0"
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          pointerEvents: "auto",
        }}
      />
    </div>
  );
}
