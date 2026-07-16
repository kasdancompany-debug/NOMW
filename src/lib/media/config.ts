import type { MediaPreload } from "@/types/media";

/** Default image sizes attribute for kiosk 1920×1080 stage. */
export const KIOSK_IMAGE_SIZES = {
  fullBleed: "100vw",
  hero: "(max-width: 1920px) 55vw, 1100px",
  portrait: "(max-width: 1920px) 32vw, 640px",
  thumb: "(max-width: 1920px) 20vw, 360px",
} as const;

/** Prefer light preload so eight exhibits are not decoding every bed at boot. */
export const DEFAULT_VIDEO_PRELOAD: MediaPreload = "metadata";
export const DEFAULT_FACELESS_VIDEO_PRELOAD: MediaPreload = "none";
export const DEFAULT_AUDIO_ONESHOT_PRELOAD: MediaPreload = "none";
export const DEFAULT_AUDIO_AMBIENT_PRELOAD: MediaPreload = "metadata";

/** Soft SVG / CSS identity when no image file exists — never a broken browser icon. */
export const MEDIA_FALLBACK_DATA_URI =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1a3038"/>
          <stop offset="55%" stop-color="#243528"/>
          <stop offset="100%" stop-color="#0e161c"/>
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#g)"/>
      <path d="M0 720 C220 620 380 700 560 590 C760 470 930 650 1120 540 C1300 440 1450 570 1600 500 V900 H0 Z" fill="rgba(5,16,20,0.45)"/>
    </svg>`,
  );
