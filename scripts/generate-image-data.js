#!/usr/bin/env node
/**
 * SUUMOから各建物の画像をスクレイピングして静的データファイルとして出力
 * Usage: node scripts/generate-image-data.js
 */
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const API_BASE = "http://localhost:3000";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "ja,en;q=0.9",
      Referer: "https://suumo.jp/",
    },
  });
  if (!res.ok) {
    console.log(`  HTTP ${res.status} for ${url}`);
    return null;
  }
  return await res.text();
}

function extractImages(html, baseUrl) {
  const $ = cheerio.load(html);
  const images = [];
  const seen = new Set();

  $("img").each((_i, el) => {
    const src = $(el).attr("data-src") || $(el).attr("src") || "";
    const alt = $(el).attr("alt") || "";

    if (!src) return;
    if (!/\.(jpg|jpeg|png|webp)/i.test(src)) return;
    if (/spacer|noimage|icon|logo|btn|nowprinting|arrow|close/i.test(src)) return;
    if (src.length < 30) return;

    // サムネイル除外（SUUMOの_*t.jpgパターン）
    if (/_[a-z0-9]*t\.jpg$/i.test(src)) return;
    // 小さいサイズの画像を除外
    if (/_s[0-9]o\.jpg$/i.test(src)) return;

    const fullUrl = src.startsWith("http")
      ? src
      : src.startsWith("//")
        ? `https:${src}`
        : new URL(src, baseUrl).toString();

    if (seen.has(fullUrl)) return;
    seen.add(fullUrl);

    const width = parseInt($(el).attr("width") || "0");
    const height = parseInt($(el).attr("height") || "0");
    if ((width > 0 && width < 100) || (height > 0 && height < 100)) return;

    let type = "other";
    let caption = alt;
    const check = (alt + " " + src).toLowerCase();
    if (/外観|outward|building|_go\./.test(check)) {
      type = "exterior";
      caption = caption || "外観";
    } else if (/エントランス|entrance/.test(check)) {
      type = "entrance";
      caption = caption || "エントランス";
    } else if (/間取り|madori|floorplan|_co\./.test(check)) {
      type = "floorplan";
      caption = caption || "間取り";
    } else if (/居室|リビング|living|interior|_ro\./.test(check)) {
      type = "interior";
      caption = caption || "室内";
    } else if (/キッチン|kitchen|_1o\./.test(check)) {
      type = "kitchen";
      caption = caption || "キッチン";
    } else if (/バス|浴室|bath|シャワー|_2o\./.test(check)) {
      type = "bathroom";
      caption = caption || "バスルーム";
    } else if (/眺望|view|バルコニー/.test(check)) {
      type = "view";
      caption = caption || "眺望";
    } else if (/トイレ|toilet/.test(check)) {
      type = "other";
      caption = caption || "トイレ";
    } else if (/収納|closet/.test(check)) {
      type = "other";
      caption = caption || "収納";
    }

    images.push({ url: fullUrl, type, caption: caption || "写真" });
  });

  // 優先度でソート
  const priority = {
    exterior: 0,
    entrance: 1,
    view: 2,
    interior: 3,
    kitchen: 4,
    bathroom: 5,
    floorplan: 6,
    other: 7,
  };
  images.sort((a, b) => (priority[a.type] ?? 7) - (priority[b.type] ?? 7));

  // 外観・エントランス・室内・キッチン・バスルーム・眺望の主要画像のみ（最大8枚）
  return images.filter(img => img.type !== "other" || images.filter(i => i.type !== "other").length < 5).slice(0, 8);
}

async function searchSuumo(mansionName) {
  const query = encodeURIComponent(mansionName);
  const searchUrl = `https://suumo.jp/jj/chintai/ichiran/FR301FC001/?fw=${query}&ar=030&bs=040&ta=13`;
  console.log(`  検索中...`);

  const html = await fetchHtml(searchUrl);
  if (!html) return [];

  const $ = cheerio.load(html);
  let detailLink = $("a[href*='/chintai/jnc_']").first().attr("href");

  if (!detailLink) {
    // 東京都以外も検索
    const searchUrl2 = `https://suumo.jp/jj/chintai/ichiran/FR301FC001/?fw=${query}&ar=030&bs=040`;
    console.log(`  全エリアで再検索...`);
    const html2 = await fetchHtml(searchUrl2);
    if (!html2) return [];
    const $2 = cheerio.load(html2);
    detailLink = $2("a[href*='/chintai/jnc_']").first().attr("href");
    if (!detailLink) {
      console.log(`  検索結果なし`);
      return [];
    }
  }

  const detailUrl = detailLink.startsWith("http")
    ? detailLink
    : `https://suumo.jp${detailLink}`;
  console.log(`  詳細ページ取得中...`);

  await sleep(1500);
  const detailHtml = await fetchHtml(detailUrl);
  if (!detailHtml) return [];

  return extractImages(detailHtml, detailUrl);
}

async function main() {
  const res = await fetch(`${API_BASE}/api/mansions`);
  const data = await res.json();
  const mansions = data.data || data;

  console.log(`\n=== ${mansions.length}件の建物の画像をスクレイピング ===\n`);

  const imageData = {};
  let success = 0;

  for (let i = 0; i < mansions.length; i++) {
    const m = mansions[i];
    console.log(`[${i + 1}/${mansions.length}] ${m.name}`);

    try {
      const images = await searchSuumo(m.name);
      if (images.length > 0) {
        imageData[m.id] = images;
        console.log(`  ✓ ${images.length}枚取得`);
        success++;
      } else {
        console.log(`  ✗ 画像なし`);
      }
    } catch (e) {
      console.log(`  ✗ エラー: ${e.message}`);
    }

    // レート制限対策
    if (i < mansions.length - 1) await sleep(2500);
  }

  // TypeScriptファイルとして出力
  const outputPath = path.join(__dirname, "..", "src", "data", "mansion-images.ts");
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const tsContent = `// 自動生成: SUUMOからスクレイピングした建物画像データ
// 生成日: ${new Date().toISOString().split("T")[0]}

export interface MansionImageData {
  url: string;
  type: string;
  caption: string;
}

export const MANSION_IMAGES: Record<string, MansionImageData[]> = ${JSON.stringify(imageData, null, 2)};

export function getMansionImages(mansionId: string): MansionImageData[] {
  return MANSION_IMAGES[mansionId] || [];
}
`;

  fs.writeFileSync(outputPath, tsContent, "utf-8");
  console.log(`\n=== 完了 ===`);
  console.log(`成功: ${success}/${mansions.length}件`);
  console.log(`出力: ${outputPath}`);

  // SQLファイルも生成（後でSupabaseに投入用）
  const sqlPath = path.join(__dirname, "..", "supabase", "insert_images.sql");
  let sql = "-- 自動生成: SUUMOからスクレイピングした建物画像データ\n";
  sql += "-- RLSポリシー更新\n";
  sql += "DROP POLICY IF EXISTS \"認証済みユーザーは画像を追加可能\" ON property_images;\n";
  sql += "CREATE POLICY \"画像の追加は全員可能\" ON property_images FOR INSERT WITH CHECK (true);\n";
  sql += "CREATE POLICY \"画像の削除は全員可能\" ON property_images FOR DELETE USING (true);\n\n";
  sql += "-- 既存画像を削除\n";
  sql += "DELETE FROM property_images;\n\n";
  sql += "-- 画像データ挿入\n";

  for (const [mansionId, images] of Object.entries(imageData)) {
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const escapedUrl = img.url.replace(/'/g, "''");
      const escapedCaption = img.caption.replace(/'/g, "''");
      sql += `INSERT INTO property_images (mansion_id, image_url, image_type, caption, sort_order) VALUES ('${mansionId}', '${escapedUrl}', '${img.type}', '${escapedCaption}', ${i});\n`;
    }
  }

  // exterior_image_urlも更新
  sql += "\n-- exterior_image_url更新\n";
  for (const [mansionId, images] of Object.entries(imageData)) {
    const exterior = images.find(img => img.type === "exterior");
    if (exterior) {
      const escapedUrl = exterior.url.replace(/'/g, "''");
      sql += `UPDATE mansions SET exterior_image_url = '${escapedUrl}' WHERE id = '${mansionId}';\n`;
    }
  }

  fs.writeFileSync(sqlPath, sql, "utf-8");
  console.log(`SQL: ${sqlPath}`);
}

main().catch(console.error);
