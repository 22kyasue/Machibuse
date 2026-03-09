import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

// 募集一覧（unit_id でフィルタ）
export async function GET(request: NextRequest) {
  const unitId = request.nextUrl.searchParams.get("unit_id");
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("listings")
    .select("*")
    .order("detected_at", { ascending: false });
  if (unitId) query = query.eq("unit_id", unitId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// 募集登録
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();

  const body = await request.json();
  const { data, error } = await supabase
    .from("listings")
    .insert({
      unit_id: body.unit_id,
      status: body.status || "active",
      current_rent: body.current_rent,
      management_fee: body.management_fee || null,
      floor: body.floor || null,
      source_site: body.source_site || null,
      source_url: body.source_url || null,
      detected_at: body.detected_at || new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
