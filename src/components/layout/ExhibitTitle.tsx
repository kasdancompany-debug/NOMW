import { cn } from "@/utils/cn";

type ExhibitTitleProps = {
  title: string;
  tagline?: string;
  className?: string;
  as?: "h1" | "h2";
};

/**
 * Exhibit identity. Strong, editorial — subordinate to museum brand when both appear.
 */
export function ExhibitTitle({
  title,
  tagline,
  className,
  as: Tag = "h1",
}: ExhibitTitleProps) {
  return (
    <div className={cn("max-w-[28ch]", className)}>
      <Tag
        className={cn(
          "font-[family-name:var(--font-display)] text-[length:var(--text-display-xl)]",
          "leading-[var(--leading-display)] tracking-[var(--tracking-display)]",
          "text-[var(--text-on-dark)]",
        )}
      >
        {title}
      </Tag>
      {tagline ? (
        <p
          className={cn(
            "mt-[var(--space-5)] max-w-[36ch] font-[family-name:var(--font-body)]",
            "text-[length:var(--text-lead)] leading-[var(--leading-body)]",
            "text-[var(--text-on-dark-muted)]",
          )}
        >
          {tagline}
        </p>
      ) : null}
    </div>
  );
}
