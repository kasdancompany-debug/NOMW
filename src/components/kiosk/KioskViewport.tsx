import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type KioskViewportProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Full-screen-safe stage: 100dvh/100vw with overflow clip for landscape kiosks.
 */
export function KioskViewport({ children, className }: KioskViewportProps) {
  return (
    <div
      className={cn(
        "kiosk-viewport relative h-[100dvh] w-[100dvw] max-h-[100dvh] max-w-[100dvw] overflow-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}
