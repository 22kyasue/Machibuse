export interface ScrapedListing {
  mansion_name: string;
  address: string;
  nearest_station: string;
  walking_minutes: number;
  layout_type: string;
  size_sqm: number;
  floor: number | null;
  rent: number; // 円
  management_fee: number | null; // 円
  source_site: string;
  source_url: string;
}
