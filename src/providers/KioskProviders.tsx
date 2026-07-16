"use client";

import type { ReactNode } from "react";
import { AudioLifecycleGuard } from "@/components/audio/AudioLifecycleGuard";
import { ReducedMotionDocumentSync } from "@/components/a11y/ReducedMotionDocumentSync";
import { SimulatorBridge } from "@/components/dev/SimulatorBridge";
import { StudioSwitcher } from "@/components/dev/StudioSwitcher";
import { DevIdleIndicator } from "@/components/kiosk/DevIdleIndicator";
import { ServiceWorkerRegister } from "@/components/offline/ServiceWorkerRegister";
import { StaffHost } from "@/components/staff/StaffHost";
import { StationGate } from "@/components/station/StationGate";
import { KioskSessionProvider } from "@/providers/KioskSessionProvider";

type KioskProvidersProps = {
  children: ReactNode;
};

/** Root client providers for kiosk session + station assignment + staff overlays. */
export function KioskProviders({ children }: KioskProvidersProps) {
  return (
    <KioskSessionProvider>
      <ReducedMotionDocumentSync />
      <SimulatorBridge />
      <ServiceWorkerRegister />
      <StationGate>
        <AudioLifecycleGuard />
        {children}
        <StudioSwitcher />
        <StaffHost />
        <DevIdleIndicator />
      </StationGate>
    </KioskSessionProvider>
  );
}
