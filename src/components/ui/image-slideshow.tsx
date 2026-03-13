"use client";

import { useState, useCallback } from "react";

interface ImageData {
  url: string;
  type: string;
  caption: string | null;
}

interface ImageSlideshowProps {
  images: ImageData[];
  alt: string;
  className?: string;
  /** サムネイルストリップを表示するか（詳細ページ用） */
  showThumbnails?: boolean;
}

export function ImageSlideshow({ images, alt, className = "", showThumbnails = false }: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgError, setImgError] = useState<Set<string>>(new Set());

  const validImages = images.filter((img) => !imgError.has(img.url));
  const safeIndex = Math.min(currentIndex, Math.max(0, validImages.length - 1));

  const goTo = useCallback((idx: number) => {
    setCurrentIndex(idx);
  }, []);

  const goPrev = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev <= 0 ? validImages.length - 1 : prev - 1));
  }, [validImages.length]);

  const goNext = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev >= validImages.length - 1 ? 0 : prev + 1));
  }, [validImages.length]);

  if (validImages.length === 0) return null;

  // コンパクトモード（一覧カードなど）
  if (!showThumbnails) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {validImages.map((img, i) => (
          <img
            key={img.url}
            src={img.url}
            alt={i === 0 ? alt : `${alt} - ${i + 1}`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              i === safeIndex ? "opacity-100" : "opacity-0"
            }`}
            loading={i === 0 ? "eager" : "lazy"}
            onError={() => setImgError((prev) => new Set(prev).add(img.url))}
          />
        ))}

        {/* 左右ボタン */}
        {validImages.length > 1 && (
          <>
            <button onClick={goPrev} className="absolute left-1 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white opacity-0 transition-opacity hover:bg-black/50 group-hover:opacity-100 [div:hover>&]:opacity-100">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
            <button onClick={goNext} className="absolute right-1 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white opacity-0 transition-opacity hover:bg-black/50 group-hover:opacity-100 [div:hover>&]:opacity-100">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
          </>
        )}

        {/* ドットインジケーター */}
        {validImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            {validImages.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(i); }}
                className={`h-1.5 rounded-full transition-all ${
                  i === safeIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // サムネイル付きモード（建物詳細ページ用）
  return (
    <div className={`overflow-hidden ${className}`}>
      {/* メイン画像エリア */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-gray-100">
        {validImages.map((img, i) => (
          <img
            key={img.url}
            src={img.url}
            alt={i === 0 ? alt : `${alt} - ${i + 1}`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              i === safeIndex ? "opacity-100" : "opacity-0"
            }`}
            loading={i === 0 ? "eager" : "lazy"}
            onError={() => setImgError((prev) => new Set(prev).add(img.url))}
          />
        ))}

        {/* 左右ナビ */}
        {validImages.length > 1 && (
          <>
            <button onClick={goPrev} className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
            <button onClick={goNext} className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
          </>
        )}

        {/* カウンター */}
        <div className="absolute bottom-2 right-3">
          <span className="rounded-full bg-black/40 px-2.5 py-1 text-[12px] tabular-nums text-white backdrop-blur-sm">
            {safeIndex + 1} / {validImages.length}
          </span>
        </div>
      </div>

      {/* サムネイルストリップ */}
      {validImages.length > 1 && (
        <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {validImages.map((img, i) => (
            <button
              key={img.url}
              onClick={() => goTo(i)}
              className={`shrink-0 overflow-hidden rounded-md transition-all ${
                i === safeIndex
                  ? "ring-2 ring-[#007aff] ring-offset-1"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img.url}
                alt={`${alt} - ${i + 1}`}
                className="h-14 w-20 object-cover"
                loading="lazy"
                onError={() => setImgError((prev) => new Set(prev).add(img.url))}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
