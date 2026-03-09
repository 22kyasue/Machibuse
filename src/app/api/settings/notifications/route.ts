import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

const DEFAULTS = {
  email_enabled: false,
  email_address: "",
  notify_new_listing: true,
  notify_price_change: true,
  notify_ended: false,
  notify_relisted: true,
};

export async function GET() {
  const supabase = await createServerSupabaseClient();

  let user: { id: string } | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // 未認証
  }

  if (!user) {
    return NextResponse.json({ ...DEFAULTS });
  }

  const { data, error } = await supabase
    .from("notification_settings")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    // テーブル未作成の場合はデフォルト値を返す
    if (error.message.includes("does not exist") || error.message.includes("schema cache")) {
      return NextResponse.json({ ...DEFAULTS });
    }
    return NextResponse.json(
      { error: "設定の取得に失敗しました" },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json({ ...DEFAULTS });
  }

  return NextResponse.json({
    email_enabled: data.email_enabled,
    email_address: data.email_address ?? "",
    notify_new_listing: data.notify_new_listing,
    notify_price_change: data.notify_price_change,
    notify_ended: data.notify_ended,
    notify_relisted: data.notify_relisted,
  });
}

export async function PUT(request: Request) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const body = await request.json();

  const settings = {
    user_id: user.id,
    email_enabled: Boolean(body.email_enabled),
    email_address: body.email_address ?? null,
    notify_new_listing: Boolean(body.notify_new_listing),
    notify_price_change: Boolean(body.notify_price_change),
    notify_ended: Boolean(body.notify_ended),
    notify_relisted: Boolean(body.notify_relisted),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("notification_settings")
    .upsert(settings, { onConflict: "user_id" })
    .select()
    .single();

  if (error) {
    // テーブル未作成の場合
    if (error.message.includes("does not exist") || error.message.includes("schema cache")) {
      return NextResponse.json(
        { error: "通知設定テーブルが未作成です。003_notification_settings.sqlを実行してください。" },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "設定の保存に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    email_enabled: data.email_enabled,
    email_address: data.email_address ?? "",
    notify_new_listing: data.notify_new_listing,
    notify_price_change: data.notify_price_change,
    notify_ended: data.notify_ended,
    notify_relisted: data.notify_relisted,
  });
}
