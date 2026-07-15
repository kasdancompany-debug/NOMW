import { notFound } from "next/navigation";

/**
 * Eight-station museum floor simulator. Development only.
 * Production builds 404 so kiosks cannot open it.
 */
export default async function MuseumSimulatorPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const { MuseumSimulator } = await import("@/components/dev/MuseumSimulator");
  return <MuseumSimulator />;
}
