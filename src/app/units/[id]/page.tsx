import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { StatusTag } from "@/components/ui/status-tag";
import { Button } from "@/components/ui/button";
import {
  getUnitById,
  getMansionById,
  getListingsByUnitId,
  getUnitsByMansionId,
} from "@/lib/mock-data";

export default async function UnitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const unit = getUnitById(id);
  if (!unit) notFound();

  const mansion = getMansionById(unit.mansion_id);
  const listings = getListingsByUnitId(unit.id);
  const activeListings = listings.filter((l) => l.status === "active");
  const pastListings = listings.filter((l) => l.status !== "active");

  // 類似住戸
  const allUnits = getUnitsByMansionId(unit.mansion_id);
  const similarUnits = allUnits.filter(
    (u) =>
      u.id !== unit.id &&
      (u.layout_type === unit.layout_type ||
        Math.abs(u.size_sqm - unit.size_sqm) < 15)
  );

  return (
    <div className="space-y-6">
      {/* パンくず */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/mansions" className="hover:text-gray-700">
          建物一覧
        </Link>
        <span>/</span>
        <Link
          href={`/mansions/${unit.mansion_id}`}
          className="hover:text-gray-700"
        >
          {mansion?.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900">
          {unit.layout_type} {unit.size_sqm}㎡
        </span>
      </div>

      {/* タイプ要約ヘッダー */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {unit.layout_type} / {unit.size_sqm}㎡ / {unit.direction}向き /{" "}
            {unit.floor_range}
          </h1>
          <p className="mt-1 text-sm text-gray-500">{mansion?.name}</p>
          <div className="mt-2 flex gap-2">
            <StatusTag status={unit.status} />
          </div>
        </div>
        <Button variant={unit.is_watched ? "secondary" : "primary"}>
          {unit.is_watched ? "監視中" : "この間取りを監視する"}
        </Button>
      </div>

      {/* 間取り図プレースホルダー */}
      <Card>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
            <p className="text-gray-400">間取り図（未登録）</p>
          </div>
        </CardContent>
      </Card>

      {/* 現在の状態 */}
      <Card>
        <CardContent>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            現在の状態
          </h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">ステータス</p>
              <StatusTag status={unit.status} className="mt-1" />
            </div>
            <div>
              <p className="text-gray-500">直近掲載日</p>
              <p className="font-bold text-gray-900">
                {unit.last_listing_date || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">直近賃料</p>
              <p className="font-bold text-gray-900">
                {unit.last_rent_amount
                  ? `${(unit.last_rent_amount / 10000).toFixed(1)}万円`
                  : "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 現在募集中 */}
      {activeListings.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            現在募集中
          </h2>
          <div className="space-y-3">
            {activeListings.map((listing) => (
              <Link key={listing.id} href={`/listings/${listing.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-blue-600">
                          {(listing.current_rent / 10000).toFixed(1)}万円
                          <span className="ml-1 text-sm font-normal text-gray-500">
                            + 管理費
                            {listing.management_fee
                              ? `${(listing.management_fee / 10000).toFixed(1)}万円`
                              : "-"}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">
                          {listing.floor}F / 掲載元: {listing.source_site}
                        </p>
                        <p className="text-xs text-gray-400">
                          検知:{" "}
                          {new Date(listing.detected_at).toLocaleDateString(
                            "ja-JP"
                          )}
                        </p>
                      </div>
                      <span className="text-gray-400">&rarr;</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 過去募集履歴 */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          過去募集履歴
        </h2>
        {pastListings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 text-gray-500">
                <tr>
                  <th className="pb-2 font-medium">掲載日</th>
                  <th className="pb-2 font-medium">賃料</th>
                  <th className="pb-2 font-medium">管理費</th>
                  <th className="pb-2 font-medium">階</th>
                  <th className="pb-2 font-medium">掲載元</th>
                  <th className="pb-2 font-medium">終了日</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pastListings.map((listing) => (
                  <tr key={listing.id}>
                    <td className="py-2">
                      {new Date(listing.detected_at).toLocaleDateString(
                        "ja-JP"
                      )}
                    </td>
                    <td className="py-2 font-medium">
                      {(listing.current_rent / 10000).toFixed(1)}万円
                    </td>
                    <td className="py-2">
                      {listing.management_fee
                        ? `${(listing.management_fee / 10000).toFixed(1)}万円`
                        : "-"}
                    </td>
                    <td className="py-2">{listing.floor || "-"}F</td>
                    <td className="py-2">{listing.source_site || "-"}</td>
                    <td className="py-2">
                      {listing.ended_at
                        ? new Date(listing.ended_at).toLocaleDateString("ja-JP")
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">過去の募集履歴はありません</p>
        )}
      </div>

      {/* 類似住戸 */}
      {similarUnits.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            類似住戸タイプ
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {similarUnits.map((su) => (
              <Link key={su.id} href={`/units/${su.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent>
                    <p className="font-semibold text-gray-900">
                      {su.layout_type} / {su.size_sqm}㎡ / {su.direction}向き
                    </p>
                    <div className="mt-1 flex gap-1.5">
                      <StatusTag status={su.status} />
                    </div>
                    {su.last_rent_amount && (
                      <p className="mt-1 text-sm text-gray-500">
                        直近賃料:{" "}
                        {(su.last_rent_amount / 10000).toFixed(1)}万円
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
