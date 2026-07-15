import { GlassPanel } from "@/components/ui/GlassPanel";
import { cn } from "@/utils/cn";

type FactPanelProps = {
  title?: string;
  facts: string[];
  className?: string;
};

/**
 * Short museum facts — one idea per line. Content-driven; no animal hardcoding.
 */
export function FactPanel({ title, facts, className }: FactPanelProps) {
  if (facts.length === 0) return null;

  return (
    <GlassPanel density="dense" className={cn("max-w-[28rem]", className)} as="aside">
      {title ? (
        <p
          className={cn(
            "mb-[var(--space-4)] font-[family-name:var(--font-ui)]",
            "text-[length:var(--text-label)] font-[number:var(--font-weight-medium)]",
            "tracking-[var(--tracking-label)] text-[var(--color-museum-warm)] uppercase",
          )}
        >
          {title}
        </p>
      ) : null}
      <ul className="space-y-[var(--space-4)]">
        {facts.map((fact) => (
          <li
            key={fact}
            className={cn(
              "border-l border-[var(--color-aurora-teal)]/50 pl-[var(--space-4)]",
              "font-[family-name:var(--font-body)] text-[length:var(--text-body)]",
              "leading-[var(--leading-body)] text-[var(--text-on-dark)]",
            )}
          >
            {fact}
          </li>
        ))}
      </ul>
    </GlassPanel>
  );
}
