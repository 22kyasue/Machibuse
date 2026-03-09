"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockNotifications } from "@/lib/mock-data";
import type { Notification } from "@/types";

const typeLabels: Record<string, { label: string; color: string }> = {
  new_listing: { label: "新着", color: "bg-green-100 text-green-800" },
  price_change: { label: "値下げ", color: "bg-blue-100 text-blue-800" },
  ended: { label: "終了", color: "bg-red-100 text-red-800" },
  relisted: { label: "再掲載", color: "bg-purple-100 text-purple-800" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filtered =
    filter === "unread"
      ? notifications.filter((n) => !n.is_read)
      : notifications;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">通知一覧</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500">未読: {unreadCount}件</p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={markAllRead}>
          すべて既読にする
        </Button>
      </div>

      <div className="flex gap-2 text-sm">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1 ${filter === "all" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          すべて
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`rounded-full px-3 py-1 ${filter === "unread" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          未読のみ
        </button>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent>
              <p className="text-center text-sm text-gray-500">
                {filter === "unread"
                  ? "未読の通知はありません"
                  : "通知はまだありません"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((notification) => {
            const typeConfig = typeLabels[notification.type];
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
                  className={`transition-shadow hover:shadow-md ${!notification.is_read ? "border-l-4 border-l-blue-500" : ""}`}
                >
                  <CardContent>
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${typeConfig.color}`}
                          >
                            {typeConfig.label}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {notification.title}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {new Date(notification.created_at).toLocaleString("ja-JP")}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <span className="ml-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                      )}
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
