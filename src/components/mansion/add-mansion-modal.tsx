"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AddMansionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mansion: MansionFormData) => void | Promise<void>;
}

export interface MansionFormData {
  name: string;
  address: string;
  nearest_station: string;
  walking_minutes: number;
  brand_type: string;
  total_units: number | null;
  floors: number | null;
  construction_date: string;
  features: string;
  memo: string;
}

const initialForm: MansionFormData = {
  name: "",
  address: "",
  nearest_station: "",
  walking_minutes: 0,
  brand_type: "",
  total_units: null,
  floors: null,
  construction_date: "",
  features: "",
  memo: "",
};

export function AddMansionModal({ isOpen, onClose, onSubmit }: AddMansionModalProps) {
  const [form, setForm] = useState<MansionFormData>(initialForm);
  const [loading, setLoading] = useState(false);

  function update(field: keyof MansionFormData, value: string | number | null) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
      setForm(initialForm);
      onClose();
    } catch {
      // エラー時はモーダルを閉じない
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="建物を登録">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">建物名 *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="例: パークコート赤坂檜町ザ タワー"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">住所 *</label>
          <input
            type="text"
            required
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="例: 東京都港区赤坂9丁目"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">最寄り駅 *</label>
            <input
              type="text"
              required
              value={form.nearest_station}
              onChange={(e) => update("nearest_station", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="例: 六本木駅"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">徒歩（分）*</label>
            <input
              type="number"
              required
              min={0}
              value={form.walking_minutes || ""}
              onChange={(e) => update("walking_minutes", parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ブランド</label>
            <input
              type="text"
              value={form.brand_type}
              onChange={(e) => update("brand_type", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="三井不動産"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">階数</label>
            <input
              type="number"
              min={1}
              value={form.floors ?? ""}
              onChange={(e) => update("floors", e.target.value ? parseInt(e.target.value) : null)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">総戸数</label>
            <input
              type="number"
              min={1}
              value={form.total_units ?? ""}
              onChange={(e) => update("total_units", e.target.value ? parseInt(e.target.value) : null)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">竣工年</label>
          <input
            type="text"
            value={form.construction_date}
            onChange={(e) => update("construction_date", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="例: 2018年"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">特徴</label>
          <input
            type="text"
            value={form.features}
            onChange={(e) => update("features", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="例: タワーマンション、コンシェルジュ、フィットネス"
          />
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
            {loading ? "登録中..." : "登録する"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
