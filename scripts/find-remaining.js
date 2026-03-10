#!/usr/bin/env node
const cheerio = require("cheerio");
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)";

async function getKencorpImages(keyword, label) {
  const url = `https://www.kencorp.co.jp/housing/search/?keyword=${encodeURIComponent(keyword)}`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
    if (!res.ok) { console.log(`${label}: HTTP ${res.status}`); return null; }
    const html = await res.text();
    const $ = cheerio.load(html);

    // Find property links
    const links = [];
    $("a").each((_, el) => {
      const href = $(el).attr("href") || "";
      const text = $(el).text().trim();
      if (href.includes("/housing/properties/") && text.length > 0) {
        links.push({ href, text: text.substring(0, 60) });
      }
    });

    console.log(`${label}: ${links.length} results`);
    if (links.length > 0) {
      const best = links[0];
      console.log(`  Best: ${best.href} -> ${best.text}`);

      // Follow the link to get images
      const propUrl = best.href.startsWith("http") ? best.href : `https://www.kencorp.co.jp${best.href}`;
      const propRes = await fetch(propUrl, { headers: { "User-Agent": UA } });
      if (!propRes.ok) return null;
      const propHtml = await propRes.text();
      const $p = cheerio.load(propHtml);

      const images = [];
      $p("img").each((_, el) => {
        const src = $p(el).attr("src") || $p(el).attr("data-src") || "";
        if (src.includes("/images/building/") && src.includes(".jpg")) {
          const full = src.startsWith("http") ? src : `https://www.kencorp.co.jp${src}`;
          if (!images.includes(full)) images.push(full);
        }
      });

      console.log(`  Images: ${images.length}`);
      images.slice(0, 3).forEach(i => console.log(`    ${i}`));
      return images;
    }
    return null;
  } catch(e) { console.log(`${label}: ERROR ${e.message}`); return null; }
}

async function main() {
  const results = {};

  const searches = [
    ["ブリリアタワー目黒", "a3000000-0000-0000-0000-000000000020"],
    ["ブリリアタワー上野池之端", "a3000000-0000-0000-0000-000000000023"],
    ["パークハウス代官山", "a3000000-0000-0000-0000-000000000011"],
    ["広尾ガーデンフォレスト", "a3000000-0000-0000-0000-000000000008"],
    ["セルリアンタワー東急レジデンス", "a3000000-0000-0000-0000-000000000010"],
  ];

  for (const [name, id] of searches) {
    const images = await getKencorpImages(name, name);
    if (images && images.length > 0) {
      results[id] = images;
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log("\n=== Results ===");
  console.log(JSON.stringify(results, null, 2));
}

main();
