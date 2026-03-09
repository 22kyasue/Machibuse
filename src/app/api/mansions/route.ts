import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// 建物一覧取得
export async function GET() {
  const supabase = await createServerSupabaseClient();

  const { data: mansions, error } = await supabase
    .from("mansions")
    .select(`
      *,
      units (
        id,
        listings (id, status)
      )
    `)
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // MansionWithStats 形式に変換
  const mansionsWithStats = mansions.map((mansion: Record<string, unknown>) => {
    const units = (mansion.units as Array<{ id: string; listings: Array<{ id: string; status: string }> }>) || [];
    const allListings = units.flatMap((u) => u.listings || []);
    const activeListings = allListings.filter((l) => l.status === "active");

    return {
      ...mansion,
      units: undefined,
      active_listings_count: activeListings.length,
      known_unit_types_count: units.length,
      recent_listings_count: activeListings.length,
      last_listing_date: null, // TODO: 最新のdetected_atを取得
      is_watched: false, // TODO: ユーザーの監視リストと照合
      status: activeListings.length > 0 ? "active" : units.length > 0 ? "past" : "unknown",
    };
  });

  return NextResponse.json(mansionsWithStats);
}

// 建物新規登録
export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

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
