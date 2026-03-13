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

  const stats = [
    { label: "募集中", value: totalActiveListings, icon: "search", color: "bg-blue-500" },
    { label: "監視中", value: watchedMansions.length, icon: "eye", color: "bg-rose-500" },
    { label: "未読", value: unreadNotifications.length, icon: "bell", color: "bg-amber-500" },
    { label: "建物数", value: activeMansions.length, icon: "building", color: "bg-emerald-500" },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">
          ダッシュボード
        </h1>
        <p className="mt-0.5 text-[13px] text-slate-400">
          物件トラッキング状況
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 animate-fade-in-up">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center gap-2.5">
              <div className={`h-2 w-2 rounded-full ${stat.color}`} />
              <span className="text-[12px] font-medium text-slate-400">{stat.label}</span>
            </div>
            <p className="mt-2 text-[32px] font-bold tabular-nums tracking-tight text-slate-900 leading-none">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-2 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
        {[
          { href: "/mansions", label: "物件を探す", icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" },
          { href: "/watchlist", label: "監視リスト", icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" },
          { href: "/onboarding", label: "条件変更", icon: "M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" },
          { href: "/notifications", label: "通知", icon: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 border border-slate-100 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
            </svg>
            <span className="text-[11px] font-medium text-slate-600">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Two column */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Watched */}
        <Card className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-bold text-slate-900">監視中</h2>
              <Link href="/watchlist" className="text-[12px] font-medium text-slate-400 hover:text-slate-600 transition-colors">
                すべて
              </Link>
            </div>
            <div className="space-y-1.5">
              {watchedMansions.length === 0 ? (
                <div className="rounded-xl bg-slate-50 py-8 text-center">
                  <p className="text-[13px] text-slate-400">監視中の建物なし</p>
                  <Link href="/mansions" className="mt-1 inline-block text-[12px] font-medium text-blue-500 hover:underline">
                    物件一覧から追加
                  </Link>
                </div>
              ) : (
                watchedMansions.map((mansion) => (
                  <Link
                    key={mansion.id}
                    href={`/mansions/${mansion.id}`}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50"
                  >
                    <div>
                      <p className="text-[13px] font-semibold text-slate-800">{mansion.name}</p>
                      <p className="text-[11px] text-slate-400">
                        {mansion.nearest_station} 徒歩{mansion.walking_minutes}分
                      </p>
                    </div>
                    {mansion.active_listings_count > 0 && <StatusTag status="active" />}
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-bold text-slate-900">通知</h2>
              <Link href="/notifications" className="text-[12px] font-medium text-slate-400 hover:text-slate-600 transition-colors">
                すべて
              </Link>
            </div>
            <div className="space-y-1.5">
              {notifications.length === 0 ? (
                <div className="rounded-xl bg-slate-50 py-8 text-center">
                  <p className="text-[13px] text-slate-400">新しい通知なし</p>
                  <p className="mt-0.5 text-[11px] text-slate-300">空室が見つかると自動でお知らせ</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={n.listing_id ? `/listings/${n.listing_id}` : "#"}
                    className={`block rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50 ${
                      !n.is_read ? "bg-blue-50/40" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.is_read && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />}
                      <div>
                        <p className="text-[13px] font-medium text-slate-800">{n.title}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{n.message}</p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
