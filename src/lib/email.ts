import { Resend } from "resend";

let resend: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

/**
 * 通知メールを送信する。
 * RESEND_API_KEY が未設定の場合はログ出力のみでエラーにしない（グレースフルデグレード）。
 */
export async function sendNotificationEmail(
  to: string,
  subject: string,
  body: string
): Promise<{ success: boolean; error?: string }> {
  const client = getResendClient();

  if (!client) {
    console.log(
      `[email] RESEND_API_KEY未設定のためメール送信をスキップ: to=${to}, subject=${subject}`
    );
    return { success: true };
  }

  try {
    const { error } = await client.emails.send({
      from: "Machibuse <noreply@machibuse.app>",
      to,
      subject,
      html: body,
    });

    if (error) {
      console.error("[email] Resend送信エラー:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "不明なエラー";
    console.error("[email] メール送信例外:", message);
    return { success: false, error: message };
  }
}
