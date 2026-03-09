"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AddListingModal,
  type ListingFormData,
} from "@/components/listing/add-listing-modal";

interface AddListingSectionProps {
  unitId: string;
}

export function AddListingSection({ unitId }: AddListingSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  async function handleSubmit(data: ListingFormData) {
    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "募集の登録に失敗しました");
    }
    router.refresh();
  }

  return (
    <>
      <Button variant="outline" onClick={() => setShowModal(true)}>
        + 募集を登録
      </Button>
      <AddListingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        unitId={unitId}
        onSubmit={handleSubmit}
      />
    </>
  );
}
