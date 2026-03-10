const STORAGE_KEY = "machibuse_watchlist";

export function getWatchedMansionIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addToWatchlist(mansionId: string): void {
  const ids = getWatchedMansionIds();
  if (!ids.includes(mansionId)) {
    ids.push(mansionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }
}

export function removeFromWatchlist(mansionId: string): void {
  const ids = getWatchedMansionIds().filter((id) => id !== mansionId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function isWatched(mansionId: string): boolean {
  return getWatchedMansionIds().includes(mansionId);
}

export function toggleWatchlist(mansionId: string): boolean {
  if (isWatched(mansionId)) {
    removeFromWatchlist(mansionId);
    return false;
  } else {
    addToWatchlist(mansionId);
    return true;
  }
}
