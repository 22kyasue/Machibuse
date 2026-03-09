# 続きから（最終更新: v1.1.0）

## 現在の状態

### 完了済み
- Phase 0: プロジェクト初期セットアップ
- Phase 1: DBマイグレーションSQL作成済み（Supabase未接続）
- Phase 2: 認証（Auth）実装済み
  - ログインページ (`/login`)
  - サインアップページ (`/signup`)
  - 認証ミドルウェア（未ログインは `/login` にリダイレクト）
  - ログアウト機能（ヘッダー）
- Phase 3: MVP 6画面 + モーダル + フィルター/ソート/ページネーション
  - ダッシュボード (`/dashboard`) - Supabaseクエリ対応済み
  - 建物一覧 (`/mansions`) - フィルター・ソート・ページネーション付き
  - 建物詳細 (`/mansions/[id]`) - 間取りタイプ追加モーダル付き
  - 間取りタイプ詳細 (`/units/[id]`) - Supabaseクエリ対応済み
  - 募集詳細 (`/listings/[id]`) - Supabaseクエリ対応済み
  - 通知一覧 (`/notifications`) - API経由で取得・既読更新
- バックエンド API 実装済み
  - 建物 CRUD (`/api/mansions`, `/api/mansions/[id]`)
  - 間取りタイプ CRUD (`/api/units`, `/api/units/[id]`)
  - 募集情報 CRUD (`/api/listings`, `/api/listings/[id]`)
  - 通知 API (`/api/notifications`)
  - 監視リスト API (`/api/watchlists`)
  - ダッシュボード集約 API (`/api/dashboard`)
- データアクセス層 (`src/lib/queries.ts`) Supabase接続準備完了
- UIコンポーネント
  - 建物登録モーダル (`AddMansionModal`)
  - 間取りタイプ追加モーダル (`AddUnitModal`)
  - 汎用モーダル (`Modal`)

### 次にやるべきこと（後回し.txt 参照）
1. **Supabase プロジェクトを作成する**
   - `.env.local` に `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定
   - マイグレーションSQL実行 → シードデータ投入
   - 詳細は `後回し.txt` を参照

2. **Phase 4: 監視（ウォッチ）機能** のフロントエンド
   - 監視リストページ (`/watchlist`)
   - 建物/間取り詳細の「監視する」ボタンをAPI接続

3. **Phase 5: 通知システム**

## 未解決の問題
- Supabase 未接続（`.env.local` 未設定）
- 建物一覧は現在モックデータで動作（Supabase接続後に自動切替）
- 監視リストページ未実装
