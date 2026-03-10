"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { StatusTag } from "@/components/ui/status-tag";
import { ListSkeleton } from "@/components/ui/skeleton";
import type { MansionWithStats } from "@/types";
import {
  getWatchedMansionIds,
  addToWatchlist,
  removeFromWatchlist,
} from "@/lib/watchlist";
import { getMemo, saveMemo } from "@/lib/memo";

export default function WatchlistPage() {
  const [mansions, setMansions] = useState<MansionWithStats[]>([]);
  const [watchedIds, setWatchedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMemo, setEditingMemo] = useState<string | null>(null);
  const [memoText, setMemoText] = useState("");
  const [memos, setMemos] = useState<Record<string, string>>({});

  useEffect(() => {
    setWatchedIds(getWatchedMansionIds());

    fetch("/api/mansions")
      .then((res) => {
        if (!res.ok) throw new Error("データの取得に失敗しました");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setMansions(data);
          // メモ読み込み
          const memoMap: Record<string, string> = {};
          for (const m of data) {
            const memo = getMemo(m.id);
            if (memo) memoMap[m.id] = memo;
          }
          setMemos(memoMap);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const watchedMansions = useMemo(
    () => mansions.filter((m) => watchedIds.includes(m.id)),
    [mansions, watchedIds]
  );

  const handleUnwatch = (mansionId: string) => {
    removeFromWatchlist(mansionId);
    setWatchedIds((prev) => prev.filter((id) => id !== mansionId));
  };

  const handleWatch = (mansionId: string) => {
    addToWatchlist(mansionId);
    setWatchedIds((prev) => [...prev, mansionId]);
  };

  const handleSaveMemo = (mansionId: string) => {
    saveMemo(mansionId, memoText);
    setMemos((prev) => {
      const next = { ...prev };
      if (memoText.trim()) {
        next[mansionId] = memoText.trim();
      } else {
        delete next[mansionId];
      }
      return next;
    });
    setEditingMemo(null);
    setMemoText("");
  };

  const unwatchedMansions = useMemo(
    () => mansions.filter((m) => !watchedIds.includes(m.id)),
    [mansions, watchedIds]
  );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          再試行
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
        <ListSkeleton count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ウォッチリスト</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {watchedMansions.length}件の建物を監視中
          </p>
        </div>
        <Link
          href="/mansions"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          物件一覧から追加
        </Link>
      </div>

      {/* 監視中 */}
      {watchedMansions.length === 0 ? (
        <Card>
          <CardContent>
            <div className="py-8 text-center">
              <p className="text-lg font-medium text-gray-500">
                監視中の建物はまだありません
              </p>
              <p className="mt-2 text-sm text-gray-400">
                物件一覧から気になる建物をウォッチリストに追加しましょう
              </p>
              <Link
                href="/mansions"
                className="mt-4 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                建物一覧を見る
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {watchedMansions.map((mansion) => (
            <Card key={mansion.id} className="transition-shadow hover:shadow-md">
              <CardContent>
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/mansions/${mansion.id}`}
                    className="min-w-0 flex-1"
                  >
                    <h3 className="font-semibold text-gray-900">
                      {mansion.name}
                    </h3>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {mansion.nearest_station} 徒歩{mansion.walking_minutes}分
                      / {mansion.address}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      {mansion.active_listings_count > 0 ? (
                        <StatusTag status="active" />
                      ) : mansion.last_listing_date ? (
                        <StatusTag status="past" />
                      ) : (
                        <StatusTag status="unknown" />
                      )}
                      <span className="text-xs text-gray-400">
                        募集中: {mansion.active_listings_count}件
                      </span>
                    </div>
                  </Link>
                  <div className="flex flex-shrink-0 gap-2">
                    <button
                      onClick={() => {
                        setEditingMemo(
                          editingMemo === mansion.id ? null : mansion.id
                        );
                        setMemoText(memos[mansion.id] || "");
                      }}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                      title="メモ"
                    >
                      {memos[mansion.id] ? "メモ編集" : "メモ追加"}
                    </button>
                    <button
                      onClick={() => handleUnwatch(mansion.id)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      解除
                    </button>
                  </div>
                </div>

                {/* メモ表示 */}
                {memos[mansion.id] && editingMemo !== mansion.id && (
                  <div className="mt-3 rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-800 border border-yellow-100">
                    {memos[mansion.id]}
                  </div>
                )}

                {/* メモ編集 */}
                {editingMemo === mansion.id && (
                  <div className="mt-3 space-y-2">
                    <textarea
                      value={memoText}
                      onChange={(e) => setMemoText(e.target.value)}
                      placeholder="この物件についてのメモ..."
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveMemo(mansion.id)}
                        className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => {
                          setEditingMemo(null);
                          setMemoText("");
                        }}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 未監視の建物 */}
      {unwatchedMansions.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            その他の建物
          </h2>
          <div className="space-y-3">
            {unwatchedMansions.slice(0, 10).map((mansion) => (
              <Card
                key={mansion.id}
                className="transition-shadow hover:shadow-md"
              >
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/mansions/${mansion.id}`}
                      className="min-w-0 flex-1"
                    >
                      <h3 className="font-semibold text-gray-900">
                        {mansion.name}
                      </h3>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {mansion.nearest_station} 徒歩
                        {mansion.walking_minutes}分
                      </p>
                    </Link>
                    <button
                      onClick={() => handleWatch(mansion.id)}
                      className="ml-4 flex-shrink-0 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                    >
                      監視する
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {unwatchedMansions.length > 10 && (
              <p className="text-center text-sm text-gray-400">
                他 {unwatchedMansions.length - 10} 件 →{" "}
                <Link href="/mansions" className="text-blue-600 hover:underline">
                  建物一覧で確認
                </Link>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
