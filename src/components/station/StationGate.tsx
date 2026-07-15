"use client";

import { Suspense, type ReactNode } from "react";
import { StationProvider } from "@/components/station/StationProvider";

function StationBootFallback() {
  return (
    <div className="flex h-[100dvh] w-[100dvw] items-center justify-center bg-boreal-night">
      <p className="text-[length:var(--text-body)] text-[var(--text-on-dark-muted)]">
        Preparing station…
      </p>
    </div>
  );
}

/** Suspense boundary required for useSearchParams in StationProvider. */
export function StationGate({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<StationBootFallback />}>
      <StationProvider>{children}</StationProvider>
    </Suspense>
  );
}
