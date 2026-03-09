"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  mansionId: string;
  onSubmit: (unit: UnitFormData) => void;
}

export interface UnitFormData {
  mansion_id: string;
  room_number: string;
  floor_range: string;
  size_sqm: number;
  layout_type: string;
  direction: string;
  balcony: string;
  memo: string;
}

export function AddUnitModal({ isOpen, onClose, mansionId, onSubmit }: AddUnitModalProps) {
  const [form, setForm] = useState<UnitFormData>({
    mansion_id: mansionId,
    room_number: "",
    floor_range: "",
    size_sqm: 0,
    layout_type: "",
    direction: "",
    balcony: "",
    memo: "",
  });
  const [loading, setLoading] = useState(false);

  function update(field: keyof UnitFormData, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    onSubmit({ ...form, mansion_id: mansionId });
    setForm({
      mansion_id: mansionId,
      room_number: "",
      floor_range: "",
      size_sqm: 0,
      layout_type: "",
      direction: "",
      balcony: "",
      memo: "",
    });
    setLoading(false);
    onClose();
  }

  const layoutOptions = ["1R", "1K", "1DK", "1LDK", "2K", "2DK", "2LDK", "3LDK", "4LDK"];
  const directionOptions = ["北", "北東", "東", "南東", "南", "南西", "西", "北西"];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="間取りタイプを追加">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">間取り *</label>
            <select
              required
              value={form.layout_type}
              onChange={(e) => update("layout_type", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">選択してください</option>
              {layoutOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">専有面積（㎡）*</label>
            <input
              type="number"
              required
              min={1}
              step={0.1}
              value={form.size_sqm || ""}
              onChange={(e) => update("size_sqm", parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="71.2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">向き</label>
            <select
              value={form.direction}
              onChange={(e) => update("direction", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">選択してください</option>
              {directionOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">階数範囲</label>
            <input
              type="text"
              value={form.floor_range}
              onChange={(e) => update("floor_range", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="例: 20-30F"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">部屋番号</label>
            <input
              type="text"
              value={form.room_number}
              onChange={(e) => update("room_number", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="例: 2401"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">バルコニー</label>
            <input
              type="text"
              value={form.balcony}
              onChange={(e) => update("balcony", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="例: 12.5㎡"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">備考</label>
          <textarea
            value={form.memo}
            onChange={(e) => update("memo", e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "追加中..." : "追加する"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
