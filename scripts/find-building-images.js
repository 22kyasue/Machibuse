#!/usr/bin/env node
/**
 * axel-home.comから各建物の本物の写真を取得するスクリプト
 * 1. 各建物のaxel-homeページを特定
 * 2. ページから画像URLとキャプションを取得
 * 3. 建物名とマッチングして正しい写真を保存
 */
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const API_BASE = "http://localhost:3000";
const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchHtml(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "text/html", "Accept-Language": "ja" },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch { return null; }
}

// axel-home.comのページから建物名と画像URLを抽出
async function getAxelHomeData(url) {
  const html = await fetchHtml(url);
  if (!html) return null;

  const $ = cheerio.load(html);
  // 建物名を取得
  const title = $("h1").first().text().trim() || $("title").text().split("|")[0].trim();

  // 画像を取得
  const images = [];
  const seen = new Set();

  $("img").each((_i, el) => {
    let src = $(el).attr("data-src") || $(el).attr("src") || "";
    const alt = $(el).attr("alt") || "";
    if (!src || !src.includes("bukken_images/picg")) return;

    const fullUrl = src.startsWith("http") ? src : `https://www.axel-home.com${src}`;
    if (seen.has(fullUrl)) return;
    seen.add(fullUrl);

    let type = "other";
    let caption = alt || "写真";

    // picg1=外観、picg2=エントランス が一般的パターン
    if (/picg1\//.test(fullUrl)) { type = "exterior"; caption = "外観"; }
    else if (/picg2\//.test(fullUrl)) { type = "entrance"; caption = "エントランス"; }
    else if (/picg3\//.test(fullUrl)) { type = "interior"; caption = "共用部"; }
    else if (/picg[4-6]\//.test(fullUrl)) { type = "interior"; caption = caption || "共用部"; }

    images.push({ url: fullUrl, type, caption });
  });

  return { title, images };
}

// 建物名のマッチング（部分一致）
function buildingNameMatch(searchName, pageName) {
  if (!pageName) return false;
  // 正規化
  const normalize = (s) => s
    .replace(/[\s　・]+/g, "")
    .replace(/ザ/g, "ザ")
    .replace(/[Ａ-Ｚａ-ｚ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
    .toLowerCase();

  const a = normalize(searchName);
  const b = normalize(pageName);

  // 完全一致 or 部分一致
  if (a === b || b.includes(a) || a.includes(b)) return true;

  // 主要キーワードで一致（3文字以上の共通部分）
  const keywords = a.match(/.{3}/g) || [];
  const matchCount = keywords.filter(k => b.includes(k)).length;
  return matchCount >= 2;
}

async function findBuildingOnAxelHome(mansionName) {
  // axel-home.comの全ページURLからヒットを探す
  // まず建物名でGoogle検索的なアプローチ
  // 直接axel-homeの検索ページを試す
  const encodedName = encodeURIComponent(mansionName);

  // 方法1: axel-homeの建物ページを直接スクレイプして名前を確認
  // 効率化: 候補URLを限定するため、まずaxel-homeのトップから検索

  // 方法2: Google検索でaxel-homeのページを見つける
  // curlではGoogle検索は使えないので、
  // 既知のURLパターンからページを探す

  // 方法3: axel-homeの各ページを1つずつチェック（非効率だが確実）
  // → 事前にサイトマップからURLを取得済み

  return null; // この関数は使わない。代わりに直接検索
}

async function searchBuildingImages(mansionName) {
  // 複数ソースから検索
  const sources = [
    // KEN Corp
    { name: "kencorp", searchUrl: `https://www.kencorp.co.jp/housing/search/?keyword=${encodeURIComponent(mansionName)}` },
  ];

  // axel-homeの直接URLを試す（WebSearchで得たIDを使う）
  return [];
}

// メイン: WebSearchの結果を使ってaxel-homeのIDマッピングを作成
// 各建物のaxel-home URLリストは手動で提供する必要がある

// 代替アプローチ: 複数の不動産サイトから画像を取得
async function scrapeFromMultipleSources(mansionName) {
  const images = [];

  // ソース1: マンションレビュー
  try {
    const mrSearchUrl = `https://www.mansion-review.jp/mansion/search/?word=${encodeURIComponent(mansionName)}`;
    const mrHtml = await fetchHtml(mrSearchUrl);
    if (mrHtml) {
      const $ = cheerio.load(mrHtml);
      const firstLink = $('a[href*="/mansion/"]').filter((_i, el) => {
        const text = $(el).text();
        const href = $(el).attr("href") || "";
        return /\/mansion\/\d+/.test(href) && text.includes(mansionName.substring(0, 4));
      }).first().attr("href");

      if (firstLink) {
        const detailUrl = firstLink.startsWith("http") ? firstLink : `https://www.mansion-review.jp${firstLink}`;
        await sleep(500);
        const detailHtml = await fetchHtml(detailUrl);
        if (detailHtml) {
          const $d = cheerio.load(detailHtml);
          $d("img").each((_i, el) => {
            const src = $d(el).attr("src") || $d(el).attr("data-src") || "";
            const alt = $d(el).attr("alt") || "";
            if (src.includes("mansion") && (src.includes(".jpg") || src.includes(".png") || src.includes(".webp"))) {
              if (src.includes("noimage") || src.includes("icon") || src.includes("logo")) return;
              const fullUrl = src.startsWith("http") ? src : `https://www.mansion-review.jp${src}`;
              if (!images.some(img => img.url === fullUrl)) {
                images.push({ url: fullUrl, type: "exterior", caption: alt || "外観" });
              }
            }
          });
        }
      }
    }
  } catch {}

  return images;
}

// axel-homeの各ページを直接フェッチして建物名を照合
async function findOnAxelHome(mansionName, urlList) {
  // URLリストから候補をサンプリングして照合
  for (const url of urlList) {
    const data = await getAxelHomeData(url);
    if (data && buildingNameMatch(mansionName, data.title)) {
      return data;
    }
    await sleep(300);
  }
  return null;
}

async function main() {
  // 全建物を取得
  const res = await fetch(`${API_BASE}/api/mansions`);
  const data = await res.json();
  const mansions = data.data || data;

  console.log(`\n=== ${mansions.length}件の建物の画像を取得 ===\n`);

  // 既知のaxel-home IDマッピング（WebSearchで取得済み）
  const AXEL_HOME_IDS = {
    "パークコート渋谷 ザ タワー": "012147",
    "パークコート渋谷ザ タワー": "012147",
    "六本木ヒルズレジデンス": "000074",
    "虎ノ門ヒルズレジデンシャルタワー": "013817",
  };

  // 残りの建物は直接axel-homeを検索して見つける
  // axel-homeの検索ページを使う
  async function searchAxelHome(name) {
    // 既知のIDがあればそれを使用
    for (const [key, id] of Object.entries(AXEL_HOME_IDS)) {
      if (name.includes(key) || key.includes(name)) {
        return `https://www.axel-home.com/${id}.html`;
      }
    }

    // axel-homeの建物一覧ページから検索
    const searchUrl = `https://www.axel-home.com/rent/?keyword=${encodeURIComponent(name)}`;
    const html = await fetchHtml(searchUrl);
    if (!html) return null;

    const $ = cheerio.load(html);
    // 建物名に一致するリンクを探す
    let bestMatch = null;
    $("a").each((_i, el) => {
      const href = $(el).attr("href") || "";
      const text = $(el).text().trim();
      if (/\/\d+\.html$/.test(href) && buildingNameMatch(name, text)) {
        bestMatch = href.startsWith("http") ? href : `https://www.axel-home.com${href}`;
      }
    });
    return bestMatch;
  }

  const imageData = {};
  let success = 0;

  for (let i = 0; i < mansions.length; i++) {
    const m = mansions[i];
    console.log(`[${i + 1}/${mansions.length}] ${m.name}`);

    try {
      // axel-homeで検索
      const axelUrl = await searchAxelHome(m.name);
      if (axelUrl) {
        console.log(`  axel-home: ${axelUrl}`);
        await sleep(500);
        const data = await getAxelHomeData(axelUrl);
        if (data && data.images.length > 0) {
          // 建物名が一致するか確認
          if (buildingNameMatch(m.name, data.title)) {
            imageData[m.id] = data.images.slice(0, 6);
            console.log(`  ✓ ${data.images.length}枚取得 (${data.title})`);
            success++;
            await sleep(1000);
            continue;
          } else {
            console.log(`  ✗ 名前不一致: "${data.title}" ≠ "${m.name}"`);
          }
        }
      }

      // axel-homeで見つからない場合、他のソースを試す
      console.log(`  他ソースを検索中...`);
      const altImages = await scrapeFromMultipleSources(m.name);
      if (altImages.length > 0) {
        imageData[m.id] = altImages.slice(0, 6);
        console.log(`  ✓ ${altImages.length}枚取得 (代替ソース)`);
        success++;
      } else {
        console.log(`  ✗ 画像なし`);
      }
    } catch (e) {
      console.log(`  ✗ エラー: ${e.message}`);
    }

    await sleep(1500);
  }

  // TypeScriptファイルとして出力
  const outputPath = path.join(__dirname, "..", "src", "data", "mansion-images.ts");

  const tsContent = `// 自動生成: 各建物の本物の外観・エントランス写真
// 生成日: ${new Date().toISOString().split("T")[0]}
// ソース: axel-home.com, mansion-review.jp 等

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
}

main().catch(console.error);
