import type {
  Listing,
  Notification,
  MansionWithStats,
  UnitWithStats,
} from "@/types";
import {
  mockMansions,
  mockUnits,
  mockListings,
  mockNotifications,
  getMansionById as mockGetMansionById,
  getUnitById as mockGetUnitById,
  getListingsByUnitId as mockGetListingsByUnitId,
  getListingById as mockGetListingById,
} from "./mock-data";

// TODO: Supabase接続後に createServerSupabaseClient を使った実装に切り替え
// 現在はモックデータを返す

// ─── 建物 ──────────────────────────────────

export async function getMansions(): Promise<MansionWithStats[]> {
  return mockMansions;
}

export async function getMansionById(
  id: string
): Promise<MansionWithStats | null> {
  return mockGetMansionById(id) || null;
}

// ─── 間取りタイプ ──────────────────────────────

export async function getUnitsByMansionId(
  mansionId: string
): Promise<UnitWithStats[]> {
  return mockUnits[mansionId] || [];
}

export async function getUnitById(id: string): Promise<UnitWithStats | null> {
  return mockGetUnitById(id) || null;
}

// ─── 募集情報 ──────────────────────────────

export async function getListingsByUnitId(unitId: string): Promise<Listing[]> {
  return mockGetListingsByUnitId(unitId);
}

export async function getListingById(id: string): Promise<Listing | null> {
  return mockGetListingById(id) || null;
}

// ─── 通知 ──────────────────────────────

export async function getNotifications(): Promise<Notification[]> {
  return mockNotifications;
}

// ─── ダッシュボード集約 ──────────────────────────────

export async function getDashboardData() {
  const mansions = await getMansions();
  const notifications = await getNotifications();

  const watchedMansions = mansions.filter((m) => m.is_watched);
  const unreadNotifications = notifications.filter((n) => !n.is_read);
  const activeMansions = mansions.filter((m) => m.active_listings_count > 0);
  const totalActiveListings = mansions.reduce(
    (sum, m) => sum + m.active_listings_count,
    0
  );

  return {
    watchedMansions,
    unreadNotifications,
    activeMansions,
    totalActiveListings,
    notifications: notifications.slice(0, 5),
  };
}
