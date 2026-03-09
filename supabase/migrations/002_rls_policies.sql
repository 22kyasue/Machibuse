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
