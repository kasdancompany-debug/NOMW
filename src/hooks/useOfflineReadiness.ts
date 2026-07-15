"use client";

import { useEffect, useState } from "react";
import { isSimulatorOffline } from "@/lib/dev/simulator";

export type ServiceWorkerPhase =
  | "unsupported"
  | "registering"
  | "ready"
  | "controlling"
  | "error";

export type OfflineReadiness = {
  /** Browser `navigator.onLine` — often means LAN/NIC, not “internet”. */
  online: boolean;
  serviceWorker: ServiceWorkerPhase;
  /** True once at least one Cache Storage bucket exists for this origin. */
  cacheReady: boolean;
  label: string;
};

function buildLabel(online: boolean, sw: ServiceWorkerPhase, cacheReady: boolean): string {
  const net = online ? "Network available" : "Offline (local OK)";
  const worker =
    sw === "controlling" || sw === "ready"
      ? cacheReady
        ? " · SW cache ready"
        : " · SW registered"
      : sw === "unsupported"
        ? " · SW unsupported"
        : sw === "error"
          ? " · SW error"
          : " · SW registering";
  return `${net}${worker}`;
}

/**
 * Staff-only readiness: network + service worker cache.
 * Visitor UI never shows this.
 */
export function useOfflineReadiness(): OfflineReadiness {
  const [online, setOnline] = useState(
    () => (typeof navigator !== "undefined" ? navigator.onLine : true),
  );
  const [serviceWorker, setServiceWorker] = useState<ServiceWorkerPhase>("registering");
  const [cacheReady, setCacheReady] = useState(false);

  useEffect(() => {
    const syncOnline = () => {
      const forcedOffline = isSimulatorOffline();
      setOnline(!forcedOffline && navigator.onLine);
    };
    syncOnline();
    window.addEventListener("online", syncOnline);
    window.addEventListener("offline", syncOnline);
    window.addEventListener("nomow-simulator-flags", syncOnline);

    let cancelled = false;

    const refreshSw = async () => {
      if (!("serviceWorker" in navigator)) {
        if (!cancelled) setServiceWorker("unsupported");
        return;
      }
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (cancelled) return;
        if (!reg) {
          setServiceWorker(process.env.NODE_ENV === "production" ? "registering" : "unsupported");
        } else if (navigator.serviceWorker.controller || reg.active) {
          setServiceWorker("controlling");
        } else {
          setServiceWorker("ready");
        }
      } catch {
        if (!cancelled) setServiceWorker("error");
      }

      try {
        if ("caches" in window) {
          const keys = await caches.keys();
          if (!cancelled) setCacheReady(keys.some((key) => key.startsWith("nomow-offline-")));
        }
      } catch {
        if (!cancelled) setCacheReady(false);
      }
    };

    void refreshSw();
    const id = window.setInterval(() => void refreshSw(), 5000);

    const onControllerChange = () => void refreshSw();
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    }

    return () => {
      cancelled = true;
      window.removeEventListener("online", syncOnline);
      window.removeEventListener("offline", syncOnline);
      window.removeEventListener("nomow-simulator-flags", syncOnline);
      window.clearInterval(id);
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      }
    };
  }, []);

  return {
    online,
    serviceWorker,
    cacheReady,
    label: buildLabel(online, serviceWorker, cacheReady),
  };
}
