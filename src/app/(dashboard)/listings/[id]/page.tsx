import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { StatusTag } from "@/components/ui/status-tag";
import { RentHistoryChart } from "@/components/chart/rent-history-chart";
import {
  getListingById,
  getUnitById,
  getMansionById,
  getListingsByUnitId,
  getUnitsByMansionId,
} from "@/lib/queries";

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) notFound();

  const unit = await getUnitById(listing.unit_id);
  const mansion = unit ? await getMansionById(unit.mansion_id) : null;

  // 同ユニットの過去掲載履歴
  const unitListings = unit ? await getListingsByUnitId(unit.id) : [];
  const pastListings = unitListings.filter(
    (l) => l.id !== listing.id && l.status !== "active"
  );

  // 同建物の他の募集中住戸
  const allUnits = mansion ? await getUnitsByMansionId(mansion.id) : [];
  const otherActiveListings: Array<{
    listing: typeof listing;
    unitName: string;
    unitId: string;
  }> = [];
  for (const u of allUnits) {
    if (u.id === unit?.id) continue;
    const uListings = await getListingsByUnitId(u.id);
    for (const l of uListings) {
      if (l.status === "active") {
        otherActiveListings.push({
          listing: l,
          unitName: `${u.layout_type} / ${u.size_sqm}㎡`,
          unitId: u.id,
        });
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* パンくず */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/mansions" className="hover:text-gray-700">
          建物一覧
        </Link>
        <span>/</span>
        {mansion && (
          <>
            <Link
              href={`/mansions/${mansion.id}`}
              className="hover:text-gray-700"
            >
              {mansion.name}
            </Link>
            <span>/</span>
          </>
        )}
        {unit && (
          <>
            <Link href={`/units/${unit.id}`} className="hover:text-gray-700">
              {unit.layout_type} {unit.size_sqm}㎡
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900">募集詳細</span>
      </div>

      {/* 募集情報 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{mansion?.name}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {unit?.layout_type} / {unit?.size_sqm}㎡ / {listing.floor}F
        </p>
        <div className="mt-2">
          <StatusTag
            status={listing.status === "active" ? "active" : "ended"}
          />
        </div>
      </div>

      {/* 賃料情報 */}
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div>
              <p className="text-sm text-gray-500">賃料</p>
              <p className="text-2xl font-bold text-blue-600">
                {(listing.current_rent / 10000).toFixed(1)}万円
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">管理費</p>
              <p className="text-xl font-bold text-gray-900">
                {listing.management_fee
                  ? `${listing.management_fee.toLocaleString()}円`
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">所在階</p>
              <p className="text-xl font-bold text-gray-900">
                {listing.floor || "-"}F
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">間取り</p>
              <p className="text-xl font-bold text-gray-900">
                {unit?.layout_type} / {unit?.size_sqm}㎡
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 掲載情報 */}
      <Card>
        <CardContent>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            掲載情報
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">掲載元</span>
              <span className="font-medium text-gray-900">
                {listing.source_site || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">検知日時</span>
              <span className="font-medium text-gray-900">
                {new Date(listing.detected_at).toLocaleString("ja-JP")}
              </span>
            </div>
            {listing.ended_at && (
              <div className="flex justify-between">
                <span className="text-gray-500">終了日</span>
                <span className="font-medium text-gray-900">
                  {new Date(listing.ended_at).toLocaleDateString("ja-JP")}
                </span>
              </div>
            )}
            {listing.source_url && (
              <div className="flex justify-between">
                <span className="text-gray-500">掲載元URL</span>
                <a
                  href={listing.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  外部サイトで見る &rarr;
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 賃料推移グラフ */}
      {unitListings.length > 0 && <RentHistoryChart listings={unitListings} />}

      {/* このタイプの過去掲載履歴 */}
      {pastListings.length > 0 && (
        <Card>
          <CardContent>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              このタイプの過去掲載履歴
            </h2>
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
                  {pastListings.map((pl) => (
                    <tr key={pl.id}>
                      <td className="py-2">
                        {new Date(pl.detected_at).toLocaleDateString("ja-JP")}
                      </td>
                      <td className="py-2 font-medium">
                        {(pl.current_rent / 10000).toFixed(1)}万円
                      </td>
                      <td className="py-2">
                        {pl.management_fee
                          ? `${(pl.management_fee / 10000).toFixed(1)}万円`
                          : "-"}
                      </td>
                      <td className="py-2">{pl.floor || "-"}F</td>
                      <td className="py-2">{pl.source_site || "-"}</td>
                      <td className="py-2">
                        {pl.ended_at
                          ? new Date(pl.ended_at).toLocaleDateString("ja-JP")
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 同建物の他の募集中住戸 */}
      {otherActiveListings.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            同建物の他の募集中住戸
          </h2>
          <div className="space-y-3">
            {otherActiveListings.map((item) => (
              <Link key={item.listing.id} href={`/listings/${item.listing.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {item.unitName} / {item.listing.floor}F
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          {(item.listing.current_rent / 10000).toFixed(1)}万円
                        </p>
                        <p className="text-xs text-gray-400">
                          掲載元: {item.listing.source_site}
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

      {/* 建物情報リンク */}
      <div className="flex gap-3">
        {mansion && (
          <Link
            href={`/mansions/${mansion.id}`}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            &larr; 建物詳細に戻る
          </Link>
        )}
        {unit && (
          <Link
            href={`/units/${unit.id}`}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            &larr; 間取りタイプ詳細に戻る
          </Link>
        )}
      </div>
    </div>
  );
}
