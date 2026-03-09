import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

// 間取りタイプ一覧（mansion_id でフィルタ）
export async function GET(request: NextRequest) {
  const mansionId = request.nextUrl.searchParams.get("mansion_id");
  const supabase = await createServerSupabaseClient();

  let query = supabase.from("units").select("*").order("size_sqm", { ascending: false });
  if (mansionId) query = query.eq("mansion_id", mansionId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// 間取りタイプ登録
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const body = await request.json();
  const { data, error } = await supabase
    .from("units")
    .insert({
      mansion_id: body.mansion_id,
      room_number: body.room_number || null,
      floor_range: body.floor_range || null,
      size_sqm: body.size_sqm,
      layout_type: body.layout_type,
      direction: body.direction || null,
      balcony: body.balcony || null,
      floorplan_url: body.floorplan_url || null,
      last_rent: body.last_rent || null,
      memo: body.memo || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
