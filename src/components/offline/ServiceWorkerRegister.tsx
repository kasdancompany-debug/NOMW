"use client";

import { useEffect } from "react";

/**
 * Registers the museum service worker in production builds.
 * Caches app shell + /media for LAN/offline kiosk resilience.
 * Skipped in development so HMR is not fighting the cache.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    let cancelled = false;

    void (async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });
        if (cancelled) return;

        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              // Activate updated worker on next quiet moment — skip waiting via message.
              worker.postMessage("SKIP_WAITING");
            }
          });
        });
      } catch (error) {
        console.warn("[offline] service worker registration failed", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
