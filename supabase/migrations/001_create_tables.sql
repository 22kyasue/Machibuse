-- 建物マスター
CREATE TABLE mansions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  nearest_station TEXT,
  walking_minutes INTEGER,
  brand_type TEXT,
  total_units INTEGER,
  floors INTEGER,
  construction_date TEXT,
  features TEXT,
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 間取り/住戸タイプマスター
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mansion_id UUID NOT NULL REFERENCES mansions(id) ON DELETE CASCADE,
  room_number TEXT,
  floor_range TEXT,
  size_sqm NUMERIC(6,2) NOT NULL,
  layout_type TEXT NOT NULL,
  direction TEXT,
  balcony TEXT,
  floorplan_url TEXT,
  last_rent INTEGER,
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 募集情報（現在 & 過去）
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past', 'ended')),
  current_rent INTEGER NOT NULL,
  management_fee INTEGER,
  floor INTEGER,
  source_site TEXT,
  source_url TEXT,
  detected_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  scraped_at TIMESTAMPTZ
);

-- 監視リスト
CREATE TABLE user_watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  target_mansion_id UUID REFERENCES mansions(id) ON DELETE CASCADE,
  conditions JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT watchlist_target_check CHECK (
    target_unit_id IS NOT NULL OR target_mansion_id IS NOT NULL
  )
);

-- 通知履歴
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  watch_id UUID REFERENCES user_watchlists(id) ON DELETE SET NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('new_listing', 'price_change', 'ended', 'relisted')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- インデックス
CREATE INDEX idx_units_mansion_id ON units(mansion_id);
CREATE INDEX idx_listings_unit_id ON listings(unit_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_detected_at ON listings(detected_at DESC);
CREATE INDEX idx_user_watchlists_user_id ON user_watchlists(user_id);
CREATE INDEX idx_user_watchlists_mansion_id ON user_watchlists(target_mansion_id);
CREATE INDEX idx_user_watchlists_unit_id ON user_watchlists(target_unit_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- updated_at 自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mansions_updated_at
  BEFORE UPDATE ON mansions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER units_updated_at
  BEFORE UPDATE ON units
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
