import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { scrapeSuumoAllPages, guessAreaCode } from "@/lib/scraper/suumo";
import { processScrapedListingsWithNotifications } from "@/lib/scraper/process";

/**
 * GET /api/scrape/cron
 * Vercel Cronから6時間ごとに呼ばれる
 * 監視中の建物名でSUUMOをスクレイプ → DB保存 → 通知 → メール
 */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error("[cron] CRON_SECRET が設定されていません");
    return NextResponse.json({ error: "サーバー設定エラー" }, { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "認証に失敗しました" }, { status: 401 });
  }

  try {
    const supabase = await createServerSupabaseClient();

    // 監視中の建物を取得
    const { data: watchlists, error: watchError } = await supabase
      .from("user_watchlists")
      .select("target_mansion_id, mansions(name, address)")
      .eq("is_active", true)
      .not("target_mansion_id", "is", null);

    if (watchError) {
      throw new Error(`監視リスト取得エラー: ${watchError.message}`);
    }

    if (!watchlists || watchlists.length === 0) {
      // フォールバック: 全建物を対象にスクレイプ
      const { data: allMansions } = await supabase
        .from("mansions")
        .select("name, address")
        .order("updated_at", { ascending: false })
        .limit(10);

      if (!allMansions || allMansions.length === 0) {
        return NextResponse.json({ message: "スクレイプ対象の建物がありません", results: [] });
      }

      return await scrapeBuildings(
        allMansions.map((m) => ({ name: m.name, address: m.address }))
      );
    }

    // 重複除去して建物リストを作成
    const buildingMap = new Map<string, { name: string; address: string }>();
    for (const w of watchlists) {
      const mansion = w.mansions as unknown as { name: string; address: string } | null;
      if (mansion?.name && !buildingMap.has(mansion.name)) {
        buildingMap.set(mansion.name, { name: mansion.name, address: mansion.address || "" });
      }
    }

    return await scrapeBuildings([...buildingMap.values()]);
  } catch (error) {
    console.error("[cron] Cronジョブエラー:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Cronジョブ中にエラー" },
      { status: 500 }
    );
  }
}

async function scrapeBuildings(
  buildings: { name: string; address: string }[]
): Promise<NextResponse> {
  const results: Array<{
    building_name: string;
    raw_count: number;
    created: number;
    updated: number;
    skipped: number;
    notifications_created: number;
    emails_sent: number;
    error?: string;
  }> = [];

  for (const building of buildings) {
    try {
      const areaCode = guessAreaCode(building.address);
      const listings = await scrapeSuumoAllPages(building.name, areaCode, 2);

      if (listings.length === 0) {
        results.push({
          building_name: building.name,
          raw_count: 0,
          created: 0, updated: 0, skipped: 0,
          notifications_created: 0, emails_sent: 0,
        });
        continue;
      }

      const result = await processScrapedListingsWithNotifications(listings);
      results.push({
        building_name: building.name,
        raw_count: listings.length,
        ...result,
      });
    } catch (error) {
      console.error(`[cron] ${building.name} スクレイプエラー:`, error);
      results.push({
        building_name: building.name,
        raw_count: 0,
        created: 0, updated: 0, skipped: 0,
        notifications_created: 0, emails_sent: 0,
        error: error instanceof Error ? error.message : "エラー",
      });
    }

    // レートリミット: 建物間に3秒待機
    await new Promise((r) => setTimeout(r, 3000));
  }

  const totalCreated = results.reduce((s, r) => s + r.created, 0);
  const totalUpdated = results.reduce((s, r) => s + r.updated, 0);
  const totalNotifs = results.reduce((s, r) => s + r.notifications_created, 0);

  return NextResponse.json({
    message: `${buildings.length}件の建物をSUUMOからスクレイプしました`,
    total_created: totalCreated,
    total_updated: totalUpdated,
    total_notifications: totalNotifs,
    results,
  });
}
