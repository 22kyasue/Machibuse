#!/usr/bin/env node
/**
 * SUUMOから各建物の画像をスクレイピングして保存するスクリプト
 * Usage: node scripts/scrape-images.js
 */
const cheerio = require("cheerio");

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
      "Accept-Encoding": "gzip, deflate, br",
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
    if (/spacer|noimage|icon|logo|btn|nowprinting/i.test(src)) return;
    if (src.length < 30) return;

    // SUUMOのサムネイル(_*t.jpg)を除外し、オリジナル(_*o.jpg)のみ使用
    if (/_[a-z0-9]*t\.jpg/i.test(src)) return;

    const fullUrl = src.startsWith("http")
      ? src
      : src.startsWith("//")
        ? `https:${src}`
        : new URL(src, baseUrl).toString();

    if (seen.has(fullUrl)) return;
    seen.add(fullUrl);

    // 画像サイズフィルタ
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

  return images.slice(0, 10);
}

async function searchSuumo(mansionName) {
  const query = encodeURIComponent(mansionName);
  // 賃貸検索
  const searchUrl = `https://suumo.jp/jj/chintai/ichiran/FR301FC001/?fw=${query}&ar=030&bs=040&ta=13`;
  console.log(`  検索: ${mansionName}`);

  const html = await fetchHtml(searchUrl);
  if (!html) return [];

  const $ = cheerio.load(html);

  // 詳細ページリンクを探す
  const detailLink = $("a[href*='/chintai/jnc_']").first().attr("href");
  if (!detailLink) {
    // 横浜・神奈川の建物は ta=14 で再検索
    const searchUrl2 = `https://suumo.jp/jj/chintai/ichiran/FR301FC001/?fw=${query}&ar=030&bs=040`;
    console.log(`  全エリアで再検索...`);
    const html2 = await fetchHtml(searchUrl2);
    if (!html2) return [];
    const $2 = cheerio.load(html2);
    const detailLink2 = $2("a[href*='/chintai/jnc_']").first().attr("href");
    if (!detailLink2) {
      console.log(`  検索結果なし`);
      return extractImages(html, searchUrl);
    }
    const detailUrl2 = detailLink2.startsWith("http")
      ? detailLink2
      : `https://suumo.jp${detailLink2}`;
    console.log(`  詳細ページ: ${detailUrl2.substring(0, 80)}...`);
    await sleep(1000);
    const detailHtml2 = await fetchHtml(detailUrl2);
    return detailHtml2 ? extractImages(detailHtml2, detailUrl2) : [];
  }

  const detailUrl = detailLink.startsWith("http")
    ? detailLink
    : `https://suumo.jp${detailLink}`;
  console.log(`  詳細ページ: ${detailUrl.substring(0, 80)}...`);

  await sleep(1000);
  const detailHtml = await fetchHtml(detailUrl);
  if (!detailHtml) return extractImages(html, searchUrl);

  return extractImages(detailHtml, detailUrl);
}

async function saveImages(mansionId, images) {
  try {
    // 既存画像を削除
    await fetch(`${API_BASE}/api/mansions/${mansionId}/images`, {
      method: "DELETE",
    });

    // 新しい画像を保存
    const postRes = await fetch(`${API_BASE}/api/mansions/${mansionId}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        images.map((img) => ({
          url: img.url,
          type: img.type,
          caption: img.caption,
        }))
      ),
    });

    if (!postRes.ok) {
      const err = await postRes.text();
      console.log(`  保存エラー: ${err}`);
      return false;
    }
    console.log(`  ✓ ${images.length}枚保存`);
    return true;
  } catch (e) {
    console.log(`  保存エラー: ${e.message}`);
    return false;
  }
}

async function main() {
  // 全建物を取得
  const res = await fetch(`${API_BASE}/api/mansions`);
  const data = await res.json();
  const mansions = data.data || data;

  console.log(`\n=== ${mansions.length}件の建物の画像をスクレイピング ===\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < mansions.length; i++) {
    const m = mansions[i];
    console.log(`\n[${i + 1}/${mansions.length}] ${m.name}`);

    try {
      const images = await searchSuumo(m.name);
      if (images.length > 0) {
        const saved = await saveImages(m.id, images);
        if (saved) success++;
        else failed++;
      } else {
        console.log(`  画像なし`);
        failed++;
      }
    } catch (e) {
      console.log(`  エラー: ${e.message}`);
      failed++;
    }

    // レート制限対策
    await sleep(2000);
  }

  console.log(`\n=== 完了 ===`);
  console.log(`成功: ${success}件, 失敗: ${failed}件`);
}

main().catch(console.error);
