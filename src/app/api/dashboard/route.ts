import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// ダッシュボード集約データ
export async function GET() {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 並行で全データ取得
  const [
    mansionsResult,
    activeListingsResult,
    notificationsResult,
    watchlistResult,
  ] = await Promise.all([
    supabase.from("mansions").select("id", { count: "exact" }),
    supabase.from("listings").select("id", { count: "exact" }).eq("status", "active"),
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_read", false)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("user_watchlists")
      .select("id", { count: "exact" })
      .eq("user_id", user.id)
      .eq("is_active", true),
  ]);

  return NextResponse.json({
    total_mansions: mansionsResult.count || 0,
    active_listings: activeListingsResult.count || 0,
    unread_notifications: notificationsResult.data?.length || 0,
    recent_notifications: notificationsResult.data || [],
    active_watches: watchlistResult.count || 0,
  });
}
