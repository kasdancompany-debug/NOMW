"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_KIOSK_SETTINGS,
  KIOSK_HEARTBEAT_STORAGE_KEY,
  KIOSK_SETTINGS_STORAGE_KEY,
} from "@/types/kiosk-session";
import { ANALYTICS_STORAGE_KEY } from "@/types/analytics";
import { isSimulatorOffline } from "@/lib/dev/simulator";
import { saveKioskSettings } from "@/lib/kiosk/settings";
import { clearStationAssignment } from "@/lib/kiosk/station";
import { getAnalytics } from "@/lib/analytics";

export function clearKioskLocalSettings() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KIOSK_SETTINGS_STORAGE_KEY);
    window.localStorage.removeItem(KIOSK_HEARTBEAT_STORAGE_KEY);
    window.localStorage.removeItem(ANALYTICS_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  clearStationAssignment();
  getAnalytics().clear();
  saveKioskSettings({ ...DEFAULT_KIOSK_SETTINGS });
}

export function useOnlineStatus() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const sync = () => setOnline(!isSimulatorOffline() && navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    window.addEventListener("nomow-simulator-flags", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
      window.removeEventListener("nomow-simulator-flags", sync);
    };
  }, []);
  return online;
}

export function useScreenResolution() {
  const [size, setSize] = useState({ width: 0, height: 0, dpr: 1 });
  useEffect(() => {
    const measure = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
        dpr: window.devicePixelRatio || 1,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  return size;
}

export function useFullscreenState() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const sync = () => setActive(Boolean(document.fullscreenElement));
    sync();
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const enter = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      /* browser / kiosk policy may block */
    }
  }, []);

  const exit = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
    } catch {
      /* ignore */
    }
  }, []);

  return { active, enter, exit };
}

export function useMediaLoadingStatus() {
  const [status, setStatus] = useState("idle");
  const [detail, setDetail] = useState("No pending media");

  useEffect(() => {
    const tick = () => {
      const images = Array.from(document.images);
      const pendingImages = images.filter((img) => !img.complete).length;
      const videos = Array.from(document.querySelectorAll("video"));
      const pendingVideos = videos.filter(
        (video) => video.readyState < 2 && Boolean(video.getAttribute("src") || video.currentSrc),
      ).length;

      if (pendingImages + pendingVideos > 0) {
        setStatus("loading");
        setDetail(`${pendingImages} image(s), ${pendingVideos} video(s) still loading`);
      } else if (document.readyState !== "complete") {
        setStatus("loading");
        setDetail(`Document: ${document.readyState}`);
      } else {
        setStatus("ready");
        setDetail("Media ready (placeholders may still 404 soft)");
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return { status, detail };
}
