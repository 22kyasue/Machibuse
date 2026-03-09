import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// 間取りタイプ詳細取得（+ 募集一覧）
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: unit, error } = await supabase
    .from("units")
    .select(`
      *,
      mansion:mansions (id, name, address, nearest_station)
    `)
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  // 募集一覧も取得
  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("unit_id", id)
    .order("detected_at", { ascending: false });

  return NextResponse.json({ unit, listings: listings || [] });
}

// 間取りタイプ更新
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const body = await request.json();
  const { data, error } = await supabase
    .from("units")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
