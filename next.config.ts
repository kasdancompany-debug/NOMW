import type { NextConfig } from "next";

/**
 * Local-first museum kiosk build.
 * - No remote image optimization / CDN loaders
 * - standalone output for museum LAN + USB install bundles
 * App + /media caching is handled by the service worker (see public/sw.js).
 */
const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
    // Local kiosk media only — never hit a remote optimizer.
    remotePatterns: [],
  },
  // Avoid accidental absolute asset URLs to a remote CDN.
  assetPrefix: undefined,
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/manifest.webmanifest",
        headers: [{ key: "Cache-Control", value: "no-cache" }],
      },
    ];
  },
};

export default nextConfig;
