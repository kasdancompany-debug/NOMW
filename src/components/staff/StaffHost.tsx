"use client";

import { StaffPanel } from "@/components/staff/StaffPanel";
import { StaffPinGate } from "@/components/staff/StaffPinGate";

/** Mounts staff PIN gate + authenticated panel above all exhibit chrome. */
export function StaffHost() {
  return (
    <>
      <StaffPinGate />
      <StaffPanel />
    </>
  );
}
