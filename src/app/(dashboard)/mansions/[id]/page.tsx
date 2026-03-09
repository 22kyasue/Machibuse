import { notFound } from "next/navigation";
import {
  getMansionById,
  getUnitsByMansionId,
  getListingsByUnitId,
} from "@/lib/queries";
import { MansionDetailClient } from "@/components/mansion/mansion-detail-client";

export default async function MansionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mansion = await getMansionById(id);
  if (!mansion) notFound();

  const units = await getUnitsByMansionId(id);

  const activeListings = [];
  for (const unit of units) {
    const listings = await getListingsByUnitId(unit.id);
    activeListings.push(
      ...listings.filter((l) => l.status === "active").map((l) => ({ ...l, unit }))
    );
  }

  return (
    <MansionDetailClient
      mansion={mansion}
      initialUnits={units}
      activeListings={activeListings}
    />
  );
}
