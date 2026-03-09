/**
 * 通知タイプ別メールテンプレート
 */

const TYPE_LABELS: Record<string, string> = {
  new_listing: "新着物件",
  price_change: "価格変更",
  ended: "募集終了",
  relisted: "再掲載",
};

/**
 * 通知タイプに応じたメール件名を生成
 */
export function getEmailSubject(type: string, title: string): string {
  const label = TYPE_LABELS[type] ?? "通知";
  return `【Machibuse】${label}: ${title}`;
}

/**
 * 通知タイプに応じたHTMLメール本文を生成
 */
export function getEmailBody(
  type: string,
  title: string,
  message: string,
  listingUrl?: string
): string {
  const label = TYPE_LABELS[type] ?? "通知";
  const accentColor = getAccentColor(type);

  const ctaButton = listingUrl
    ? `
      <tr>
        <td style="padding: 24px 0 0 0;">
          <a href="${escapeHtml(listingUrl)}"
             style="display: inline-block; padding: 12px 24px; background-color: ${accentColor}; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
            物件を確認する
          </a>
        </td>
      </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <!-- ヘッダー -->
          <tr>
            <td style="background-color: ${accentColor}; padding: 20px 24px;">
              <span style="color: #ffffff; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">${escapeHtml(label)}</span>
            </td>
          </tr>
          <!-- 本文 -->
          <tr>
            <td style="padding: 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size: 18px; font-weight: bold; color: #18181b; padding-bottom: 12px;">
                    ${escapeHtml(title)}
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 14px; color: #3f3f46; line-height: 1.6;">
                    ${escapeHtml(message)}
                  </td>
                </tr>
                ${ctaButton}
              </table>
            </td>
          </tr>
          <!-- フッター -->
          <tr>
            <td style="padding: 16px 24px; border-top: 1px solid #e4e4e7; font-size: 12px; color: #a1a1aa;">
              このメールは Machibuse の通知設定に基づいて送信されています。<br>
              通知設定はアプリ内の設定ページから変更できます。
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function getAccentColor(type: string): string {
  switch (type) {
    case "new_listing":
      return "#2563eb"; // blue
    case "price_change":
      return "#d97706"; // amber
    case "ended":
      return "#6b7280"; // gray
    case "relisted":
      return "#059669"; // emerald
    default:
      return "#2563eb";
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
