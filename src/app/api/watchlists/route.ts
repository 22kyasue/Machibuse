import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

// 監視リスト取得
export async function GET() {
  const supabase = await createServerSupabaseClient();

  let userId: string | null = null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id || null;
  } catch {
    // 未認証
  }

  if (!userId) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabase
    .from("user_watchlists")
    .select("*, mansions(*), units(*)")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// 監視追加
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();

  let user: { id: string } | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // 未認証
  }

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const body = await request.json();
  const { data, error } = await supabase
    .from("user_watchlists")
    .insert({
      user_id: user.id,
      target_mansion_id: body.target_mansion_id || null,
      target_unit_id: body.target_unit_id || null,
      conditions: body.conditions || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// 監視解除
export async function DELETE(request: NextRequest) {
  const supabase = await createServerSupabaseClient();

  let deleteUser: { id: string } | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    deleteUser = data.user;
  } catch {
    // 未認証
  }

  if (!deleteUser) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const body = await request.json();

  const { error } = await supabase
    .from("user_watchlists")
    .update({ is_active: false })
    .eq("user_id", deleteUser.id)
    .eq("id", body.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
