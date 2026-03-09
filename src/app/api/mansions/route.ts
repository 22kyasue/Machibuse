import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// 建物一覧取得
export async function GET() {
  const supabase = await createServerSupabaseClient();

  // ユーザー情報取得（監視リスト照合用）
  let userId: string | null = null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id || null;
  } catch {
    // 未認証
  }

  const { data: mansions, error } = await supabase
    .from("mansions")
    .select(`
      *,
      units (
        id,
        listings (id, status, detected_at)
      )
    `)
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 監視リスト取得
  let watchedMansionIds: Set<string> = new Set();
  if (userId) {
    const { data: watchlist } = await supabase
      .from("user_watchlists")
      .select("target_mansion_id")
      .eq("user_id", userId)
      .eq("is_active", true);
    if (watchlist) {
      watchedMansionIds = new Set(
        watchlist.map((w: { target_mansion_id: string | null }) => w.target_mansion_id).filter(Boolean) as string[]
      );
    }
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // MansionWithStats 形式に変換
  const mansionsWithStats = mansions.map((mansion: Record<string, unknown>) => {
    const units = (mansion.units as Array<{ id: string; listings: Array<{ id: string; status: string; detected_at: string }> }>) || [];
    const allListings = units.flatMap((u) => u.listings || []);
    const activeListings = allListings.filter((l) => l.status === "active");
    const recentListings = allListings.filter((l) => new Date(l.detected_at) >= thirtyDaysAgo);

    // 最新の掲載日
    let lastListingDate: string | null = null;
    for (const l of allListings) {
      if (!lastListingDate || l.detected_at > lastListingDate) {
        lastListingDate = l.detected_at;
      }
    }

    return {
      ...mansion,
      units: undefined,
      active_listings_count: activeListings.length,
      known_unit_types_count: units.length,
      recent_listings_count: recentListings.length,
      last_listing_date: lastListingDate
        ? new Date(lastListingDate).toISOString().split("T")[0]
        : null,
      is_watched: watchedMansionIds.has(mansion.id as string),
      status: activeListings.length > 0 ? "active" : allListings.length > 0 ? "past" : "unknown",
    };
  });

  return NextResponse.json(mansionsWithStats);
}

// 建物新規登録
export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const body = await request.json();
  const { data, error } = await supabase
    .from("mansions")
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
