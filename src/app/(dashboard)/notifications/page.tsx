"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ListSkeleton } from "@/components/ui/skeleton";
import { useRealtimeNotifications } from "@/hooks/use-realtime-notifications";
import type { Notification } from "@/types";

const typeLabels: Record<string, { label: string; color: string }> = {
  new_listing: { label: "新着", color: "bg-emerald-50 text-emerald-700" },
  price_change: { label: "値下げ", color: "bg-blue-50 text-blue-700" },
  ended: { label: "終了", color: "bg-red-50 text-red-700" },
  relisted: { label: "再掲載", color: "bg-violet-50 text-violet-700" },
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [initialLoading, setInitialLoading] = useState(true);

  const {
    notifications,
    setNotifications,
    refetch: fetchNotifications,
  } = useRealtimeNotifications({
    onNewNotification: () => {
      // 新着通知が来た時の追加処理（必要に応じて拡張可能）
    },
  });

  // 初回ロード状態の管理
  useEffect(() => {
    if (notifications.length > 0 || !initialLoading) {
      setInitialLoading(false);
      return;
    }
    // 初回取得完了を検知するため少し待つ
    const timer = setTimeout(() => setInitialLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [notifications, initialLoading]);

  const filtered =
    filter === "unread"
      ? notifications.filter((n) => !n.is_read)
      : notifications;

  const markAllRead = async () => {
    const ids = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (ids.length === 0) return;

    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (initialLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />
        <ListSkeleton count={5} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">通知一覧</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-slate-500">未読: {unreadCount}件</p>
          )}
        </div>
        <button
          onClick={markAllRead}
          className="rounded-lg border border-slate-200/60 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
        >
          すべて既読にする
        </button>
      </div>

      <div className="flex gap-2 text-sm">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1 ${filter === "all" ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
        >
          すべて
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`rounded-full px-3 py-1 ${filter === "unread" ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
        >
          未読のみ
        </button>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent>
              <p className="text-center text-sm text-slate-500">
                {filter === "unread"
                  ? "未読の通知はありません"
                  : "通知はまだありません"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((notification, index) => {
            const typeConfig = typeLabels[notification.type] || { label: notification.type, color: "bg-slate-100 text-slate-800" };
            return (
              <Link
                key={notification.id}
                href={
                  notification.listing_id
                    ? `/listings/${notification.listing_id}`
                    : "#"
                }
              >
                <Card
                  className={`transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 ${!notification.is_read ? "bg-blue-50/30" : ""}`}
                  style={{ animationDelay: `${index * 60}ms`, animationFillMode: "both" }}
                >
                  <CardContent>
                    <div className="flex items-start justify-between">
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        {!notification.is_read && (
                          <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${typeConfig.color}`}>
                              {typeConfig.label}
                            </span>
                            <span className="text-sm font-semibold text-slate-900">
                              {notification.title}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {new Date(notification.created_at).toLocaleString("ja-JP")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
