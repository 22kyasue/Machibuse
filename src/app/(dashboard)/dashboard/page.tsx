import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { StatusTag } from "@/components/ui/status-tag";
import { getDashboardData } from "@/lib/queries";

export default async function DashboardPage() {
  const {
    watchedMansions,
    unreadNotifications,
    activeMansions,
    totalActiveListings,
    notifications,
  } = await getDashboardData();

  const summaryCards = [
    {
      label: "現在募集中",
      value: totalActiveListings,
      sub: `${activeMansions.length}棟`,
      gradient: "from-blue-500 to-blue-400",
    },
    {
      label: "監視中",
      value: watchedMansions.length,
      sub: "建物",
      gradient: "from-rose-500 to-rose-400",
    },
    {
      label: "未読通知",
      value: unreadNotifications.length,
      sub: "件",
      gradient: "from-amber-500 to-amber-400",
    },
    {
      label: "掲載中の建物",
      value: activeMansions.length,
      sub: "棟",
      gradient: "from-emerald-500 to-emerald-400",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <h1 className="text-gradient text-3xl font-black tracking-tight">
          ダッシュボード
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
          あなたの物件トラッキング状況
        </p>
      </div>

      {/* クイックアクション */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Link
          href="/mansions"
          className="card-shine group flex flex-col items-center gap-2.5 rounded-xl border border-slate-200/60 bg-white/80 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-50">
            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-slate-700">物件を探す</span>
        </Link>
        <Link
          href="/watchlist"
          className="card-shine group flex flex-col items-center gap-2.5 rounded-xl border border-slate-200/60 bg-white/80 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-50 to-pink-50">
            <svg className="h-5 w-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-slate-700">ウォッチリスト</span>
        </Link>
        <Link
          href="/onboarding"
          className="card-shine group flex flex-col items-center gap-2.5 rounded-xl border border-slate-200/60 bg-white/80 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-50 to-orange-50">
            <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
          </div>
          <span className="text-sm font-medium text-slate-700">条件を変更</span>
        </Link>
        <Link
          href="/notifications"
          className="card-shine group flex flex-col items-center gap-2.5 rounded-xl border border-slate-200/60 bg-white/80 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-teal-50">
            <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </div>
          <span className="text-sm font-medium text-slate-700">通知</span>
        </Link>
      </div>

      {/* サマリカード */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summaryCards.map((card, i) => (
          <div
            key={card.label}
            className="animate-fade-in-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <Card className="overflow-hidden transition-transform duration-200 hover:scale-[1.02]">
              <div className={`h-1 rounded-t-xl bg-gradient-to-r ${card.gradient}`} />
              <CardContent>
                <p className="text-sm font-medium text-slate-500">
                  {card.label}
                </p>
                <p className="mt-2 text-4xl font-black tabular-nums tracking-tight text-slate-900">
                  {card.value}
                </p>
                <p className="mt-1 text-xs text-slate-400">{card.sub}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 監視中の建物 */}
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "500ms" }}
        >
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-slate-900">
                    監視中の建物
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
                </div>
                <Link
                  href="/watchlist"
                  className="link-underline text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
                >
                  すべて見る
                </Link>
              </div>
              <div className="mt-4 space-y-2">
                {watchedMansions.length === 0 ? (
                  <div className="rounded-lg bg-slate-50/80 py-8 text-center">
                    <svg className="mx-auto h-8 w-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="mt-2 text-sm text-slate-500">
                      監視中の建物はまだありません
                    </p>
                    <Link
                      href="/mansions"
                      className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
                    >
                      建物一覧から追加
                    </Link>
                  </div>
                ) : (
                  watchedMansions.map((mansion) => (
                    <Link
                      key={mansion.id}
                      href={`/mansions/${mansion.id}`}
                      className="flex items-center justify-between rounded-lg border border-slate-100 p-3 transition-all duration-200 hover:bg-slate-50/80 hover:shadow-sm"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          {mansion.name}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {mansion.nearest_station} 徒歩
                          {mansion.walking_minutes}分
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {mansion.active_listings_count > 0 && (
                          <StatusTag status="active" />
                        )}
                        <span className="text-slate-400">&rarr;</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 新着通知 */}
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "600ms" }}
        >
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-slate-900">
                    新着通知
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
                </div>
                <Link
                  href="/notifications"
                  className="link-underline text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
                >
                  すべて見る
                </Link>
              </div>
              <div className="mt-4 space-y-2">
                {notifications.length === 0 ? (
                  <div className="rounded-lg bg-slate-50/80 py-8 text-center">
                    <svg className="mx-auto h-8 w-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                    <p className="mt-2 text-sm text-slate-500">
                      新しい通知はありません
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      空室が見つかると自動でお知らせします
                    </p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <Link
                      key={notification.id}
                      href={
                        notification.listing_id
                          ? `/listings/${notification.listing_id}`
                          : "#"
                      }
                      className={`block rounded-lg border p-3 transition-all duration-200 hover:bg-slate-50/80 hover:shadow-sm ${
                        !notification.is_read
                          ? "border-slate-200/60 bg-blue-50/30"
                          : "border-slate-200/60"
                      }`}
                    >
                      <p className="text-sm font-medium text-slate-900">
                        {notification.title}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-600">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {new Date(notification.created_at).toLocaleString("ja-JP")}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
