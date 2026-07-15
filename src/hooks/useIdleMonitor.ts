"use client";

/**
 * @deprecated Prefer useKioskSession + registerResetHandler.
 * Forwards idle soft-reset into the registered kiosk session handlers.
 */
import { useEffect } from "react";
import { useKioskSession } from "@/hooks/useKioskSession";

export function useIdleMonitor(onIdle?: () => void): void {
  const { phase, resetGeneration, registerResetHandler } = useKioskSession();

  useEffect(() => {
    if (!onIdle) return;
    return registerResetHandler(onIdle);
  }, [onIdle, registerResetHandler]);

  useEffect(() => {
    if (phase === "reset" || phase === "attract") {
      onIdle?.();
    }
  }, [phase, resetGeneration, onIdle]);
}
