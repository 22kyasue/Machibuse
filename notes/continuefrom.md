# 続きから（最終更新: v1.2.0予定）

## 現在の状態

### 完了済み
- Phase 0: プロジェクト初期セットアップ
- Phase 1: DBマイグレーション + Supabase接続完了
  - 全5テーブル作成済み（mansions, units, listings, user_watchlists, notifications）
  - RLSポリシー適用済み
  - シードデータ投入済み（7建物、12ユニット、8募集）
  - `.env.local` 設定済み
- Phase 2: 認証（Auth）実装済み
  - ログインページ (`/login`)
  - サインアップページ (`/signup`)
  - 認証ミドルウェア（未ログインは `/login` にリダイレクト）
  - ログアウト機能（ヘッダー）
- Phase 3: MVP 6画面 + モーダル + フィルター/ソート/ページネーション
  - ダッシュボード (`/dashboard`) - Supabase接続済み
  - 建物一覧 (`/mansions`) - フィルター・ソート・ページネーション + Supabase
  - 建物詳細 (`/mansions/[id]`) - 間取りタイプ追加モーダル + 監視ボタンAPI接続
  - 間取りタイプ詳細 (`/units/[id]`) - Supabase接続済み + 監視ボタンAPI接続
  - 募集詳細 (`/listings/[id]`) - Supabase接続済み
  - 通知一覧 (`/notifications`) - API経由で取得・既読更新
  - 通知設定 (`/settings/notifications`) - API経由で保存
- Phase 4: 監視（ウォッチ）機能
  - 監視リストページ (`/watchlist`) - 監視追加/解除 API接続済み
  - 建物詳細の「監視する」ボタン - API接続済み
  - 間取り詳細の「監視する」ボタン - API接続済み
  - mansions API - is_watched をユーザーの監視リストと照合
- バックエンド API すべてSupabase接続済み
  - 建物 CRUD (`/api/mansions`, `/api/mansions/[id]`)
  - 間取りタイプ CRUD (`/api/units`, `/api/units/[id]`)
  - 募集情報 CRUD (`/api/listings`, `/api/listings/[id]`)
  - 通知 API (`/api/notifications`)
  - 監視リスト API (`/api/watchlists`)
  - ダッシュボード集約 API (`/api/dashboard`)
  - 通知設定 API (`/api/settings/notifications`)
- データアクセス層 (`src/lib/queries.ts`) Supabase接続済み
- UIコンポーネント
  - 建物登録モーダル (`AddMansionModal`)
  - 間取りタイプ追加モーダル (`AddUnitModal`)
  - 汎用モーダル (`Modal`)
  - 監視ボタン (`WatchUnitButton`)

### 今後の拡張候補
1. **Phase 5: 通知システム強化**
   - Supabase Edge Functions でのバッチ通知
   - メール送信（Resend / SendGrid）
   - Webhook通知

2. **データ収集**
   - スクレイピングバッチ（SUUMO, LIFULL HOME'S等）
   - Supabase Edge Functions or 外部Cron

3. **UI改善**
   - 賃料推移グラフ（Chart.js / Recharts）
   - 建物の地図表示（Google Maps / Mapbox）
   - ダークモード
   - PWA対応

4. **運用**
   - Vercelデプロイ
   - エラー監視（Sentry）
   - アナリティクス

## 技術スタック
- Next.js 16 (App Router) + React 19 + Tailwind CSS v4
- Supabase (PostgreSQL + Auth + RLS)
- TypeScript
