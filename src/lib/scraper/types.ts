export interface ScrapedImage {
  url: string;
  type:
    | "exterior"
    | "interior"
    | "floorplan"
    | "entrance"
    | "common"
    | "kitchen"
    | "bathroom"
    | "view"
    | "other";
  caption: string | null;
}

export type ScrapedListingType = "rental" | "sale";

export interface ScrapedListing {
  mansion_name: string;
  address: string;
  nearest_station: string;
  walking_minutes: number;
  layout_type: string;
  size_sqm: number;
  floor: number | null;
  listing_type?: ScrapedListingType; // デフォルト: "rental"
  // 賃貸用
  rent: number; // 円（賃貸時は必須、売買時は0）
  management_fee: number | null; // 円
  deposit: number | null; // 敷金（円）
  key_money: number | null; // 礼金（円）
  // 売買用（オプション）
  sale_price?: number | null; // 円
  price_per_sqm?: number | null; // 円/㎡
  maintenance_fee_sale?: number | null; // 管理費（円/月）
  repair_reserve_fund?: number | null; // 修繕積立金（円/月）
  // 共通
  images: ScrapedImage[];
  move_in_date: string | null;
  interior_features: string[];
  building_features: string[];
  floorplan_image_url: string | null;
  exterior_image_url: string | null;
  source_site: string;
  source_url: string;
}
