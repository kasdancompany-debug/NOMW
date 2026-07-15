import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type GlassPanelProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "aside";
  /** Stronger frosted surface for readable fact stacks */
  density?: "mist" | "dense";
};

/**
 * Interactive content container — glass for legibility over full-bleed media.
 * Not for decoration or card grids.
 */
export function GlassPanel({
  children,
  className,
  as: Tag = "div",
  density = "mist",
}: GlassPanelProps) {
  return (
    <Tag
      className={cn(
        "glass-surface p-[var(--space-6)]",
        density === "dense" && "bg-[rgba(8,18,24,0.78)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
