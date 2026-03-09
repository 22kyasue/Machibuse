"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { StatusTag } from "@/components/ui/status-tag";
import { AddMansionModal, type MansionFormData } from "@/components/mansion/add-mansion-modal";
import { mockMansions } from "@/lib/mock-data";
import type { MansionWithStats } from "@/types";

type SortKey = "updated_at" | "name" | "active_listings_count" | "walking_minutes";
type FilterKey = "all" | "watched" | "active";

const ITEMS_PER_PAGE = 9;

export default function MansionsPage() {
  const [mansions, setMansions] = useState<MansionWithStats[]>(mockMansions);
  const [sortKey, setSortKey] = useState<SortKey>("updated_at");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = useMemo(() => {
    let result = [...mansions];

    // フィルター
    if (filter === "watched") result = result.filter((m) => m.is_watched);
    if (filter === "active") result = result.filter((m) => m.active_listings_count > 0);

    // ソート
    result.sort((a, b) => {
      switch (sortKey) {
        case "name":
          return a.name.localeCompare(b.name, "ja");
        case "active_listings_count":
          return b.active_listings_count - a.active_listings_count;
        case "walking_minutes":
          return a.walking_minutes - b.walking_minutes;
        case "updated_at":
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });

    return result;
  }, [mansions, sortKey, filter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  function handleAddMansion(data: MansionFormData) {
    const newMansion: MansionWithStats = {
      id: crypto.randomUUID(),
      ...data,
      brand_type: data.brand_type || null,
      total_units: data.total_units,
      floors: data.floors,
      construction_date: data.construction_date || null,
      features: data.features || null,
      memo: data.memo || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      active_listings_count: 0,
      known_unit_types_count: 0,
      recent_listings_count: 0,
      last_listing_date: null,
      is_watched: false,
      status: "unknown",
    };
    setMansions((prev) => [newMansion, ...prev]);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">建物一覧</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + 建物を登録
        </button>
      </div>

      {/* フィルター & ソート */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 text-sm">
          {(
            [
              { key: "all", label: "すべて" },
              { key: "watched", label: "監視中のみ" },
              { key: "active", label: "募集中あり" },
            ] as const
          ).map((f) => (
            <button
              key={f.key}
              onClick={() => { setFilter(f.key); setPage(1); }}
              className={`rounded-full px-3 py-1 ${
                filter === f.key
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">並び替え:</span>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="rounded-lg border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="updated_at">更新日順</option>
            <option value="name">名前順</option>
            <option value="active_listings_count">募集数順</option>
            <option value="walking_minutes">駅近順</option>
          </select>
        </div>
      </div>

      {/* 件数表示 */}
      <p className="text-sm text-gray-500">
        {filtered.length}件中 {(page - 1) * ITEMS_PER_PAGE + 1}-{Math.min(page * ITEMS_PER_PAGE, filtered.length)}件を表示
      </p>

      {/* 建物カード一覧 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {paginated.map((mansion) => (
          <Link key={mansion.id} href={`/mansions/${mansion.id}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-gray-900">
                      {mansion.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {mansion.nearest_station} 徒歩{mansion.walking_minutes}分
                    </p>
                    <p className="text-xs text-gray-400">
                      {mansion.construction_date} / {mansion.floors}階建 /{" "}
                      {mansion.total_units}戸
                    </p>
                  </div>
                  {mansion.is_watched && (
                    <span className="ml-2 flex-shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      監視中
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {mansion.active_listings_count > 0 && (
                    <StatusTag status="active" />
                  )}
                  {mansion.active_listings_count === 0 &&
                    mansion.last_listing_date && <StatusTag status="past" />}
                  {!mansion.last_listing_date && (
                    <StatusTag status="unknown" />
                  )}
                  {mansion.recent_listings_count > 0 && (
                    <StatusTag status="new" />
                  )}
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 text-center">
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {mansion.active_listings_count}
                    </p>
                    <p className="text-xs text-gray-500">募集中</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {mansion.known_unit_types_count}
                    </p>
                    <p className="text-xs text-gray-500">確認タイプ</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {mansion.recent_listings_count}
                    </p>
                    <p className="text-xs text-gray-500">30日新着</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            前へ
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                page === p
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            次へ
          </button>
        </div>
      )}

      {/* 建物登録モーダル */}
      <AddMansionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddMansion}
      />
    </div>
  );
}
