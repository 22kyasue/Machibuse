"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  type UserPreferences,
  DEFAULT_PREFERENCES,
  savePreferences,
  loadPreferences,
  hasPreferences,
  AREA_OPTIONS,
  LAYOUT_OPTIONS,
  FEATURE_CATEGORIES,
} from "@/lib/preferences";

const RENT_PRESETS = [
  { label: "~15万", min: null, max: 15 },
  { label: "15~25万", min: 15, max: 25 },
  { label: "25~40万", min: 25, max: 40 },
  { label: "40~60万", min: 40, max: 60 },
  { label: "60万~", min: 60, max: null },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [mounted, setMounted] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadPreferences();
    if (hasPreferences(loaded)) {
      setPrefs(loaded);
      setIsEdit(true);
    }
    setMounted(true);
  }, []);

  if (!mounted) return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
    </div>
  );

  function toggleArea(area: string) {
    setPrefs((prev) => ({
      ...prev,
      areas: prev.areas.includes(area)
        ? prev.areas.filter((a) => a !== area)
        : [...prev.areas, area],
    }));
  }

  function toggleLayout(layout: string) {
    setPrefs((prev) => ({
      ...prev,
      layouts: prev.layouts.includes(layout)
        ? prev.layouts.filter((l) => l !== layout)
        : [...prev.layouts, layout],
    }));
  }

  function toggleFeature(feature: string) {
    setPrefs((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  }

  function selectRentPreset(preset: { min: number | null; max: number | null }) {
    setPrefs((prev) => ({
      ...prev,
      rentMin: preset.min,
      rentMax: preset.max,
    }));
  }

  function handleNext() {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      savePreferences(prefs);
      router.push("/mansions");
    }
  }

  function handleSkip() {
    savePreferences(DEFAULT_PREFERENCES);
    router.push("/mansions");
  }

  const steps = [
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      ),
      title: "エリアを選択",
      subtitle: "気になるエリアをタップ",
      content: (
        <div className="flex flex-wrap justify-center gap-2.5">
          {AREA_OPTIONS.map((area) => {
            const selected = prefs.areas.includes(area);
            return (
              <button
                key={area}
                onClick={() => toggleArea(area)}
                className={`rounded-full px-5 py-2.5 text-[14px] font-medium transition-all duration-200 ${
                  selected
                    ? "bg-white text-[#0a0a0f] shadow-[0_0_20px_rgba(255,255,255,0.15)] scale-105"
                    : "bg-white/[0.06] text-white/60 border border-white/[0.08] hover:bg-white/[0.1] hover:text-white/80"
                }`}
              >
                {selected && <span className="mr-1 text-emerald-500">&#10003;</span>}
                {area}
              </button>
            );
          })}
        </div>
      ),
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6z" />
        </svg>
      ),
      title: "間取りを選択",
      subtitle: "希望の間取りタイプ",
      content: (
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          {LAYOUT_OPTIONS.map((layout) => {
            const selected = prefs.layouts.includes(layout);
            return (
              <button
                key={layout}
                onClick={() => toggleLayout(layout)}
                className={`rounded-2xl px-4 py-3.5 text-[15px] font-semibold transition-all duration-200 ${
                  selected
                    ? "bg-white text-[#0a0a0f] shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                    : "bg-white/[0.06] text-white/60 border border-white/[0.08] hover:bg-white/[0.1] hover:text-white/80"
                }`}
              >
                {layout}
              </button>
            );
          })}
        </div>
      ),
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "予算を設定",
      subtitle: "月額の予算感",
      content: (
        <div className="space-y-4">
          <div className="flex flex-wrap justify-center gap-2.5">
            {RENT_PRESETS.map((preset) => {
              const selected = prefs.rentMin === preset.min && prefs.rentMax === preset.max;
              return (
                <button
                  key={preset.label}
                  onClick={() => selectRentPreset(preset)}
                  className={`rounded-2xl px-5 py-3 text-[14px] font-semibold transition-all duration-200 ${
                    selected
                      ? "bg-white text-[#0a0a0f] shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                      : "bg-white/[0.06] text-white/60 border border-white/[0.08] hover:bg-white/[0.1] hover:text-white/80"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3 mx-auto max-w-xs">
            <input
              type="number"
              min={0}
              placeholder="下限"
              value={prefs.rentMin ?? ""}
              onChange={(e) => setPrefs((prev) => ({ ...prev, rentMin: e.target.value === "" ? null : Number(e.target.value) }))}
              className="w-full rounded-2xl bg-white/[0.06] border border-white/[0.08] px-4 py-3 text-center text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10 transition-all"
            />
            <span className="text-white/30 text-sm shrink-0">~</span>
            <input
              type="number"
              min={0}
              placeholder="上限"
              value={prefs.rentMax ?? ""}
              onChange={(e) => setPrefs((prev) => ({ ...prev, rentMax: e.target.value === "" ? null : Number(e.target.value) }))}
              className="w-full rounded-2xl bg-white/[0.06] border border-white/[0.08] px-4 py-3 text-center text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10 transition-all"
            />
            <span className="text-white/40 text-xs shrink-0">万円</span>
          </div>
        </div>
      ),
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      ),
      title: "こだわり条件",
      subtitle: "譲れないポイント",
      content: (
        <div className="mx-auto max-w-md space-y-2 max-h-[320px] overflow-y-auto scrollbar-thin pr-1">
          {FEATURE_CATEGORIES.map((category) => {
            const isExpanded = expandedCategory === category.label;
            const selectedCount = category.options.filter((o) => prefs.features.includes(o)).length;
            return (
              <div key={category.label} className="rounded-2xl bg-white/[0.04] border border-white/[0.06] overflow-hidden transition-all">
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : category.label)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-[14px] font-medium text-white/80">{category.label}</span>
                    {selectedCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#0a0a0f]">
                        {selectedCount}
                      </span>
                    )}
                  </div>
                  <svg className={`h-4 w-4 text-white/30 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isExpanded && (
                  <div className="flex flex-wrap gap-2 px-4 pb-3 animate-fade-in">
                    {category.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => toggleFeature(option)}
                        className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all duration-200 ${
                          prefs.features.includes(option)
                            ? "bg-white text-[#0a0a0f]"
                            : "bg-white/[0.06] text-white/50 hover:bg-white/[0.1] hover:text-white/70"
                        }`}
                      >
                        {prefs.features.includes(option) && <span className="mr-1 text-emerald-500">&#10003;</span>}
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ),
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
      ),
      title: "最終調整",
      subtitle: "駅徒歩と広さ",
      content: (
        <div className="mx-auto max-w-xs space-y-5">
          <div>
            <label className="mb-2 block text-[13px] font-medium text-white/40">駅徒歩（分以内）</label>
            <div className="flex gap-2">
              {[5, 7, 10, 15, 20].map((min) => (
                <button
                  key={min}
                  onClick={() => setPrefs((prev) => ({ ...prev, walkingMax: prev.walkingMax === min ? null : min }))}
                  className={`flex-1 rounded-2xl py-3 text-[14px] font-semibold transition-all duration-200 ${
                    prefs.walkingMax === min
                      ? "bg-white text-[#0a0a0f]"
                      : "bg-white/[0.06] text-white/50 border border-white/[0.08] hover:bg-white/[0.1]"
                  }`}
                >
                  {min}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-[13px] font-medium text-white/40">広さ下限（m&#178;）</label>
            <div className="flex gap-2">
              {[20, 30, 40, 50, 60].map((size) => (
                <button
                  key={size}
                  onClick={() => setPrefs((prev) => ({ ...prev, sizeMin: prev.sizeMin === size ? null : size }))}
                  className={`flex-1 rounded-2xl py-3 text-[14px] font-semibold transition-all duration-200 ${
                    prefs.sizeMin === size
                      ? "bg-white text-[#0a0a0f]"
                      : "bg-white/[0.06] text-white/50 border border-white/[0.08] hover:bg-white/[0.1]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];
  const isLast = step === steps.length - 1;
  const selectedCount = prefs.areas.length + prefs.layouts.length + prefs.features.length +
    (prefs.rentMin !== null || prefs.rentMax !== null ? 1 : 0) +
    (prefs.walkingMax !== null ? 1 : 0) + (prefs.sizeMin !== null ? 1 : 0);

  return (
    <div className="relative flex min-h-screen flex-col bg-[#0a0a0f] text-white overflow-hidden">
      {/* Ambient light effects */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/[0.07] blur-[120px] animate-float" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/[0.05] blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-cyan-500/[0.03] blur-[150px]" />
      </div>

      {/* Grain overlay */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.015] bg-[url('data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%27.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E')]" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <div>
          <h1 className="text-[20px] font-bold tracking-[0.15em] text-white/90">
            MACHIBUSE
          </h1>
        </div>
        <button
          onClick={handleSkip}
          className="text-[13px] font-medium text-white/40 hover:text-white/60 transition-colors"
        >
          {isEdit ? "変更せず戻る" : "スキップ"}
        </button>
      </header>

      {/* Progress */}
      <div className="relative z-10 px-6">
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className="h-[3px] flex-1 rounded-full overflow-hidden bg-white/[0.06]"
            >
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  i < step
                    ? "w-full bg-white/60"
                    : i === step
                    ? "w-full bg-gradient-to-r from-white/80 to-white/40"
                    : "w-0"
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col px-6 pt-10 pb-6">
        <div key={step} className="animate-fade-in flex-1">
          {/* Step header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-white/[0.06] p-3 backdrop-blur-sm">
              <div className="text-white/70">{currentStep.icon}</div>
            </div>
            <h2 className="text-[24px] font-bold tracking-tight">
              {currentStep.title}
            </h2>
            <p className="mt-1.5 text-[14px] text-white/40">
              {currentStep.subtitle}
            </p>
          </div>

          {/* Step content */}
          <div className="mx-auto max-w-lg">
            {currentStep.content}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex items-center justify-between">
          <div>
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 text-[14px] font-medium text-white/40 hover:text-white/60 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                戻る
              </button>
            )}
          </div>
          <div className="flex items-center gap-4">
            {selectedCount > 0 && (
              <span className="text-[12px] text-white/30">{selectedCount}件選択中</span>
            )}
            <button
              onClick={handleNext}
              className="group relative overflow-hidden rounded-full bg-white px-8 py-3 text-[14px] font-bold text-[#0a0a0f] shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10">{isLast ? "物件を探す" : "次へ"}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
