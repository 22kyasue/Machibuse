import { NextRequest, NextResponse } from "next/server";
import { scrapeSuumoPage, scrapeSuumoAllPages, buildSuumoSearchUrl, guessAreaCode } from "@/lib/scraper/suumo";
import { processScrapedListingsWithNotifications } from "@/lib/scraper/process";

/**
 * POST /api/scrape/manual
 * 手動スクレイプ実行
 * body: { building_name: string, url?: string, address?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { building_name, url, address } = body as {
      building_name?: string;
      url?: string;
      address?: string;
    };

    if (!building_name && !url) {
      return NextResponse.json(
        { error: "building_name または url が必要です" },
        { status: 400 }
      );
    }

    let listings;
    const startTime = Date.now();

    if (url) {
      // 直接URL指定
      listings = await scrapeSuumoPage(url, building_name || undefined);
    } else {
      // 建物名で自動検索
      const areaCode = address ? guessAreaCode(address) : undefined;
      listings = await scrapeSuumoAllPages(building_name!, areaCode, 2);
    }

    const scrapeTime = Date.now() - startTime;

    if (listings.length === 0) {
      return NextResponse.json({
        message: "該当する物件が見つかりませんでした",
        scrape_time_ms: scrapeTime,
        raw_count: 0,
        results: { created: 0, updated: 0, skipped: 0, notifications_created: 0, emails_sent: 0 },
      });
    }

    // DB保存 & 通知生成
    const results = await processScrapedListingsWithNotifications(listings);

    return NextResponse.json({
      message: `${listings.length}件の物件を取得しました`,
      scrape_time_ms: scrapeTime,
      raw_count: listings.length,
      listings_preview: listings.slice(0, 5).map((l) => ({
        name: l.mansion_name,
        layout: l.layout_type,
        size: l.size_sqm,
        rent: l.rent,
        station: l.nearest_station,
        source_url: l.source_url,
      })),
      results,
    });
  } catch (error) {
    console.error("[manual-scrape] エラー:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "スクレイプ中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
