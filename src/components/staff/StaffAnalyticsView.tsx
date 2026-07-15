"use client";

import { useMemo, useState } from "react";
import { getAnimal } from "@/content/animals";
import { HoldProgressButton } from "@/components/touch/HoldProgressButton";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { getAnalytics } from "@/lib/analytics";
import { cn } from "@/utils/cn";

function formatDuration(ms: number | null) {
  if (ms == null) return "—";
  const sec = Math.round(ms / 1000);
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function labelAnimal(id: string) {
  return getAnimal(id)?.commonName ?? id;
}

/**
 * Aggregate-only analytics for staff. No visitor identity is stored or shown.
 */
export function StaffAnalyticsView() {
  const [tick, setTick] = useState(0);
  const summary = useMemo(() => {
    void tick;
    return getAnalytics().getSummary(8);
  }, [tick]);

  const refresh = () => setTick((value) => value + 1);

  const exportJson = () => {
    const json = getAnalytics().exportJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    anchor.href = url;
    anchor.download = `nomow-analytics-${stamp}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="mt-[var(--space-6)] space-y-[var(--space-6)]">
      <div className="rounded-[var(--radius-sm)] border border-white/10 bg-white/5 p-[var(--space-5)]">
        <h3 className="text-[length:var(--text-title)] text-[var(--text-on-dark)]">
          Local analytics
        </h3>
        <p className="mt-2 max-w-2xl text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
          Aggregate counts only on this station. No names, faces, photos, free-text answers, or
          advertising identifiers are recorded.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total sessions" value={String(summary.totalSessions)} />
          <StatCard
            label="Avg session"
            value={formatDuration(summary.averageSessionDurationMs)}
          />
          <StatCard label="Inactivity resets" value={String(summary.inactivityResetCount)} />
          <StatCard
            label="Errors"
            value={`${summary.applicationErrorCount} app · ${summary.mediaErrorCount} media`}
          />
        </div>
      </div>

      <div className="grid gap-[var(--space-5)] lg:grid-cols-3">
        <RankList
          title="Most selected animals"
          empty="No profiles opened yet"
          items={summary.mostSelectedAnimals.map((entry) => ({
            label: labelAnimal(entry.id),
            count: entry.count,
          }))}
        />
        <RankList
          title="Most completed activities"
          empty="No challenges completed yet"
          items={summary.mostCompletedActivities.map((entry) => ({
            label: entry.id,
            count: entry.count,
          }))}
        />
        <RankList
          title="Most played calls"
          empty="No calls played yet"
          items={summary.mostPlayedCalls.map((entry) => ({
            label: entry.id,
            count: entry.count,
          }))}
        />
      </div>

      <div className="rounded-[var(--radius-sm)] border border-white/10 bg-white/5 p-[var(--space-5)]">
        <h4 className="text-[length:var(--text-body)] text-[var(--text-on-dark)]">Event totals</h4>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(summary.totals).map(([key, count]) => (
            <li
              key={key}
              className="flex justify-between gap-3 border-b border-white/8 py-1 text-[length:var(--text-body-sm)]"
            >
              <span className="text-[var(--text-on-dark-muted)]">{key}</span>
              <span className="text-[var(--text-on-dark)]">{count}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[length:var(--text-micro)] text-[var(--text-on-dark-muted)]">
          Since {new Date(summary.since).toLocaleString()} · updated{" "}
          {new Date(summary.updatedAt).toLocaleString()}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <LargeTouchButton onClick={exportJson}>Export JSON</LargeTouchButton>
        <LargeTouchButton variant="secondary" onClick={refresh}>
          Refresh
        </LargeTouchButton>
        <HoldProgressButton
          label="Clear analytics"
          durationMs={1100}
          onComplete={() => {
            getAnalytics().clear();
            refresh();
          }}
        />
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-sm)] bg-white/6 px-4 py-3">
      <p className="text-[length:var(--text-micro)] tracking-[var(--tracking-label)] text-[var(--text-on-dark-muted)] uppercase">
        {label}
      </p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-[length:var(--text-title)] text-[var(--text-on-dark)]">
        {value}
      </p>
    </div>
  );
}

function RankList({
  title,
  empty,
  items,
}: {
  title: string;
  empty: string;
  items: Array<{ label: string; count: number }>;
}) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-white/10 bg-white/5 p-[var(--space-5)]">
      <h4 className="text-[length:var(--text-body)] text-[var(--text-on-dark)]">{title}</h4>
      {items.length === 0 ? (
        <p className="mt-3 text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">{empty}</p>
      ) : (
        <ol className="mt-3 space-y-2">
          {items.map((item, index) => (
            <li
              key={`${item.label}-${index}`}
              className={cn(
                "flex items-baseline justify-between gap-3 text-[length:var(--text-body-sm)]",
              )}
            >
              <span className="text-[var(--text-on-dark)]">
                <span className="mr-2 text-[var(--text-on-dark-muted)]">{index + 1}.</span>
                {item.label}
              </span>
              <span className="text-[var(--color-museum-warm)]">{item.count}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
