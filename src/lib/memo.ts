const STORAGE_KEY = "machibuse_memos";

export interface PropertyMemo {
  mansionId: string;
  text: string;
  updatedAt: string;
}

export function getMemos(): Record<string, PropertyMemo> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function getMemo(mansionId: string): string {
  const memos = getMemos();
  return memos[mansionId]?.text || "";
}

export function saveMemo(mansionId: string, text: string): void {
  const memos = getMemos();
  if (text.trim()) {
    memos[mansionId] = {
      mansionId,
      text: text.trim(),
      updatedAt: new Date().toISOString(),
    };
  } else {
    delete memos[mansionId];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
}

export function deleteMemo(mansionId: string): void {
  const memos = getMemos();
  delete memos[mansionId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
}
