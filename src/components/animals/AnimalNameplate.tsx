import { cn } from "@/utils/cn";

type AnimalNameplateProps = {
  commonName: string;
  scientificName?: string;
  className?: string;
};

/**
 * Species identity lockup — editorial display + quiet scientific line.
 */
export function AnimalNameplate({
  commonName,
  scientificName,
  className,
}: AnimalNameplateProps) {
  return (
    <div className={cn("max-w-[28rem]", className)}>
      <p
        className={cn(
          "font-[family-name:var(--font-display)] text-[clamp(2rem,3.2vw,3rem)]",
          "font-medium leading-[1.05] tracking-[-0.02em]",
          "text-[var(--text-on-dark)]",
        )}
      >
        {commonName}
      </p>
      {scientificName ? (
        <p
          className={cn(
            "mt-[var(--space-2)] font-[family-name:var(--font-body)] text-[15px]",
            "italic tracking-[0.01em] text-[var(--color-museum-warm)]/90",
          )}
        >
          {scientificName}
        </p>
      ) : null}
    </div>
  );
}
