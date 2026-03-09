import * as cheerio from "cheerio";
import { ScrapedListing } from "./types";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/**
 * SUUMOの賃貸物件一覧ページをスクレイプして物件情報を抽出する
 */
export async function scrapeSuumoPage(
  url: string
): Promise<ScrapedListing[]> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "ja,en-US;q=0.7,en;q=0.3",
    },
  });

  if (!response.ok) {
    throw new Error(
      `SUUMOページの取得に失敗しました: ${response.status} ${response.statusText}`
    );
  }

  const html = await response.text();
  return parseSuumoHtml(html, url);
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

  // SUUMOの賃貸物件一覧: 各物件カセット
  $(".cassetteitem").each((_index, element) => {
    const $item = $(element);

    // 建物情報（カセット共通部分）
    const mansionName =
      $item.find(".cassetteitem_content-title").text().trim() || "";
    const address =
      $item.find(".cassetteitem_detail-col1").text().trim() || "";

    // 最寄り駅情報の抽出
    const stationTexts: string[] = [];
    $item.find(".cassetteitem_detail-col2 .cassetteitem_detail-text").each(
      (_i, el) => {
        stationTexts.push($(el).text().trim());
      }
    );

    // 最初の駅情報から駅名と徒歩分を抽出
    const stationInfo = parseStationInfo(stationTexts[0] || "");

    // 各部屋情報（tbody 行ごと）
    $item.find(".cassetteitem_other tbody tr").each((_i, row) => {
      const $row = $(row);

      // 階数
      const floorText = $row.find("td").eq(2).text().trim();
      const floor = parseFloor(floorText);

      // 賃料
      const rentText = $row.find(".cassetteitem_other-emphasis").text().trim();
      const rent = parsePrice(rentText);

      // 管理費
      const feeText = $row
        .find(".cassetteitem_price--administration")
        .text()
        .trim();
      const managementFee = parsePrice(feeText);

      // 間取り
      const layoutType = $row
        .find(".cassetteitem_madori")
        .text()
        .trim();

      // 面積
      const sizeText = $row
        .find(".cassetteitem_menseki")
        .text()
        .trim();
      const sizeSqm = parseSize(sizeText);

      // 物件詳細URL
      const detailLink = $row.find("a[href*='/chintai/']").attr("href") || "";
      const sourceUrl = detailLink
        ? new URL(detailLink, baseUrl).toString()
        : baseUrl;

      // 必須フィールドが取れている場合のみ追加
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
          management_fee: managementFee,
          source_site: "suumo",
          source_url: sourceUrl,
        });
      }
    });
  });

  return listings;
}

/**
 * 駅情報テキストから駅名と徒歩分を抽出
 * 例: "東京メトロ丸ノ内線/本郷三丁目駅 歩5分"
 */
function parseStationInfo(text: string): {
  station: string;
  minutes: number;
} {
  if (!text) return { station: "", minutes: 0 };

  // 駅名の抽出（路線名/駅名 形式）
  const stationMatch = text.match(/\/(.+?駅)/);
  const station = stationMatch ? stationMatch[1] : text.split(" ")[0] || "";

  // 徒歩分の抽出
  const minutesMatch = text.match(/歩(\d+)分/);
  const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

  return { station, minutes };
}

/**
 * 階数テキストから数値を抽出
 * 例: "3階" → 3, "B1階" → -1
 */
function parseFloor(text: string): number | null {
  if (!text) return null;

  const basementMatch = text.match(/B(\d+)/i);
  if (basementMatch) return -parseInt(basementMatch[1], 10);

  const floorMatch = text.match(/(\d+)階/);
  if (floorMatch) return parseInt(floorMatch[1], 10);

  return null;
}

/**
 * 価格テキストから円単位の数値を抽出
 * 例: "8.5万円" → 85000, "5000円" → 5000, "-" → null
 */
function parsePrice(text: string): number {
  if (!text || text === "-" || text === "—") return 0;

  // "8.5万円" 形式
  const manMatch = text.match(/([\d.]+)\s*万/);
  if (manMatch) return Math.round(parseFloat(manMatch[1]) * 10000);

  // "5000円" 形式
  const yenMatch = text.match(/([\d,]+)\s*円/);
  if (yenMatch) return parseInt(yenMatch[1].replace(/,/g, ""), 10);

  return 0;
}

/**
 * 面積テキストから数値を抽出
 * 例: "25.5m2" → 25.5
 */
function parseSize(text: string): number {
  if (!text) return 0;
  const match = text.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}
