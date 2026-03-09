# Supabase セットアップ手順（Chrome Agent用プロンプト）

以下の手順を上から順番に実行してください。各ステップが完了してから次に進んでください。

---

## ステップ1: Supabaseにログイン

1. https://supabase.com にアクセス
2. 「Sign In」をクリック
3. GitHubアカウントでログイン（またはメール/パスワード）

---

## ステップ2: 新規プロジェクト作成

1. ダッシュボードの「New Project」をクリック
2. 以下を入力：
   - **Project name**: `machibuse`
   - **Database Password**: 強いパスワードを生成して入力（メモしておく）
   - **Region**: `Northeast Asia (Tokyo)` を選択
3. 「Create new project」をクリック
4. プロジェクトの準備が完了するまで待つ（1-2分）

---

## ステップ3: API KeysをコピーしてURLとKeyを取得

1. 左サイドバーの「Project Settings」（歯車アイコン）をクリック
2. 「API」セクションをクリック
3. 以下の2つの値をコピー：
   - **Project URL** → `https://xxxxx.supabase.co` の形式
   - **anon public** キー（`Project API keys` セクションの `anon` `public`）

4. ターミナルで以下のコマンドを実行して `.env.local` ファイルを作成：

```
取得したURLとKeyを以下の形式でファイルに書く：

NEXT_PUBLIC_SUPABASE_URL=https://ここにProject URLを貼る
NEXT_PUBLIC_SUPABASE_ANON_KEY=ここにanon publicキーを貼る
```

ファイルパス: `/Users/soshitakeyama/githubproject/Machibuse/.env.local`

---

## ステップ4: データベーステーブルを作成

1. 左サイドバーの「SQL Editor」をクリック
2. 「New query」をクリック
3. 以下のSQLを貼り付けて「Run」をクリック：

```sql
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
```

4. 「Success」と表示されることを確認

---

## ステップ5: RLSポリシーを設定

1. SQL Editorで「New query」をクリック
2. 以下のSQLを貼り付けて「Run」をクリック：

```sql
-- RLS有効化
ALTER TABLE mansions ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- mansions: 全員読み取り可、認証ユーザーのみ書き込み可
CREATE POLICY "mansions_select" ON mansions FOR SELECT USING (true);
CREATE POLICY "mansions_insert" ON mansions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "mansions_update" ON mansions FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "mansions_delete" ON mansions FOR DELETE USING (auth.uid() IS NOT NULL);

-- units: 全員読み取り可、認証ユーザーのみ書き込み可
CREATE POLICY "units_select" ON units FOR SELECT USING (true);
CREATE POLICY "units_insert" ON units FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "units_update" ON units FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "units_delete" ON units FOR DELETE USING (auth.uid() IS NOT NULL);

-- listings: 全員読み取り可、認証ユーザーのみ書き込み可
CREATE POLICY "listings_select" ON listings FOR SELECT USING (true);
CREATE POLICY "listings_insert" ON listings FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "listings_update" ON listings FOR UPDATE USING (auth.uid() IS NOT NULL);

-- user_watchlists: 自分のデータのみ
CREATE POLICY "watchlists_select" ON user_watchlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "watchlists_insert" ON user_watchlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "watchlists_update" ON user_watchlists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "watchlists_delete" ON user_watchlists FOR DELETE USING (auth.uid() = user_id);

-- notifications: 自分のデータのみ
CREATE POLICY "notifications_select" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_update" ON notifications FOR UPDATE USING (auth.uid() = user_id);
```

3. 「Success」と表示されることを確認

---

## ステップ6: テストデータを投入

1. SQL Editorで「New query」をクリック
2. 以下のSQLを貼り付けて「Run」をクリック：

```sql
-- 建物データ
INSERT INTO mansions (id, name, address, nearest_station, walking_minutes, brand_type, total_units, floors, construction_date, features, memo) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'パークコート赤坂檜町ザ タワー', '東京都港区赤坂9丁目', '六本木駅', 6, '三井不動産', 319, 44, '2018年', 'タワーマンション、コンシェルジュ、フィットネス', '2LDKの掲載が比較的多い。南向きは高層階中心。'),
  ('a1000000-0000-0000-0000-000000000002', 'ラ・トゥール渋谷', '東京都渋谷区渋谷1丁目', '渋谷駅', 5, '住友不動産', 206, 36, '2014年', 'タワーマンション、コンシェルジュ、スカイラウンジ', 'KENCORP掲載が多い。'),
  ('a1000000-0000-0000-0000-000000000003', 'パークマンション南麻布', '東京都港区南麻布4丁目', '広尾駅', 3, '三井不動産', 48, 5, '2005年', '低層マンション、閑静な住宅街', '小規模で稀少。募集は年に1-2回程度。'),
  ('a1000000-0000-0000-0000-000000000004', 'ザ・パークハウス グラン 南青山', '東京都港区南青山7丁目', '表参道駅', 8, '三菱地所', 86, 7, '2019年', '低層、高級仕様、ペット可', NULL),
  ('a1000000-0000-0000-0000-000000000005', 'グランドヒルズ白金台', '東京都港区白金台3丁目', '白金台駅', 4, '住友不動産', 55, 5, '2016年', '低層マンション、専有面積広め', NULL),
  ('a1000000-0000-0000-0000-000000000006', 'ブリリアタワーズ目黒 サウスレジデンス', '東京都品川区上大崎3丁目', '目黒駅', 1, '東京建物', 497, 40, '2017年', 'タワーマンション、駅直結', NULL),
  ('a1000000-0000-0000-0000-000000000007', 'ザ・パークハウス西新宿タワー60', '東京都新宿区西新宿5丁目', '都庁前駅', 4, '三菱地所', 954, 60, '2017年', '超高層タワーマンション', NULL);

-- 間取りタイプデータ
INSERT INTO units (id, mansion_id, room_number, floor_range, size_sqm, layout_type, direction, last_rent, memo) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', NULL, '20-30F', 71.20, '2LDK', '南', 480000, NULL),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', NULL, '10-20F', 58.10, '1LDK', '東', 350000, NULL),
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', NULL, '30-40F', 82.40, '3LDK', '南西', NULL, '掲載実績なし'),
  ('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', NULL, '5-15F', 45.30, '1LDK', '北', 280000, NULL),
  ('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', NULL, '15-25F', 65.80, '2LDK', '南', 420000, NULL),
  ('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000002', NULL, '25-36F', 85.20, '2LDK', '南西', 580000, NULL),
  ('b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000002', NULL, '5-15F', 42.10, '1K', '東', 220000, NULL),
  ('b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000003', NULL, '3-5F', 120.50, '3LDK', '南', 750000, NULL),
  ('b1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000003', NULL, '1-3F', 95.30, '2LDK', '南東', 580000, NULL),
  ('b1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000004', NULL, '3-7F', 78.50, '2LDK', '南', 520000, NULL),
  ('b1000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000004', NULL, '1-3F', 55.20, '1LDK', '東', 350000, NULL),
  ('b1000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000005', NULL, '3-5F', 105.80, '3LDK', '南', 680000, NULL);

-- 募集データ
INSERT INTO listings (id, unit_id, status, current_rent, management_fee, floor, source_site, source_url, detected_at, ended_at) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'active', 480000, 20000, 24, 'KENCORP', 'https://example.com/listing/1', '2026-03-09 09:55:00+09', NULL),
  ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'active', 465000, 20000, 19, 'SUUMO', 'https://example.com/listing/2', '2026-03-09 08:10:00+09', NULL),
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002', 'past', 350000, 15000, 14, 'SUUMO', 'https://example.com/listing/3', '2025-11-14 10:00:00+09', '2025-12-20 00:00:00+09'),
  ('c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000004', 'past', 280000, 12000, 8, 'HOMES', 'https://example.com/listing/4', '2025-09-01 10:00:00+09', '2025-10-15 00:00:00+09'),
  ('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000005', 'active', 430000, 18000, 20, 'KENCORP', 'https://example.com/listing/5', '2026-03-07 14:30:00+09', NULL),
  ('c1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000006', 'past', 580000, 25000, 30, 'SUUMO', 'https://example.com/listing/6', '2025-08-20 10:00:00+09', '2025-09-30 00:00:00+09'),
  ('c1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000008', 'past', 750000, 30000, 4, 'KENCORP', 'https://example.com/listing/7', '2025-06-01 10:00:00+09', '2025-07-15 00:00:00+09'),
  ('c1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000010', 'active', 530000, 22000, 5, 'SUUMO', 'https://example.com/listing/8', '2026-03-05 11:00:00+09', NULL);
```

3. 「Success」と表示されることを確認

---

## ステップ7: Auth設定

1. 左サイドバーの「Authentication」をクリック
2. 「Providers」をクリック
3. 「Email」が有効（Enabled）になっていることを確認
4. 「Confirm email」をOFF（開発中は確認メールなしでテスト）にする
5. 「Save」をクリック

---

## 完了確認

以下がすべてできていれば完了：
- [ ] Supabaseプロジェクト「machibuse」が作成済み
- [ ] `.env.local` ファイルにURLとKeyが記載済み
- [ ] SQL Editorで3つのクエリが全てSuccess
- [ ] Auth > Email providerが有効

**全て完了したらターミナルに戻って教えてください。**
