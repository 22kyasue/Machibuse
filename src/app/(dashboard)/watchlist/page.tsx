"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { StatusTag } from "@/components/ui/status-tag";
import { Button } from "@/components/ui/button";
import { mockMansions } from "@/lib/mock-data";
import type { MansionWithStats } from "@/types";

export default function WatchlistPage() {
  const [mansions, setMansions] = useState<MansionWithStats[]>(mockMansions);

  const watchedMansions = mansions.filter((m) => m.is_watched);
  const unwatchedMansions = mansions.filter((m) => !m.is_watched);

  function toggleWatch(id: string) {
    setMansions((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, is_watched: !m.is_watched } : m
      )
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">監視リスト</h1>
        <p className="text-sm text-gray-500">
          {watchedMansions.length}件の建物を監視中
        </p>
      </div>

      {/* 監視中 */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">監視中の建物</h2>
        {watchedMansions.length === 0 ? (
          <Card>
            <CardContent>
              <p className="text-center text-sm text-gray-500 py-4">
                監視中の建物はまだありません。
                <Link href="/mansions" className="text-blue-600 hover:underline ml-1">
                  建物一覧から追加
                </Link>
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {watchedMansions.map((mansion) => (
              <Card key={mansion.id} className="transition-shadow hover:shadow-md">
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Link href={`/mansions/${mansion.id}`} className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900">{mansion.name}</h3>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {mansion.nearest_station} 徒歩{mansion.walking_minutes}分 / {mansion.address}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        {mansion.active_listings_count > 0 && (
                          <StatusTag status="active" />
                        )}
                        <span className="text-xs text-gray-400">
                          募集中: {mansion.active_listings_count}件 / 確認タイプ: {mansion.known_unit_types_count}件
                        </span>
                      </div>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleWatch(mansion.id)}
                      className="ml-4 flex-shrink-0"
                    >
                      監視解除
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 未監視の建物（追加候補） */}
      {unwatchedMansions.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            監視候補（未監視の建物）
          </h2>
          <div className="space-y-3">
            {unwatchedMansions.map((mansion) => (
              <Card key={mansion.id} className="transition-shadow hover:shadow-md">
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Link href={`/mansions/${mansion.id}`} className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900">{mansion.name}</h3>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {mansion.nearest_station} 徒歩{mansion.walking_minutes}分
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        {mansion.active_listings_count > 0 ? (
                          <StatusTag status="active" />
                        ) : mansion.last_listing_date ? (
                          <StatusTag status="past" />
                        ) : (
                          <StatusTag status="unknown" />
                        )}
                      </div>
                    </Link>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => toggleWatch(mansion.id)}
                      className="ml-4 flex-shrink-0"
                    >
                      監視する
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
