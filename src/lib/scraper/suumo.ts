import * as cheerio from "cheerio";
import { ScrapedListing, ScrapedImage } from "./types";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

// SUUMOエリアコード（東京23区）
const TOKYO_AREA_CODES: Record<string, string> = {
  千代田区: "13101", 中央区: "13102", 港区: "13103", 新宿区: "13104",
  文京区: "13105", 台東区: "13106", 墨田区: "13107", 江東区: "13108",
  品川区: "13109", 目黒区: "13110", 大田区: "13111", 世田谷区: "13112",
  渋谷区: "13113", 中野区: "13114", 杉並区: "13115", 豊島区: "13116",
  北区: "13117", 荒川区: "13118", 板橋区: "13119", 練馬区: "13120",
  足立区: "13121", 葛飾区: "13122", 江戸川区: "13123",
};

/**
 * 建物名とオプションのエリアからSUUMO検索URLを生成
 */
export function buildSuumoSearchUrl(
  buildingName: string,
  areaCode?: string
): string {
  const params = new URLSearchParams({
    ar: "030", // 関東
    bs: "040", // 賃貸
    ta: "13",  // 東京都
    fw: buildingName,
    srch_navi: "1",
  });
  if (areaCode) {
    params.set("sc", areaCode);
  }
  return `https://suumo.jp/jj/chintai/ichiran/FR301FC001/?${params.toString()}`;
}

/**
 * 建物名から推定エリアコードを取得
 */
export function guessAreaCode(address: string): string | undefined {
  for (const [ward, code] of Object.entries(TOKYO_AREA_CODES)) {
    if (address.includes(ward)) return code;
  }
  return undefined;
}

/**
 * SUUMOの賃貸物件一覧ページをスクレイプして物件情報を抽出する
 * buildingNameFilter: 指定すると建物名で結果をフィルタリング
 */
export async function scrapeSuumoPage(
  url: string,
  buildingNameFilter?: string
): Promise<ScrapedListing[]> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "ja,en-US;q=0.7,en;q=0.3",
      "Accept-Encoding": "gzip, deflate, br",
      "Cache-Control": "no-cache",
      Referer: "https://suumo.jp/",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`SUUMO取得失敗: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  let listings = parseSuumoHtml(html, url);

  // 建物名フィルタリング（部分一致）
  if (buildingNameFilter) {
    const normalize = (s: string) =>
      s.replace(/[\s　]/g, "").replace(/[Ａ-Ｚａ-ｚ０-９]/g, (ch) =>
        String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
      ).toLowerCase();

    const filterNorm = normalize(buildingNameFilter);
    listings = listings.filter((l) => {
      const nameNorm = normalize(l.mansion_name);
      // 部分一致 or 類似度チェック
      return nameNorm.includes(filterNorm) || filterNorm.includes(nameNorm) ||
        similarityScore(nameNorm, filterNorm) > 0.5;
    });
  }

  return listings;
}

/**
 * 2ページ目以降も取得して全件スクレイプ
 */
export async function scrapeSuumoAllPages(
  buildingName: string,
  areaCode?: string,
  maxPages: number = 3
): Promise<ScrapedListing[]> {
  const allListings: ScrapedListing[] = [];

  for (let page = 1; page <= maxPages; page++) {
    const params = new URLSearchParams({
      ar: "030",
      bs: "040",
      ta: "13",
      fw: buildingName,
      srch_navi: "1",
      pn: String(page),
    });
    if (areaCode) params.set("sc", areaCode);

    const url = `https://suumo.jp/jj/chintai/ichiran/FR301FC001/?${params.toString()}`;

    try {
      const listings = await scrapeSuumoPage(url, buildingName);
      if (listings.length === 0) break; // 結果なし = 最終ページ超過
      allListings.push(...listings);

      // レート制限
      if (page < maxPages) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    } catch (error) {
      console.error(`[suumo] ページ${page}取得エラー:`, error);
      break;
    }
  }

  return allListings;
}

/**
 * SUUMOのHTMLをパースして物件情報を抽出する
 */
export function parseSuumoHtml(
  html: string,
  baseUrl: string
): ScrapedListing[] {
  const $ = cheerio.load(html);
  const listings: ScrapedListing[] = [];

  $(".cassetteitem").each((_index, element) => {
    const $item = $(element);

    const mansionName = $item.find(".cassetteitem_content-title").text().trim() || "";
    const address = $item.find(".cassetteitem_detail-col1").text().trim() || "";

    // 最寄り駅
    const stationTexts: string[] = [];
    $item.find(".cassetteitem_detail-col2 .cassetteitem_detail-text").each((_i, el) => {
      stationTexts.push($(el).text().trim());
    });
    const stationInfo = parseStationInfo(stationTexts[0] || "");

    // 建物画像
    const images: ScrapedImage[] = [];
    let exteriorImageUrl: string | null = null;

    const mainImg = $item.find(".cassetteitem_object-item img").attr("rel") ||
      $item.find(".cassetteitem_object-item img").attr("data-src") ||
      $item.find(".cassetteitem_object-item img").attr("src");
    if (mainImg && !mainImg.includes("noimage") && !mainImg.includes("spacer.gif")) {
      const fullUrl = resolveUrl(mainImg, baseUrl);
      exteriorImageUrl = fullUrl;
      images.push({ url: fullUrl, type: "exterior", caption: "外観" });
    }

    // 建物設備
    const buildingFeatures: string[] = [];
    $item.find(".cassetteitem_detail-col3 div").each((_i, el) => {
      const text = $(el).text().trim();
      if (text) buildingFeatures.push(text);
    });

    // 築年数・構造
    const col3Text = $item.find(".cassetteitem_detail-col3").text();
    if (col3Text) {
      const ageMatch = col3Text.match(/(築\d+年|新築)/);
      if (ageMatch && !buildingFeatures.includes(ageMatch[1])) {
        buildingFeatures.push(ageMatch[1]);
      }
      const structMatch = col3Text.match(/(鉄筋コンクリート|鉄骨鉄筋|鉄骨造|木造|軽量鉄骨)/);
      if (structMatch && !buildingFeatures.includes(structMatch[1])) {
        buildingFeatures.push(structMatch[1]);
      }
    }

    // 各部屋情報
    $item.find(".cassetteitem_other tbody tr").each((_i, row) => {
      const $row = $(row);

      const floorText = $row.find("td").eq(2).text().trim();
      const floor = parseFloor(floorText);

      const rentText = $row.find(".cassetteitem_other-emphasis").text().trim();
      const rent = parsePrice(rentText);

      const feeText = $row.find(".cassetteitem_price--administration").text().trim();
      const managementFee = parsePrice(feeText);

      const depositText = $row.find(".cassetteitem_price--deposit").text().trim();
      const deposit = parsePrice(depositText);

      const keyMoneyText = $row.find(".cassetteitem_price--gratuity").text().trim();
      const keyMoney = parsePrice(keyMoneyText);

      const layoutType = $row.find(".cassetteitem_madori").text().trim();
      const sizeText = $row.find(".cassetteitem_menseki").text().trim();
      const sizeSqm = parseSize(sizeText);

      // 間取り図
      let floorplanImageUrl: string | null = null;
      const floorplanImg = $row.find(".cassetteitem_other-thumbnail img").attr("rel") ||
        $row.find(".cassetteitem_other-thumbnail img").attr("data-src") ||
        $row.find(".cassetteitem_other-thumbnail img").attr("src");
      if (floorplanImg && !floorplanImg.includes("noimage") && !floorplanImg.includes("spacer.gif")) {
        floorplanImageUrl = resolveUrl(floorplanImg, baseUrl);
        images.push({ url: floorplanImageUrl, type: "floorplan", caption: "間取り図" });
      }

      // 詳細URL
      const detailLink = $row.find("a[href*='/chintai/']").attr("href") ||
        $row.find("a[href*='bc_']").attr("href") || "";
      const sourceUrl = detailLink ? resolveUrl(detailLink, "https://suumo.jp") : baseUrl;

      if (mansionName && rent > 0) {
        listings.push({
          mansion_name: mansionName,
          address,
          nearest_station: stationInfo.station,
          walking_minutes: stationInfo.minutes,
          layout_type: layoutType || "不明",
          size_sqm: sizeSqm,
          floor,
          rent,
          management_fee: managementFee || null,
          deposit: deposit || null,
          key_money: keyMoney || null,
          images: [...images],
          move_in_date: null,
          interior_features: [],
          building_features: buildingFeatures,
          floorplan_image_url: floorplanImageUrl,
          exterior_image_url: exteriorImageUrl,
          source_site: "suumo",
          source_url: sourceUrl,
        });
      }
    });
  });

  return listings;
}

// --- ユーティリティ ---

function parseStationInfo(text: string): { station: string; minutes: number } {
  if (!text) return { station: "", minutes: 0 };
  const stationMatch = text.match(/\/(.+?駅)/);
  const station = stationMatch ? stationMatch[1] : text.split(" ")[0] || "";
  const minutesMatch = text.match(/歩(\d+)分/);
  const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
  return { station, minutes };
}

function parseFloor(text: string): number | null {
  if (!text) return null;
  const basementMatch = text.match(/B(\d+)/i);
  if (basementMatch) return -parseInt(basementMatch[1], 10);
  const floorMatch = text.match(/(\d+)階/);
  if (floorMatch) return parseInt(floorMatch[1], 10);
  return null;
}

export function parsePrice(text: string): number {
  if (!text || text === "-" || text === "—" || text === "―") return 0;
  const manMatch = text.match(/([\d.]+)\s*万/);
  if (manMatch) return Math.round(parseFloat(manMatch[1]) * 10000);
  const yenMatch = text.match(/([\d,]+)\s*円/);
  if (yenMatch) return parseInt(yenMatch[1].replace(/,/g, ""), 10);
  return 0;
}

export function parseSize(text: string): number {
  if (!text) return 0;
  const match = text.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

function resolveUrl(url: string, base: string): string {
  if (url.startsWith("http")) return url;
  if (url.startsWith("//")) return "https:" + url;
  return new URL(url, base).toString();
}

/**
 * 簡易文字列類似度（0-1）
 */
function similarityScore(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length === 0 || b.length === 0) return 0;

  // 共通部分文字列の長さベースの簡易スコア
  let matches = 0;
  const shorter = a.length < b.length ? a : b;
  const longer = a.length < b.length ? b : a;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) matches++;
  }
  return matches / longer.length;
}

export { parseStationInfo, parseFloor };
