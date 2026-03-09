# Vercel デプロイ手順（Chrome Agent用プロンプト）

## ステップ1: Vercelにログイン

1. https://vercel.com にアクセス
2. 「Login」をクリック
3. GitHubアカウントでログイン

## ステップ2: 新規プロジェクトをインポート

1. ダッシュボードの「Add New...」→「Project」をクリック
2. 「Import Git Repository」でGitHubリポジトリ「Machibuse」を選択
3. もしリポジトリが表示されない場合は「Adjust GitHub App Permissions」でリポジトリへのアクセスを許可

## ステップ3: プロジェクト設定

1. **Project Name**: `machibuse`
2. **Framework Preset**: `Next.js`（自動検出されるはず）
3. **Root Directory**: そのまま（空欄）
4. **Environment Variables** に以下の2つを追加：

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://jncdladjskuwwzgvqfph.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuY2RsYWRqc2t1d3d6Z3ZxZnBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNjI3NDgsImV4cCI6MjA4ODYzODc0OH0.p4tI8EnXQQMq9WQsBp7Utlg5W8VrH3NaGteocmDQxH0` |

5. 「Deploy」をクリック

## ステップ4: デプロイ完了を確認

1. ビルドが完了するまで待つ（2-3分）
2. 完了したらデプロイURLが表示される（例: `machibuse.vercel.app`）
3. そのURLにアクセスして動作確認

## 完了したらURLを教えてください
