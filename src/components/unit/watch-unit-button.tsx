"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface WatchUnitButtonProps {
  unitId: string;
  initialIsWatched: boolean;
}

export function WatchUnitButton({
  unitId,
  initialIsWatched,
}: WatchUnitButtonProps) {
  const [isWatched, setIsWatched] = useState(initialIsWatched);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      if (isWatched) {
        // 監視解除: まずGETでentryを探し、DELETEで解除
        const res = await fetch("/api/watchlists");
        if (!res.ok) throw new Error("監視リストの取得に失敗しました");
        const entries = await res.json();
        const entry = entries.find(
          (e: { target_unit_id: string | null; is_active: boolean }) =>
            e.target_unit_id === unitId
        );
        if (!entry) throw new Error("監視エントリが見つかりません");

        const deleteRes = await fetch("/api/watchlists", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: entry.id }),
        });
        if (!deleteRes.ok) throw new Error("監視解除に失敗しました");

        setIsWatched(false);
      } else {
        // 監視追加
        const res = await fetch("/api/watchlists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target_unit_id: unitId }),
        });
        if (!res.ok) throw new Error("監視追加に失敗しました");

        setIsWatched(true);
      }
    } catch (error) {
      console.error("監視トグルエラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isWatched ? "secondary" : "primary"}
      onClick={handleToggle}
      disabled={isLoading}
    >
      {isLoading
        ? "処理中..."
        : isWatched
          ? "監視中"
          : "この間取りを監視する"}
    </Button>
  );
}
