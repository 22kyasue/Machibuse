"use client";

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 既にインストール済みまたは非表示設定なら表示しない
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (localStorage.getItem("pwa-install-dismissed")) return;

    // Android/Chrome: beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS Safari判定
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    if (isIOS && isSafari) {
      setShowIOSGuide(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  }

  function handleDismiss() {
    setDismissed(true);
    setDeferredPrompt(null);
    setShowIOSGuide(false);
    localStorage.setItem("pwa-install-dismissed", "1");
  }

  if (dismissed) return null;
  if (!deferredPrompt && !showIOSGuide) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
      <div className="mx-auto max-w-lg px-4 pb-4">
        <div className="rounded-2xl bg-slate-900 p-4 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">
                アプリをインストール
              </p>
              {deferredPrompt ? (
                <p className="mt-0.5 text-xs text-slate-400">
                  ホーム画面に追加してアプリとして使えます
                </p>
              ) : (
                <p className="mt-0.5 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.75 7h-3V1.798c0-.453-.32-.798-.75-.798s-.75.345-.75.798V7h-3L10 12l3.75-5z" />
                      <path d="M4 14h12v3H4z" />
                    </svg>
                    共有ボタン
                  </span>
                  {" → 「ホーム画面に追加」で完了"}
                </p>
              )}
            </div>
            <button
              onClick={handleDismiss}
              className="shrink-0 text-slate-500 hover:text-slate-300"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {deferredPrompt && (
            <button
              onClick={handleInstall}
              className="mt-3 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white active:bg-blue-700"
            >
              インストール
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
