import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// 募集詳細取得
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: listing, error } = await supabase
    .from("listings")
    .select(`
      *,
      unit:units (
        *,
        mansion:mansions (id, name, address, nearest_station)
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(listing);
}

// 募集情報更新
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const body = await request.json();
  const { data, error } = await supabase
    .from("listings")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
