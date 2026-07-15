import localFont from "next/font/local";
import type { Metadata, Viewport } from "next";
import { KioskProviders } from "@/providers/KioskProviders";
import "@/content/database";
import "@/styles/globals.css";

/**
 * Vendored woff2 files — no Google Fonts / CDN at build or runtime.
 * System stacks remain in tokens.css if a file fails to load.
 */
const display = localFont({
  src: [
    { path: "../assets/fonts/CormorantGaramond-400.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/CormorantGaramond-500.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/CormorantGaramond-600.woff2", weight: "600", style: "normal" },
    { path: "../assets/fonts/CormorantGaramond-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-museum-display",
  display: "swap",
  fallback: ["Iowan Old Style", "Palatino Linotype", "Palatino", "Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

const body = localFont({
  src: [
    { path: "../assets/fonts/SourceSans3-400.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/SourceSans3-500.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/SourceSans3-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-museum-body",
  display: "swap",
  fallback: ["Avenir Next", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  title: "The Northern Ontario Museum of Wonder",
  description: "Interactive museum installation — Northern Ontario animals and habitats.",
  robots: { index: false, follow: false },
  applicationName: "Northern Ontario Museum of Wonder",
  appleWebApp: {
    capable: true,
    title: "NOMOW Kiosk",
    statusBarStyle: "black-translucent",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icons/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0a2233",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="antialiased">
        <KioskProviders>{children}</KioskProviders>
      </body>
    </html>
  );
}
