import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// 建物詳細取得（+ 間取りタイプ一覧）
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  // ユーザー情報取得（監視リスト照合用）
  let userId: string | null = null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id || null;
  } catch {
    // 未認証
  }

  const { data: mansion, error } = await supabase
    .from("mansions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  // 間取りタイプも取得
  const { data: units } = await supabase
    .from("units")
    .select(`
      *,
      listings (id, status, current_rent, detected_at)
    `)
    .eq("mansion_id", id)
    .order("size_sqm", { ascending: true });

  // 監視リスト取得
  let watchedUnitIds: Set<string> = new Set();
  if (userId) {
    const { data: watchlist } = await supabase
      .from("user_watchlists")
      .select("target_unit_id")
      .eq("user_id", userId)
      .eq("is_active", true);
    if (watchlist) {
      watchedUnitIds = new Set(
        watchlist.map((w: { target_unit_id: string | null }) => w.target_unit_id).filter(Boolean) as string[]
      );
    }
  }

  const unitsWithStats = (units || []).map((unit: Record<string, unknown>) => {
    const listings = (unit.listings as Array<{ id: string; status: string; current_rent: number; detected_at: string }>) || [];
    const activeListings = listings.filter((l) => l.status === "active");
    const sortedListings = [...listings].sort(
      (a, b) => new Date(b.detected_at).getTime() - new Date(a.detected_at).getTime()
    );

    return {
      ...unit,
      listings: undefined,
      active_listings_count: activeListings.length,
      last_listing_date: sortedListings[0]?.detected_at || null,
      last_rent_amount: sortedListings[0]?.current_rent || null,
      is_watched: watchedUnitIds.has(unit.id as string),
      status: activeListings.length > 0 ? "active" : listings.length > 0 ? "past" : "unknown",
    };
  });

  return NextResponse.json({ mansion, units: unitsWithStats });
}

// 建物更新
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const body = await request.json();
  const { data, error } = await supabase
    .from("mansions")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// 建物削除
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { error } = await supabase
    .from("mansions")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
