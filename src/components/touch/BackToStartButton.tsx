"use client";

import { QuietButton } from "@/components/touch/QuietButton";
import { cn } from "@/utils/cn";

type BackToStartButtonProps = {
  onPress: () => void;
  label?: string;
  className?: string;
};

/**
 * Returns the visitor to the exhibit home scene. Quiet, always large enough to hit.
 */
export function BackToStartButton({
  onPress,
  label = "Back to start",
  className,
}: BackToStartButtonProps) {
  return (
    <QuietButton
      onClick={onPress}
      className={cn(
        "border border-transparent text-[var(--color-mist)]",
        "active:border-[var(--glass-border)]",
        className,
      )}
      aria-label={label}
    >
      <span aria-hidden className="mr-[var(--space-3)] text-[var(--color-museum-warm)]">
        ←
      </span>
      {label}
    </QuietButton>
  );
}
