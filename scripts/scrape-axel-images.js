#!/usr/bin/env node
/**
 * axel-home.comから各建物の本物の画像URLを取得し、mansion-images.tsを生成
 */
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36";

async function fetchHtml(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html", "Accept-Language": "ja" },
      redirect: "follow",
    });
    if (!res.ok) return null;
    return await res.text();
  } catch { return null; }
}

async function getAxelImages(axelId) {
  const url = `https://www.axel-home.com/${axelId}.html`;
  const html = await fetchHtml(url);
  if (!html) return [];

  const $ = cheerio.load(html);
  const images = [];
  const seen = new Set();

  $("img").each((_i, el) => {
    let src = $(el).attr("data-src") || $(el).attr("src") || "";
    const alt = $(el).attr("alt") || "";
    if (!src.includes("bukken_images/picg")) return;

    const fullUrl = src.startsWith("http") ? src : `https://www.axel-home.com${src}`;
    if (seen.has(fullUrl)) return;
    seen.add(fullUrl);

    let type = "other";
    let caption = alt || "写真";
    if (/picg1\//.test(fullUrl)) { type = "exterior"; caption = "外観"; }
    else if (/picg2\//.test(fullUrl)) { type = "entrance"; caption = "エントランス"; }
    else if (/picg3\//.test(fullUrl)) { type = "common"; caption = "共用部"; }
    else if (/picg[4-9]\//.test(fullUrl)) { type = "interior"; caption = "室内"; }

    images.push({ url: fullUrl, type, caption });
  });

  // Also check for images in style attributes and background-images
  $("[style]").each((_i, el) => {
    const style = $(el).attr("style") || "";
    const match = style.match(/url\(['"]?(.*?bukken_images\/picg[^'")\s]+)['"]?\)/);
    if (match) {
      const fullUrl = match[1].startsWith("http") ? match[1] : `https://www.axel-home.com${match[1]}`;
      if (!seen.has(fullUrl)) {
        seen.add(fullUrl);
        let type = "other";
        let caption = "写真";
        if (/picg1\//.test(fullUrl)) { type = "exterior"; caption = "外観"; }
        else if (/picg2\//.test(fullUrl)) { type = "entrance"; caption = "エントランス"; }
        images.push({ url: fullUrl, type, caption });
      }
    }
  });

  // Check source/picture elements
  $("source").each((_i, el) => {
    const srcset = $(el).attr("srcset") || "";
    if (srcset.includes("bukken_images/picg")) {
      const fullUrl = srcset.startsWith("http") ? srcset.split(" ")[0] : `https://www.axel-home.com${srcset.split(" ")[0]}`;
      if (!seen.has(fullUrl)) {
        seen.add(fullUrl);
        images.push({ url: fullUrl, type: "exterior", caption: "外観" });
      }
    }
  });

  return images;
}

// Mansion ID → axel-home ID mapping
const MANSION_AXEL_MAP = {
  "a1000000-0000-0000-0000-000000000001": "009034",  // パークコート赤坂檜町ザ タワー
  "a3000000-0000-0000-0000-000000000001": "001604",  // パークコート麻布十番ザ タワー
  "a3000000-0000-0000-0000-000000000009": "012147",  // パークコート渋谷ザ タワー
  "a2000000-0000-0000-0000-000000000011": "012147",  // パークコート渋谷 ザ タワー (same building)
  "a3000000-0000-0000-0000-000000000013": "012270",  // パークコート千代田四番町
  "a3000000-0000-0000-0000-000000000022": "010605",  // パークコート文京小石川ザ タワー
  "a1000000-0000-0000-0000-000000000006": "010191",  // ブリリアタワーズ目黒 サウスレジデンス
  "a1000000-0000-0000-0000-000000000002": "001867",  // ラ・トゥール渋谷
  "a3000000-0000-0000-0000-000000000016": "008507",  // ラ・トゥール新宿ガーデン
  "a2000000-0000-0000-0000-000000000005": "004707",  // プラウドタワー東雲キャナルコート
  "a3000000-0000-0000-0000-000000000019": "000679",  // ワールドシティタワーズ (アクアタワー)
  "a2000000-0000-0000-0000-000000000003": "000742",  // ワールドシティタワーズ (キャピタルタワー)
  "a1000000-0000-0000-0000-000000000004": "011351",  // ザ・パークハウス グラン 南青山
  "a1000000-0000-0000-0000-000000000007": "010059",  // ザ・パークハウス西新宿タワー60
  "a3000000-0000-0000-0000-000000000012": "008433",  // ザ・パークハウス千代田麹町
  "a3000000-0000-0000-0000-000000000015": "008559",  // ザ・パークハウス新宿御苑
  "a2000000-0000-0000-0000-000000000006": "008381",  // ザ・パークハウス晴海タワーズ ティアロレジデンス
  "a2000000-0000-0000-0000-000000000014": "012803",  // ザ・パークハウス三田タワー
  "a3000000-0000-0000-0000-000000000002": "000756",  // 赤坂タワーレジデンス
  "a3000000-0000-0000-0000-000000000003": "000074",  // 六本木ヒルズレジデンス
  "a2000000-0000-0000-0000-000000000001": "000074",  // 六本木ヒルズレジデンス (duplicate)
  "a3000000-0000-0000-0000-000000000004": "013817",  // 虎ノ門ヒルズレジデンシャルタワー
  "a2000000-0000-0000-0000-000000000012": "013817",  // 虎ノ門ヒルズレジデンシャルタワー (duplicate)
  "a1000000-0000-0000-0000-000000000005": "005888",  // グランドヒルズ白金台
  "a3000000-0000-0000-0000-000000000007": "007885",  // パークハビオ赤坂タワー
  "a3000000-0000-0000-0000-000000000005": "007706",  // ザ・レジデンス三田
  "a3000000-0000-0000-0000-000000000006": "001684",  // コンフォリア南青山
  "a3000000-0000-0000-0000-000000000017": "000601",  // コンシェリア西新宿タワーズウエスト
  "a2000000-0000-0000-0000-000000000009": "000601",  // コンシェリア西新宿 TOWER'S WEST (same)
  "a3000000-0000-0000-0000-000000000021": "000350",  // パークタワー目黒
  "a3000000-0000-0000-0000-000000000018": "008243",  // パークシティ大崎ザ タワー
  "a3000000-0000-0000-0000-000000000014": "008913",  // ザ・千代田麹町タワーレジデンス
  "a2000000-0000-0000-0000-000000000008": "008699",  // 勝どきザ・タワー
  "a2000000-0000-0000-0000-000000000004": "007498",  // 芝浦アイランド ブルームタワー
  "a2000000-0000-0000-0000-000000000013": "011923",  // ブランズタワー豊洲
  "a2000000-0000-0000-0000-000000000015": "010537",  // パークタワー晴海
};

// Buildings NOT on axel-home - need alternative image sources
// We'll search for these separately
const NO_AXEL_BUILDINGS = {
  "a3000000-0000-0000-0000-000000000020": "ブリリアタワー目黒",
  "a3000000-0000-0000-0000-000000000023": "ブリリアタワー上野池之端",
  "a3000000-0000-0000-0000-000000000011": "ザ・パークハウス代官山",
  "a3000000-0000-0000-0000-000000000008": "広尾ガーデンフォレスト",
  "a3000000-0000-0000-0000-000000000010": "セルリアンタワー東急レジデンス",
  "a1000000-0000-0000-0000-000000000003": "パークマンション南麻布",
  "a2000000-0000-0000-0000-000000000002": "東京ミッドタウンレジデンシィズ",
  "a2000000-0000-0000-0000-000000000007": "パークシティ武蔵小杉 ザ ガーデン",
  "a2000000-0000-0000-0000-000000000010": "ザ・タワー横浜北仲",
};

async function main() {
  const imageData = {};
  const axelEntries = Object.entries(MANSION_AXEL_MAP);

  console.log(`=== axel-home.comから${axelEntries.length}件の画像を取得 ===\n`);

  // Process axel-home buildings
  let success = 0;
  const axelCache = {}; // Cache by axel ID to avoid re-fetching duplicates

  for (let i = 0; i < axelEntries.length; i++) {
    const [mansionId, axelId] = axelEntries[i];
    console.log(`[${i + 1}/${axelEntries.length}] axel-home ID: ${axelId}`);

    let images;
    if (axelCache[axelId]) {
      images = axelCache[axelId];
      console.log(`  (キャッシュ使用) ${images.length}枚`);
    } else {
      images = await getAxelImages(axelId);
      axelCache[axelId] = images;
      console.log(`  取得: ${images.length}枚`);
      await sleep(800);
    }

    if (images.length > 0) {
      imageData[mansionId] = images.slice(0, 6);
      success++;
    } else {
      console.log(`  ✗ 画像なし`);
    }
  }

  console.log(`\n=== axel-home結果: ${success}/${axelEntries.length}件成功 ===\n`);

  // Log buildings without images
  const noImageBuildings = Object.entries(NO_AXEL_BUILDINGS);
  if (noImageBuildings.length > 0) {
    console.log(`=== axel-homeにない建物: ${noImageBuildings.length}件 ===`);
    for (const [id, name] of noImageBuildings) {
      console.log(`  ${name} (${id})`);
    }
  }

  // Output results
  const outputPath = path.join(__dirname, "..", "src", "data", "mansion-images.ts");

  const tsContent = `// 自動生成: axel-home.comから取得した建物画像データ
// 生成日: ${new Date().toISOString().split("T")[0]}
// ソース: axel-home.com

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
  console.log(`\n出力: ${outputPath}`);
  console.log(`画像あり: ${Object.keys(imageData).length}件`);
  console.log(`画像なし: ${noImageBuildings.length}件 (別途対応必要)`);
}

main().catch(console.error);
