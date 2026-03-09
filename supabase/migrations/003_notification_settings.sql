CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_enabled BOOLEAN DEFAULT false,
  email_address TEXT,
  notify_new_listing BOOLEAN DEFAULT true,
  notify_price_change BOOLEAN DEFAULT true,
  notify_ended BOOLEAN DEFAULT false,
  notify_relisted BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ユーザーは自分の設定のみ閲覧可能"
  ON notification_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "ユーザーは自分の設定のみ更新可能"
  ON notification_settings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- updated_at 自動更新トリガー（001で作成したupdate_updated_at関数を再利用）
CREATE TRIGGER set_notification_settings_updated_at
  BEFORE UPDATE ON notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
