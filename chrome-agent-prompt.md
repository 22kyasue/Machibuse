# Chrome Agent: Supabase DB 全セットアップ

あなたはブラウザを操作してSupabaseダッシュボードでSQLを実行するエージェントです。
以下の手順を**上から順番に、すべて自律的に**実行してください。
エラーが出た場合は内容を確認し、既に適用済み（already exists / duplicate key）のステップはスキップしてください。

---

## 前提情報

- **Supabaseプロジェクト**: `jncdladjskuwwzgvqfph`
- **ダッシュボードURL**: https://supabase.com/dashboard/project/jncdladjskuwwzgvqfph
- **SQLファイルの場所**: `/Users/soshitakeyama/githubproject/Machibuse/` 配下

---

## フェーズ1: ダッシュボードにアクセス

1. https://supabase.com/dashboard/project/jncdladjskuwwzgvqfph にアクセス
2. ログインが必要ならログインする
3. 左サイドバーの **「SQL Editor」** をクリック

---

## フェーズ2: 現状確認

「New query」を開き、以下のSQLを実行：

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

「Run」をクリック。結果に応じて分岐：
- テーブルが何もない → フェーズ3 の **ステップ1** から実行
- `mansions`, `units`, `listings` 等がある → フェーズ3 の該当ステップをスキップ
- 全テーブルが揃っている → フェーズ3 の **ステップ5** （シードデータ）へ

---

## フェーズ3: SQLファイルの順次実行

以下のファイルを **この順番で1つずつ** 実行してください。

### 各ファイルの実行手順（毎回同じ）:
1. SQL Editorで「New query」をクリック（新しいタブを開く）
2. 指定されたローカルファイルの中身を**全文コピー**してエディタに貼り付け
3. 「Run」ボタンをクリック
4. 成功を確認してから次へ進む

### エラー時の対応:
- 「already exists」「duplicate key」→ 適用済み。スキップしてOK
- 「column does not exist」→ 前のステップが未実行。戻って先に実行
- タイムアウト → SQLを半分に分割して2回に分けて実行

---

### ステップ1: テーブル作成
**ファイル**: `supabase/migrations/001_create_tables.sql`
**内容**: mansions, units, listings, user_watchlists, notifications テーブル作成

### ステップ2: RLSポリシー
**ファイル**: `supabase/migrations/002_rls_policies.sql`
**内容**: Row Level Security ポリシー設定

### ステップ3: 通知設定テーブル
**ファイル**: `supabase/migrations/003_notification_settings.sql`
**内容**: notification_settings テーブル作成

### ステップ4: 物件情報拡張
**ファイル**: `supabase/migrations/004_enhance_property_data.sql`
**内容**: カラム追加 + property_images テーブル作成

### ステップ5: 基本シードデータ
**ファイル**: `supabase/seed.sql`
**内容**: 7棟の建物データ

### ステップ6: 拡張シードデータ
**ファイル**: `supabase/seed-extended.sql`
**内容**: 15棟追加

### ステップ7: 追加シードデータ
**ファイル**: `supabase/seed_additional.sql`
**内容**: 23棟追加

### ステップ8: データ充実化
**ファイル**: `supabase/seed_enrich.sql`
**内容**: 全建物の備考・基礎情報更新、間取り補完、新規募集追加

---

## フェーズ4: 実行結果の確認

すべて完了したら「New query」で以下を実行：

```sql
SELECT 'mansions' AS tbl, COUNT(*) AS cnt FROM mansions
UNION ALL SELECT 'units', COUNT(*) FROM units
UNION ALL SELECT 'listings', COUNT(*) FROM listings
UNION ALL SELECT 'notification_settings', COUNT(*) FROM notification_settings
UNION ALL SELECT 'property_images', COUNT(*) FROM property_images
ORDER BY tbl;
```

**期待される結果：**

| tbl | cnt |
|-----|-----|
| listings | 約180 |
| mansions | 45 |
| notification_settings | 0 |
| property_images | 0 |
| units | 約148 |

次にデータ充実化の確認：

```sql
SELECT name, structure, management_company, memo
FROM mansions
WHERE memo IS NOT NULL
LIMIT 5;
```

→ `structure`, `management_company`, `memo` に値が入っていればOK。

---

## フェーズ5: 完了報告

すべて完了したら以下を報告：
- 各ステップの実行結果（成功 / スキップ / エラー）
- 最終的なレコード数
- データ充実化の確認結果
