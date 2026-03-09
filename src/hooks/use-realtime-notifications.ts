import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase";
import type { Notification } from "@/types";

/**
 * Supabase Realtimeを使った通知のリアルタイム監視フック
 * - 未読カウントをリアルタイム更新
 * - 新着通知のコールバック対応
 * - Supabase未設定時は30秒ポーリングにフォールバック
 */
export function useRealtimeNotifications(options?: {
  /** 新しい通知が届いた時のコールバック */
  onNewNotification?: () => void;
}) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const onNewNotificationRef = useRef(options?.onNewNotification);

  // コールバックの最新値を保持
  useEffect(() => {
    onNewNotificationRef.current = options?.onNewNotification;
  }, [options?.onNewNotification]);

  const fetchNotifications = useCallback(() => {
    return fetch("/api/notifications")
      .then((res) => {
        if (!res.ok) throw new Error("データの取得に失敗しました");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setNotifications(data);
          setUnreadCount(
            data.filter((n: { is_read: boolean }) => !n.is_read).length
          );
        }
        return data;
      })
      .catch(() => {
        // エラー時は状態を維持
      });
  }, []);

  useEffect(() => {
    // 初回取得
    fetchNotifications();

    try {
      const supabase = createClient();

      const channel = supabase
        .channel("notifications-realtime")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "notifications" },
          () => {
            // 新しい通知が来たら未読カウントを+1し、通知リストも再取得
            setUnreadCount((prev) => prev + 1);
            fetchNotifications();
            onNewNotificationRef.current?.();
          }
        )
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "notifications" },
          () => {
            // 既読更新などの変更時はカウントとリストを再取得
            fetchNotifications();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // Supabase未設定時はポーリングにフォールバック（30秒間隔）
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [fetchNotifications]);

  return {
    /** 未読通知の件数 */
    unreadCount,
    /** 通知一覧 */
    notifications,
    /** 通知を手動で再取得 */
    refetch: fetchNotifications,
    /** 通知一覧を直接更新（楽観的更新用） */
    setNotifications,
  };
}
