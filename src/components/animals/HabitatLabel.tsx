import { cn } from "@/utils/cn";

type HabitatLabelProps = {
  name: string;
  regionNote?: string;
  className?: string;
};

/**
 * Habitat place-name — quiet typography over environment media.
 */
export function HabitatLabel({ name, regionNote, className }: HabitatLabelProps) {
  return (
    <div className={cn("inline-flex flex-col gap-[var(--space-2)]", className)}>
      <p
        className={cn(
          "font-[family-name:var(--font-ui)] text-[length:var(--text-label)]",
          "font-[number:var(--font-weight-medium)] tracking-[var(--tracking-label)]",
          "text-[var(--color-aurora-teal)] uppercase",
        )}
      >
        Habitat
      </p>
      <p
        className={cn(
          "font-[family-name:var(--font-display)] text-[length:var(--text-title)]",
          "leading-[var(--leading-title)] text-[var(--text-on-dark)]",
        )}
      >
        {name}
      </p>
      {regionNote ? (
        <p className="text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]">
          {regionNote}
        </p>
      ) : null}
    </div>
  );
}
