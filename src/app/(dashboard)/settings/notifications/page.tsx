"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotificationSettingsPage() {
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [email, setEmail] = useState("");
  const [newListing, setNewListing] = useState(true);
  const [priceChange, setPriceChange] = useState(true);
  const [ended, setEnded] = useState(false);
  const [relisted, setRelisted] = useState(true);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings/notifications");
        if (!res.ok) throw new Error("取得失敗");
        const data = await res.json();
        setEmailEnabled(data.email_enabled);
        setEmail(data.email_address ?? "");
        setNewListing(data.notify_new_listing);
        setPriceChange(data.notify_price_change);
        setEnded(data.notify_ended);
        setRelisted(data.notify_relisted);
      } catch {
        // デフォルト値のまま
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email_enabled: emailEnabled,
          email_address: email,
          notify_new_listing: newListing,
          notify_price_change: priceChange,
          notify_ended: ended,
          notify_relisted: relisted,
        }),
      });
      if (!res.ok) throw new Error("保存失敗");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("設定の保存に失敗しました。もう一度お試しください。");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center text-slate-500">
        読み込み中...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="animate-fade-in text-2xl font-bold text-slate-900">通知設定</h1>

      {/* メール通知 */}
      <Card>
        <CardContent>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            メール通知
          </h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm text-slate-600">メール通知を有効にする</span>
              <button
                onClick={() => setEmailEnabled(!emailEnabled)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  emailEnabled ? "bg-slate-900" : "bg-slate-200"
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    emailEnabled ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </label>
            {emailEnabled && (
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  通知先メールアドレス
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-500/20"
                  placeholder="you@example.com"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 通知種別 */}
      <Card>
        <CardContent>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            通知する内容
          </h2>
          <div className="space-y-3">
            {[
              { label: "新着募集", desc: "監視中の建物・間取りに新しい募集が出た時", value: newListing, set: setNewListing },
              { label: "賃料変更", desc: "募集中の物件の賃料が変更された時", value: priceChange, set: setPriceChange },
              { label: "募集終了", desc: "監視中の募集が終了した時", value: ended, set: setEnded },
              { label: "再掲載", desc: "過去に終了した募集が再掲載された時", value: relisted, set: setRelisted },
            ].map((item) => (
              <label key={item.label} className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <button
                  onClick={() => item.set(!item.value)}
                  className={`relative mt-0.5 h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
                    item.value ? "bg-slate-900" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      item.value ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 保存 */}
      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "保存中..." : "設定を保存"}
        </Button>
        {saved && (
          <span className="text-sm text-green-600">保存しました</span>
        )}
      </div>
    </div>
  );
}
