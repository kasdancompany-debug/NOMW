"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { silenceStationAudio } from "@/lib/media/audioManager";
import { useKioskSession } from "@/hooks/useKioskSession";

/**
 * Guarantees station audio cannot leak across route changes or soft resets
 * (inactivity, home control, JS errors).
 */
export function AudioLifecycleGuard() {
  const pathname = usePathname();
  const { registerResetHandler } = useKioskSession();

  useEffect(() => {
    silenceStationAudio(true);
  }, [pathname]);

  useEffect(() => {
    return registerResetHandler(() => {
      silenceStationAudio(false);
    });
  }, [registerResetHandler]);

  return null;
}
