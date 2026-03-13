-- 売買サポート: listings テーブルに売買関連カラムを追加
-- listing_type カラム追加（デフォルトは rental で既存データと互換性あり）
ALTER TABLE listings ADD COLUMN IF NOT EXISTS listing_type text NOT NULL DEFAULT 'rental';

-- 売買専用フィールド
ALTER TABLE listings ADD COLUMN IF NOT EXISTS sale_price bigint;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS price_per_sqm bigint;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS maintenance_fee_sale integer;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS repair_reserve_fund integer;

-- listing_type にチェック制約
ALTER TABLE listings ADD CONSTRAINT listings_listing_type_check
  CHECK (listing_type IN ('rental', 'sale'));

-- インデックス
CREATE INDEX IF NOT EXISTS idx_listings_listing_type ON listings (listing_type);

-- コメント
COMMENT ON COLUMN listings.listing_type IS '募集種別: rental=賃貸, sale=売買';
COMMENT ON COLUMN listings.sale_price IS '売買価格（円）';
COMMENT ON COLUMN listings.price_per_sqm IS '㎡単価（円）';
COMMENT ON COLUMN listings.maintenance_fee_sale IS '管理費・月額（円）- 売買用';
COMMENT ON COLUMN listings.repair_reserve_fund IS '修繕積立金・月額（円）';
