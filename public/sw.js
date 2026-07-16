/* global self, caches, fetch, Request, Response, clients */

/**
 * Northern Ontario Museum of Wonder — offline service worker
 *
 * Caches:
 * - Application shell + Next static chunks (code)
 * - Essential /media assets after first successful fetch
 * - Local fonts / icons / manifest
 *
 * Never caches /api/* (staff PIN verify stays live against the local Node process).
 * No CDN URLs — same-origin only.
 */

const VERSION = "nomow-offline-v2";
const SHELL_CACHE = `${VERSION}-shell`;
const MEDIA_CACHE = `${VERSION}-media`;
const STATIC_CACHE = `${VERSION}-static`;

const PRECACHE_URLS = [
  "/",
  "/manifest.webmanifest",
  "/icons/icon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/offline.html",
  "/exhibit/welcome",
  "/exhibit/forest",
  "/exhibit/water",
  "/exhibit/sky",
  "/exhibit/night",
  "/exhibit/seasons",
  "/exhibit/tracks",
  "/exhibit/coexistence",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      await Promise.all(
        PRECACHE_URLS.map(async (url) => {
          try {
            const response = await fetch(url, { cache: "reload" });
            if (response.ok) await cache.put(url, response.clone());
          } catch {
            /* optional route may 404 during early bring-up */
          }
        }),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith("nomow-offline-") && !key.startsWith(VERSION))
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

function isApi(url) {
  return url.pathname.startsWith("/api/");
}

function isMedia(url) {
  return url.pathname.startsWith("/media/");
}

function isNextStatic(url) {
  return url.pathname.startsWith("/_next/static/");
}

function isNavigational(request) {
  return request.mode === "navigate" || (request.method === "GET" && request.headers.get("accept")?.includes("text/html"));
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    await cache.put(request, response.clone());
  }
  return response;
}

async function networkFirstNavigation(request) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = (await cache.match(request)) || (await cache.match("/")) || (await cache.match("/offline.html"));
    if (cached) return cached;
    return new Response(
      "<!doctype html><title>Offline</title><body style=\"font-family:system-ui;background:#061018;color:#eef3f6;display:grid;place-items:center;height:100vh\"><p>Station is offline. Restore local power/network, then reload.</p></body>",
      { headers: { "Content-Type": "text/html; charset=utf-8" }, status: 503 },
    );
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (!isSameOrigin(url)) return;
  if (isApi(url)) return;

  if (isNavigational(request)) {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (isMedia(url)) {
    event.respondWith(cacheFirst(request, MEDIA_CACHE));
    return;
  }

  if (isNextStatic(url) || url.pathname.startsWith("/icons/") || url.pathname.endsWith(".woff2")) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  event.respondWith(
    (async () => {
      try {
        const response = await fetch(request);
        if (response.ok && (url.pathname.startsWith("/_next/") || url.pathname === "/manifest.webmanifest")) {
          const cache = await caches.open(STATIC_CACHE);
          await cache.put(request, response.clone());
        }
        return response;
      } catch {
        const cached = await caches.match(request);
        if (cached) return cached;
        throw new Error("offline-miss");
      }
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
