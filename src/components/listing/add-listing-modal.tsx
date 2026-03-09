"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export interface ListingFormData {
  unit_id: string;
  current_rent: number;
  management_fee: number | null;
  floor: number | null;
  source_site: string;
  source_url: string;
}

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitId: string;
  onSubmit: (data: ListingFormData) => void | Promise<void>;
}

export function AddListingModal({
  isOpen,
  onClose,
  unitId,
  onSubmit,
}: AddListingModalProps) {
  const [rentMan, setRentMan] = useState("");
  const [managementFeeMan, setManagementFeeMan] = useState("");
  const [floor, setFloor] = useState("");
  const [sourceSite, setSourceSite] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setRentMan("");
    setManagementFeeMan("");
    setFloor("");
    setSourceSite("");
    setSourceUrl("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const rentYen = Math.round(parseFloat(rentMan) * 10000);
    if (isNaN(rentYen) || rentYen <= 0) return;

    const managementFeeYen = managementFeeMan
      ? Math.round(parseFloat(managementFeeMan) * 10000)
      : null;
    const floorNum = floor ? parseInt(floor, 10) : null;

    const data: ListingFormData = {
      unit_id: unitId,
      current_rent: rentYen,
      management_fee: managementFeeYen,
      floor: floorNum,
      source_site: sourceSite,
      source_url: sourceUrl,
    };

    setLoading(true);
    try {
      await onSubmit(data);
      resetForm();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (!loading) {
      resetForm();
      onClose();
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="募集を登録">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 賃料（必須） */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            賃料 <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              min="0"
              required
              value={rentMan}
              onChange={(e) => setRentMan(e.target.value)}
              placeholder="12.5"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="shrink-0 text-sm text-gray-500">万円</span>
          </div>
        </div>

        {/* 管理費（任意） */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            管理費
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              min="0"
              value={managementFeeMan}
              onChange={(e) => setManagementFeeMan(e.target.value)}
              placeholder="1.0"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="shrink-0 text-sm text-gray-500">万円</span>
          </div>
        </div>

        {/* 所在階（任意） */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            所在階
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              placeholder="3"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="shrink-0 text-sm text-gray-500">階</span>
          </div>
        </div>

        {/* 掲載元サイト名（任意） */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            掲載元サイト名
          </label>
          <input
            type="text"
            value={sourceSite}
            onChange={(e) => setSourceSite(e.target.value)}
            placeholder="SUUMO"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* 掲載元URL（任意） */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            掲載元URL
          </label>
          <input
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="https://suumo.jp/..."
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* ボタン */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            キャンセル
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "登録中..." : "登録する"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
