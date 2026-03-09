// 建物マスター
export interface Mansion {
  id: string;
  name: string;
  address: string;
  nearest_station: string;
  walking_minutes: number;
  brand_type: string | null;
  total_units: number | null;
  floors: number | null;
  construction_date: string | null;
  features: string | null;
  memo: string | null;
  created_at: string;
  updated_at: string;
}

// 間取り/住戸タイプマスター
export interface Unit {
  id: string;
  mansion_id: string;
  room_number: string | null;
  floor_range: string | null;
  size_sqm: number;
  layout_type: string;
  direction: string | null;
  balcony: string | null;
  floorplan_url: string | null;
  last_rent: number | null;
  memo: string | null;
  created_at: string;
  updated_at: string;
}

// 募集情報
export type ListingStatus = "active" | "past" | "ended";

export interface Listing {
  id: string;
  unit_id: string;
  status: ListingStatus;
  current_rent: number;
  management_fee: number | null;
  floor: number | null;
  source_site: string | null;
  source_url: string | null;
  detected_at: string;
  ended_at: string | null;
  scraped_at: string | null;
}

// 監視リスト
export interface UserWatchlist {
  id: string;
  user_id: string;
  target_unit_id: string | null;
  target_mansion_id: string | null;
  conditions: Record<string, unknown> | null;
  is_active: boolean;
  created_at: string;
}

// 通知
export type NotificationType =
  | "new_listing"
  | "price_change"
  | "ended"
  | "relisted";

export interface Notification {
  id: string;
  user_id: string;
  watch_id: string | null;
  listing_id: string | null;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// UI用の拡張型
export type MansionStatus = "active" | "new" | "past" | "unknown";
export type UnitStatus = "active" | "past" | "unknown";

export interface MansionWithStats extends Mansion {
  active_listings_count: number;
  known_unit_types_count: number;
  recent_listings_count: number;
  last_listing_date: string | null;
  is_watched: boolean;
  status: MansionStatus;
}

export interface UnitWithStats extends Unit {
  active_listings_count: number;
  last_listing_date: string | null;
  last_rent_amount: number | null;
  is_watched: boolean;
  status: UnitStatus;
}
