# 統計検定道場 (Statistics Exam Preparation App)

統計検定 準1級・2級・1級の学習を支援する Web アプリケーションです。
教科書（KaTeX 数式対応）、問題演習、模擬試験、学習進捗管理の機能を備え、Supabase によるユーザー認証とデータ永続化に対応しています。

**本番 URL**: https://statistics-exam-preparation-app.vercel.app/

## 機能一覧

| 機能 | 概要 |
|------|------|
| 教科書 | 23 トピック × 10 例題。KaTeX 数式レンダリング、解答の折りたたみ表示 |
| 問題演習 | 184 問（準1級）の選択式・記述式問題。トピック別フィルタ、解説付き |
| 模擬試験 | タイマー付き試験。自動採点、クイックナビゲーション、結果レビュー |
| 学習進捗 | トピック別正答率、回答履歴、連続学習日数（ストリーク） |
| ユーザー管理 | Supabase Auth によるログイン / 新規登録 / ゲストモード |
| プロフィール | 表示名編集、学習進捗リセット、ブックマーク管理 |
| AI チャット | 統計学の用語をキーワードベースで質問可能（オフライン動作） |

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フロントエンド | React 19 + Vite 6 |
| スタイリング | Tailwind CSS 3 |
| 数式レンダリング | KaTeX |
| アイコン | Lucide React |
| 認証・DB | Supabase (Auth + PostgreSQL) |
| フォールバック | localStorage（Supabase 未設定時） |
| ホスティング | Vercel |
| アナリティクス | Google Analytics 4 |

## セットアップ

### 前提条件

- Node.js 18+
- npm
- Supabase プロジェクト（本番運用時）

### ローカル開発

```bash
# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .env に Supabase の URL と anon key を記入

# 開発サーバーの起動
npm run dev

# 本番ビルド
npm run build

# ビルドのプレビュー
npm run preview
```

### 環境変数

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `VITE_SUPABASE_URL` | Supabase プロジェクトの URL | Supabase 使用時 |
| `VITE_SUPABASE_ANON_KEY` | Supabase の anon (public) key | Supabase 使用時 |

環境変数が未設定の場合、localStorage フォールバックモードで動作します。

### Supabase データベース設定

Supabase ダッシュボードの SQL エディタで `supabase-schema.sql` を実行してください。
以下のテーブルと RLS ポリシーが作成されます：

- `profiles` — ユーザープロフィール
- `results` — 学習結果
- `study_days` — 学習日記録
- `bookmarks` — ブックマーク

**注意**: 既にユーザーが存在するため、スキーマ変更時は `CREATE TABLE IF NOT EXISTS` を使用し、既存データに影響を与えないようにしてください。

## ディレクトリ構成

```
├── index.html              # エントリーHTML（SEO・OGP・GA・JSON-LD）
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json             # セキュリティヘッダー・キャッシュ設定
├── supabase-schema.sql     # DB スキーマ・RLS ポリシー
├── .env.example            # 環境変数テンプレート
├── public/
│   ├── favicon.svg
│   ├── og-image.png
│   ├── og-image.svg
│   ├── robots.txt
│   └── sitemap.xml
└── src/
    ├── main.jsx            # エントリーポイント
    ├── App.jsx             # ルートコンポーネント（認証・ルーティング）
    ├── index.css           # Tailwind CSS
    ├── components/
    │   ├── AuthPage.jsx    # ログイン / 新規登録（バリデーション付き）
    │   ├── HomePage.jsx    # ホームダッシュボード
    │   ├── TextbookPage.jsx # 教科書（KaTeX + 折りたたみ解答）
    │   ├── PracticePage.jsx # 問題演習
    │   ├── ExamPage.jsx    # 模擬試験
    │   ├── ProgressPage.jsx # 学習進捗
    │   ├── ProfilePage.jsx # プロフィール管理
    │   ├── Sidebar.jsx     # サイドバーナビゲーション
    │   └── ChatPopup.jsx   # AI チャットポップアップ
    ├── lib/
    │   ├── supabase.js     # Supabase クライアント初期化
    │   └── userStore.js    # ユーザー管理（Supabase + localStorage デュアルモード）
    └── data/
        ├── index.js        # データ集約
        ├── levels.js       # 級の定義（2級・準1級・1級）
        ├── questions-*.js  # 問題データ（級別）
        └── topics-*.js     # トピック教科書データ（23ファイル）
```

## コンテンツ構成（準1級）

23 トピック × 10 例題 + 8 問題演習 = **合計 230 例題 + 184 問題**

| カテゴリ | トピック |
|---------|---------|
| 確率・確率過程 | 確率母関数と積率母関数、条件付き分布・期待値、ポアソン過程、マルコフ連鎖、ブラウン運動 |
| 統計的推測 | 最尤法、ベイズ法、ノンパラメトリック法 |
| 回帰・モデリング | 重回帰分析、質的回帰、分散分析、グラフィカルモデリング |
| 多変量解析 | 多変量正規分布、主成分分析、因子分析、判別分析、クラスター分析、その他の多変量解析手法 |
| 時系列・生存 | 時系列分析、生存時間解析 |
| 調査・データ | 標本調査法、分割表、不完全データの統計処理 |

## 教科書コンテンツの記法

トピックファイル内で使用できる記法：

| 記法 | 用途 | 例 |
|------|------|-----|
| `$...$` | インライン数式 | `$\bar{x}$` |
| `$$...$$` | ディスプレイ数式 | `$$\sum_{i=1}^n x_i$$` |
| `**...**` | 太字見出し | `**定義**` |
| `- ...` | 箇条書き | `- 項目1` |
| `【例題】` | 問題マーカー | 青いボックスで強調表示 |
| `【解答】...【/解答】` | 折りたたみ解答 | デフォルト非表示、クリックで展開 |

## セキュリティ

### 認証・データ保護

| 項目 | 実装状況 |
|------|---------|
| 認証 | Supabase Auth（メール + パスワード）。未設定時は localStorage フォールバック |
| パスワード要件 | 8文字以上、大文字・小文字・数字各1つ以上 |
| 入力バリデーション | メール形式チェック、名前長制限（50文字）、パスワード強度チェック |
| RLS | Supabase Row Level Security により、ユーザーは自分のデータのみアクセス可能 |
| XSS 防御 | React JSX エスケープ、`dangerouslySetInnerHTML` 不使用 |
| HTTPS | Vercel で自動対応、HSTS ヘッダー設定済み |

### セキュリティヘッダー（vercel.json）

| ヘッダー | 設定値 |
|---------|--------|
| Content-Security-Policy | `default-src 'self'`、Supabase・GA のみ外部接続許可 |
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` |
| X-Frame-Options | `DENY` |
| X-Content-Type-Options | `nosniff` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | camera, microphone, geolocation 無効化 |

### localStorage フォールバックの制約

Supabase 未設定時の localStorage モードには以下の制約があります：

- パスワードが平文で localStorage に保存される
- クライアントサイド認証のみ（バイパス可能）
- ブラウザのデータ消去で学習履歴が失われる

**本番運用では必ず Supabase を設定してください。**

### 運用上の注意

- **既存ユーザーへの影響**: スキーマ変更時は必ずマイグレーションスクリプトを使用し、`DROP TABLE` は絶対に実行しないでください
- **環境変数**: `.env` は `.gitignore` に含まれており、Git にコミットされません
- **Supabase anon key**: クライアントサイドで使用される公開キーです。RLS が有効なため、他ユーザーのデータにはアクセスできません

## デプロイ

### Vercel（現在使用中）

GitHub リポジトリと連携済み。`main` ブランチへの push で自動デプロイされます。

環境変数は Vercel ダッシュボードの Settings > Environment Variables で設定：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 手動デプロイ

```bash
npx vercel --prod
```

## 今後の改善候補

- [ ] レート制限（ログイン試行回数の制限）
- [ ] パスワードリセット機能
- [ ] ソーシャルログイン（Google / GitHub）
- [ ] 問題のブックマーク UI 統合
- [ ] 2級・1級コンテンツの充実
- [ ] コード分割によるバンドルサイズ最適化

## ライセンス

Private
