import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// ダッシュボード集約データ
export async function GET() {
  const supabase = await createServerSupabaseClient();

  let userId: string | null = null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id || null;
  } catch {
    // 未認証
  }

  // 建物数
  const { count: totalMansions } = await supabase
    .from("mansions")
    .select("id", { count: "exact" });

  // アクティブ募集数
  const { count: activeListings } = await supabase
    .from("listings")
    .select("id", { count: "exact" })
    .eq("status", "active");

  // 未読通知 & ウォッチ数（ログイン時のみ）
  let recentNotifications: unknown[] = [];
  let unreadCount = 0;
  let activeWatches = 0;

  if (userId) {
    const { data: notifs } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .eq("is_read", false)
      .order("created_at", { ascending: false })
      .limit(5);

    recentNotifications = notifs || [];
    unreadCount = recentNotifications.length;

    const { count: watchCount } = await supabase
      .from("user_watchlists")
      .select("id", { count: "exact" })
      .eq("user_id", userId)
      .eq("is_active", true);

    activeWatches = watchCount || 0;
  }

  return NextResponse.json({
    total_mansions: totalMansions || 0,
    active_listings: activeListings || 0,
    unread_notifications: unreadCount,
    recent_notifications: recentNotifications,
    active_watches: activeWatches,
  });
}
