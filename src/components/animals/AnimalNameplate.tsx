import { cn } from "@/utils/cn";

type AnimalNameplateProps = {
  commonName: string;
  scientificName?: string;
  className?: string;
};

/**
 * Species identity lockup — editorial, not a sticker or badge overlay aesthetic.
 */
export function AnimalNameplate({
  commonName,
  scientificName,
  className,
}: AnimalNameplateProps) {
  return (
    <div className={cn("max-w-[24rem]", className)}>
      <p
        className={cn(
          "font-[family-name:var(--font-display)] text-[length:var(--text-title)]",
          "leading-[var(--leading-title)] tracking-[var(--tracking-title)]",
          "text-[var(--text-on-dark)]",
        )}
      >
        {commonName}
      </p>
      {scientificName ? (
        <p
          className={cn(
            "mt-[var(--space-2)] font-[family-name:var(--font-body)] italic",
            "text-[length:var(--text-body-sm)] text-[var(--text-on-dark-muted)]",
          )}
        >
          {scientificName}
        </p>
      ) : null}
    </div>
  );
}
