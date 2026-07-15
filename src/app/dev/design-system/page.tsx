import { notFound } from "next/navigation";

/**
 * Visual design system gallery. Available in development only.
 * Production builds resolve to 404 so kiosks cannot open it accidentally.
 */
export default async function DesignSystemPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const { DesignSystemPreview } = await import("@/components/ui/DesignSystemPreview");
  return <DesignSystemPreview />;
}
