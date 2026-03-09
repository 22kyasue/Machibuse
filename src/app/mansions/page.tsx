import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { StatusTag } from "@/components/ui/status-tag";
import { mockMansions } from "@/lib/mock-data";

export default function MansionsPage() {
  const mansions = mockMansions;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">建物一覧</h1>
        <button className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          + 建物を登録
        </button>
      </div>

      <div className="flex gap-2 text-sm">
        <button className="rounded-full bg-blue-100 px-3 py-1 text-blue-800">
          すべて
        </button>
        <button className="rounded-full bg-gray-100 px-3 py-1 text-gray-600 hover:bg-gray-200">
          監視中のみ
        </button>
        <button className="rounded-full bg-gray-100 px-3 py-1 text-gray-600 hover:bg-gray-200">
          募集中あり
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mansions.map((mansion) => (
          <Link key={mansion.id} href={`/mansions/${mansion.id}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-gray-900">
                      {mansion.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {mansion.nearest_station} 徒歩{mansion.walking_minutes}分
                    </p>
                    <p className="text-xs text-gray-400">
                      {mansion.construction_date} / {mansion.floors}階建 /{" "}
                      {mansion.total_units}戸
                    </p>
                  </div>
                  {mansion.is_watched && (
                    <span className="ml-2 flex-shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      監視中
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {mansion.active_listings_count > 0 && (
                    <StatusTag status="active" />
                  )}
                  {mansion.active_listings_count === 0 &&
                    mansion.last_listing_date && <StatusTag status="past" />}
                  {!mansion.last_listing_date && (
                    <StatusTag status="unknown" />
                  )}
                  {mansion.recent_listings_count > 0 && (
                    <StatusTag status="new" />
                  )}
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 text-center">
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {mansion.active_listings_count}
                    </p>
                    <p className="text-xs text-gray-500">募集中</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {mansion.known_unit_types_count}
                    </p>
                    <p className="text-xs text-gray-500">確認タイプ</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {mansion.recent_listings_count}
                    </p>
                    <p className="text-xs text-gray-500">30日新着</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
