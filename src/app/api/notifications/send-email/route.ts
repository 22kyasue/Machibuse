import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { sendNotificationEmail } from "@/lib/email";
import { getEmailSubject, getEmailBody } from "@/lib/email-templates";

const NOTIFICATION_TYPE_SETTING_MAP: Record<string, string> = {
  new_listing: "notify_new_listing",
  price_change: "notify_price_change",
  ended: "notify_ended",
  relisted: "notify_relisted",
};

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  // 認証チェック
  let userId: string | null = null;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    // 未認証
  }

  if (!userId) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  // リクエストボディ取得
  let body: { notification_id: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "不正なリクエストです" },
      { status: 400 }
    );
  }

  const { notification_id } = body;
  if (!notification_id) {
    return NextResponse.json(
      { error: "notification_id は必須です" },
      { status: 400 }
    );
  }

  // 通知レコード取得
  const { data: notification, error: notifError } = await supabase
    .from("notifications")
    .select("*")
    .eq("id", notification_id)
    .eq("user_id", userId)
    .single();

  if (notifError || !notification) {
    return NextResponse.json(
      { error: "通知が見つかりません" },
      { status: 404 }
    );
  }

  // 通知設定取得（テーブル未作成でもエラーにしない）
  let emailEnabled = false;
  let emailAddress: string | null = null;
  let typeEnabled = true;

  try {
    const { data: settings, error: settingsError } = await supabase
      .from("notification_settings")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (
      settingsError &&
      !settingsError.message.includes("does not exist") &&
      !settingsError.message.includes("schema cache")
    ) {
      console.error("[send-email] 通知設定取得エラー:", settingsError.message);
    }

    if (settings) {
      emailEnabled = settings.email_enabled ?? false;
      emailAddress = settings.email_address ?? null;

      // 通知タイプ別の有効/無効判定
      const settingKey = NOTIFICATION_TYPE_SETTING_MAP[notification.type];
      if (settingKey && settingKey in settings) {
        typeEnabled = Boolean(
          settings[settingKey as keyof typeof settings]
        );
      }
    }
  } catch {
    // テーブル未作成などの場合はデフォルト値を使用
    console.log(
      "[send-email] 通知設定テーブルが利用できません。デフォルト設定を使用します。"
    );
  }

  // メール送信条件チェック
  if (!emailEnabled) {
    return NextResponse.json({
      sent: false,
      reason: "メール通知が無効です",
    });
  }

  if (!emailAddress) {
    return NextResponse.json({
      sent: false,
      reason: "メールアドレスが設定されていません",
    });
  }

  if (!typeEnabled) {
    return NextResponse.json({
      sent: false,
      reason: `通知タイプ「${notification.type}」のメール送信が無効です`,
    });
  }

  // メール送信
  const subject = getEmailSubject(notification.type, notification.title);

  // listing_id がある場合はURLを生成
  let listingUrl: string | undefined;
  if (notification.listing_id) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://machibuse.app";
    listingUrl = `${baseUrl}/listings/${notification.listing_id}`;
  }

  const htmlBody = getEmailBody(
    notification.type,
    notification.title,
    notification.message,
    listingUrl
  );

  const result = await sendNotificationEmail(emailAddress, subject, htmlBody);

  if (!result.success) {
    return NextResponse.json(
      { error: `メール送信に失敗しました: ${result.error}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ sent: true });
}
