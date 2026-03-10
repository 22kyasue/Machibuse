#!/usr/bin/env node
const cheerio = require("cheerio");
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)";

async function fetchImages(url, label) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
    if (res.status !== 200) { console.log(`${label}: HTTP ${res.status} @ ${url}`); return []; }
    const html = await res.text();
    const $ = cheerio.load(html);
    const imgs = [];
    $("img").each((_, el) => {
      const src = $(el).attr("src") || $(el).attr("data-src") || "";
      if (src && (src.includes(".jpg") || src.includes(".png") || src.includes(".webp"))) {
        if (src.includes("logo") || src.includes("icon") || src.includes("noimage") || src.includes("button") || src.includes("common/") || src.includes("sprite")) return;
        const full = src.startsWith("http") ? src : new URL(src, url).href;
        if (full.includes("building") || full.includes("property") || full.includes("bukken") || full.includes("mansion") || full.includes("picg") || full.includes("gaikan") || full.includes("photo")) {
          if (imgs.indexOf(full) === -1) imgs.push(full);
        }
      }
    });
    console.log(`${label}: ${imgs.length} images from ${url}`);
    imgs.slice(0, 4).forEach(i => console.log(`  ${i}`));
    return imgs;
  } catch(e) { console.log(`${label}: ERROR ${e.message}`); return []; }
}

async function main() {
  // ブリリアタワー目黒 - try different sources
  console.log("--- ブリリアタワー目黒 ---");
  let imgs = await fetchImages("https://www.homes.co.jp/mansion/b-3500769/", "homes.co.jp");
  if (imgs.length === 0) imgs = await fetchImages("https://www.athome.co.jp/bldg-library/tokyo/shinagawa/3500769/", "athome");

  console.log("\n--- ブリリアタワー上野池之端 ---");
  await fetchImages("https://www.athome.co.jp/bldg-library/tokyo/taito/3105698/", "athome");

  console.log("\n--- ザ・パークハウス代官山 ---");
  await fetchImages("https://www.athome.co.jp/bldg-library/tokyo/shibuya/4795084/", "athome");

  console.log("\n--- 広尾ガーデンフォレスト ---");
  await fetchImages("https://www.athome.co.jp/bldg-library/tokyo/shibuya/1055920/", "athome");

  console.log("\n--- セルリアンタワー東急レジデンス ---");
  await fetchImages("https://www.athome.co.jp/bldg-library/tokyo/shibuya/1055854/", "athome");
}

main();
