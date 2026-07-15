"use client";

import { cn } from "@/utils/cn";
import { StaffLogoHold } from "@/components/staff/StaffLogoHold";

type MuseumTitleProps = {
  className?: string;
  as?: "h1" | "p" | "div";
  /** Compact lockup for secondary scenes */
  size?: "hero" | "compact";
};

/**
 * Brand-level title. Should read as a hero signal — not a nav eyebrow.
 * Long-press opens the hidden staff PIN gate.
 */
export function MuseumTitle({
  className,
  as: Tag = "h1",
  size = "hero",
}: MuseumTitleProps) {
  return (
    <StaffLogoHold className="block">
      <Tag
        className={cn(
          "font-[family-name:var(--font-display)] text-[var(--text-on-dark)]",
          "leading-[var(--leading-display)] tracking-[var(--tracking-display)]",
          size === "hero" && "text-[length:var(--text-display-lg)]",
          size === "compact" && "text-[length:var(--text-display-md)]",
          className,
        )}
      >
        <span className="block text-[length:var(--text-label)] font-[family-name:var(--font-ui)] font-[number:var(--font-weight-medium)] tracking-[var(--tracking-wide)] text-[var(--color-museum-warm)] uppercase">
          The
        </span>
        <span className="mt-[var(--space-2)] block">Northern Ontario</span>
        <span className="block">Museum of Wonder</span>
      </Tag>
    </StaffLogoHold>
  );
}
