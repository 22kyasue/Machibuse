import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// 通知一覧取得
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

  const { data: notifications, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(notifications);
}

// 通知既読更新
export async function PATCH(request: Request) {
  const supabase = await createServerSupabaseClient();

  let userId: string | null = null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id || null;
  } catch {
    // 未認証
  }

  if (!userId) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const body = await request.json();
  const { ids } = body as { ids: string[] };

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .in("id", ids)
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
