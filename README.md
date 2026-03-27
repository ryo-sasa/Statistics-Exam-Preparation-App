# 統計検定道場 (Statistics Exam Preparation App)

統計検定 準1級・2級・1級の学習を支援する Web アプリケーションです。
教科書（KaTeX 数式対応）、問題演習、模擬試験、学習進捗管理の機能を備え、Supabase によるユーザー認証とデータ永続化に対応しています。

**本番 URL**: https://statistics-exam-preparation-app.vercel.app/

## 機能一覧

| 機能 | 概要 |
|------|------|
| 教科書 | 23 トピック × 10 例題。KaTeX 数式レンダリング、解答の折りたたみ表示 |
| 問題演習 | 276 問（準1級）の選択式・記述式問題。トピック別・難易度別フィルタ、解説付き |
| 難易度タグ | 全問に基礎・標準・発展の3段階を付与。段階的な学習が可能 |
| 模擬試験 | タイマー付き試験（115問）。自動採点、クイックナビゲーション、結果レビュー |
| ブックマーク | 問題をブックマークして復習モードで集中的に解き直し |
| 弱点分析 | 正答率60%未満のカテゴリを自動検出・ハイライト。未着手カテゴリも表示 |
| 記述式AI評価 | 記述式回答を AI（Claude Haiku）が採点・フィードバック。AI無効時はキーワード採点 |
| AIチャット | AI有効時は Claude による自由質問応答。無効時は72キーワードの辞書マッチ（オフライン可） |
| 学習進捗 | トピック別正答率、回答履歴、連続学習日数（ストリーク） |
| ユーザー管理 | Supabase Auth によるログイン / 新規登録 / ゲストモード |
| プロフィール | 表示名編集、学習進捗リセット |

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フロントエンド | React 19 + Vite 6 |
| スタイリング | Tailwind CSS 3 |
| 数式レンダリング | KaTeX |
| アイコン | Lucide React |
| 認証・DB | Supabase (Auth + PostgreSQL) |
| AI | Claude Haiku 4.5（Vercel Serverless Function 経由） |
| フォールバック | localStorage（Supabase 未設定時） |
| ホスティング | Vercel |
| アナリティクス | Google Analytics 4 |

## AI 機能の詳細

### アーキテクチャ

```
ブラウザ (React SPA)
  ├─ [AI] チェックボックス OFF → ローカル処理（無料・オフライン可）
  │   ├─ 記述式: キーワード部分一致で自動採点
  │   └─ チャット: 72キーワードの辞書マッチ応答
  │
  └─ [AI] チェックボックス ON → Vercel API Route → Claude Haiku
      ├─ 記述式: 0〜100点のスコア + フィードバック + 良い点/不足点
      └─ チャット: 統計学の自由質問に対する文脈ある回答
          (API失敗時は自動でローカルにフォールバック)
```

ヘッダー右上の **[AI]** チェックボックスで切り替えます。設定は localStorage に保存され、次回以降も維持されます。

### API Route (`/api/ai`)

| 項目 | 内容 |
|------|------|
| ランタイム | Vercel Serverless Function (Node.js) |
| エンドポイント | `POST /api/ai` |
| リクエスト種別 | `type: "evaluate"`（記述式評価）/ `type: "chat"`（チャット応答） |
| 認証 | Supabase JWT（Authorization ヘッダー） |
| モデル | Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) |
| APIキー管理 | `ANTHROPIC_API_KEY`（サーバー側のみ、ブラウザに露出しない） |

### コスト管理・利用制限

| 項目 | 値 |
|------|-----|
| 1リクエストあたりのコスト | ~0.5円（入力1500tok + 出力400tok） |
| **月間上限** | **200回/ユーザー（≈100円/月）** |
| 上限到達時の挙動 | 429エラー + メッセージ表示、翌月1日に自動リセット |
| 短期レート制限 | 20回/分/IP（DDoS防止） |
| 未ログインユーザー | AI機能利用不可（401エラー） |
| ゲストモード | AI機能利用不可 |

利用量は Supabase の `ai_usage` テーブルで `(user_id, month)` 単位で管理されます。
記述式評価とチャットは**同一の月間上限を共有**します。

### チャットボットの応答辞書（ローカルモード）

AI無効時は `src/data/chat-responses.js` の72キーワード辞書で応答します。

| カテゴリ | キーワード例 |
|---------|------------|
| 基礎統計 | 分散、標準偏差、平均、中央値、相関 |
| 確率分布 | 正規分布、ポアソン分布、t分布、カイ二乗、F分布 |
| 統計的推測 | 信頼区間、p値、検定、t検定、z検定 |
| 準1級（推測） | 最尤法、フィッシャー情報量、EM、ベイズ、ブートストラップ |
| 準1級（過程） | マルコフ、ブラウン運動、伊藤、ポアソン過程、積率母関数 |
| 準1級（回帰） | 回帰、重回帰、ロジスティック、ANOVA、グラフィカルモデル |
| 準1級（多変量） | 主成分分析、因子分析、判別分析、クラスター、多変量正規 |
| 準1級（時系列） | 時系列、定常性、ARIMA、生存分析、コックス |
| 準1級（調査） | 標本調査、層化抽出、分割表、不完全データ、多重代入 |
| 数学的基礎 | 中心極限定理、大数の法則、デルタ法、十分統計量 |

クイック質問は選択中の級に応じて表示内容が変わります（2級6個、準1級8個、1級6個）。

## セットアップ

### 前提条件

- Node.js 18+
- npm
- Supabase プロジェクト（本番運用時）
- Anthropic API キー（AI機能使用時）

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

#### クライアント側（`VITE_` 接頭辞 = ブラウザに公開）

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `VITE_SUPABASE_URL` | Supabase プロジェクトの URL | Supabase 使用時 |
| `VITE_SUPABASE_ANON_KEY` | Supabase の anon (public) key | Supabase 使用時 |

#### サーバー側（Vercel 環境変数、ブラウザに露出しない）

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `ANTHROPIC_API_KEY` | Anthropic API キー | AI機能使用時 |
| `SUPABASE_URL` | Supabase プロジェクトの URL | AI利用量管理時 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role キー（RLSバイパス） | AI利用量管理時 |

クライアント側の環境変数が未設定の場合、localStorage フォールバックモードで動作します。
サーバー側の環境変数が未設定の場合、AI機能は無効（503エラー）になりますが、アプリ自体は正常に動作します。

### Supabase データベース設定

Supabase ダッシュボードの SQL エディタで `supabase-schema.sql` を実行してください。
以下のテーブルと RLS ポリシーが作成されます：

| テーブル | 用途 | カラム |
|---------|------|--------|
| `profiles` | ユーザープロフィール | id, name, email, selected_level, created_at |
| `results` | 学習結果 | user_id, question_id, topic_id, level, is_correct, difficulty, user_answer, created_at |
| `study_days` | 学習日記録 | user_id, study_date (UNIQUE) |
| `bookmarks` | ブックマーク | user_id, question_id (UNIQUE) |
| `ai_usage` | AI月間利用量 | user_id, month, request_count (PRIMARY KEY: user_id + month) |

**注意**: 既にユーザーが存在するため、スキーマ変更時は `CREATE TABLE IF NOT EXISTS` / `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` を使用し、既存データに影響を与えないようにしてください。

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
├── api/
│   └── ai.js              # Vercel Serverless Function（Claude Haiku プロキシ）
├── public/
│   ├── favicon.svg
│   ├── og-image.png
│   ├── og-image.svg
│   ├── robots.txt
│   └── sitemap.xml
└── src/
    ├── main.jsx            # エントリーポイント
    ├── App.jsx             # ルートコンポーネント（認証・ルーティング・AIトグル）
    ├── index.css           # Tailwind CSS
    ├── components/
    │   ├── AuthPage.jsx    # ログイン / 新規登録（バリデーション付き）
    │   ├── HomePage.jsx    # ホームダッシュボード
    │   ├── TextbookPage.jsx # 教科書（KaTeX + 折りたたみ解答）
    │   ├── PracticePage.jsx # 問題演習（ブックマーク・難易度フィルタ・AI評価）
    │   ├── ExamPage.jsx    # 模擬試験
    │   ├── ProgressPage.jsx # 学習進捗（弱点分析）
    │   ├── ProfilePage.jsx # プロフィール管理
    │   ├── Sidebar.jsx     # サイドバーナビゲーション
    │   └── ChatPopup.jsx   # AI チャットポップアップ（ローカル/AI切替）
    ├── lib/
    │   ├── supabase.js     # Supabase クライアント初期化
    │   ├── userStore.js    # ユーザー管理（Supabase + localStorage デュアルモード）
    │   └── aiService.js    # AI サービスクライアント（API呼び出し + ローカル採点）
    └── data/
        ├── index.js        # データ集約
        ├── levels.js       # 級の定義（2級・準1級・1級）
        ├── questions-*.js  # 問題データ（級別、difficulty フィールド付き）
        ├── topics-*.js     # トピック教科書データ（23ファイル）
        └── chat-responses.js # チャット辞書（72キーワード + レベル別クイック質問）
```

## コンテンツ構成（準1級）

23 トピック × 10 例題 + 12 問題演習 = **合計 230 例題 + 276 問題 + 115 模試問題**

### 難易度分布

| 対象 | 基礎 | 標準 | 発展 | 合計 |
|------|------|------|------|------|
| 問題演習 | 58 問 | 124 問 | 94 問 | 276 問 |
| 模擬試験 | 46 問 | 46 問 | 23 問 | 115 問 |

### トピック一覧

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
| APIキー保護 | `ANTHROPIC_API_KEY` は Vercel サーバー側のみ。ブラウザに露出しない |
| AI利用量制限 | ユーザーごと月200回。`ai_usage` テーブルでサーバー側管理 |
| XSS 防御 | React JSX エスケープ、`dangerouslySetInnerHTML` 不使用 |
| HTTPS | Vercel で自動対応、HSTS ヘッダー設定済み |

### セキュリティヘッダー（vercel.json）

| ヘッダー | 設定値 |
|---------|--------|
| Content-Security-Policy | `default-src 'self'`、Supabase・GA・自身のAPI のみ外部接続許可 |
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
- AI機能は利用不可（認証トークンがないため）

**本番運用では必ず Supabase を設定してください。**

### 運用上の注意

- **既存ユーザーへの影響**: スキーマ変更時は必ずマイグレーションスクリプトを使用し、`DROP TABLE` は絶対に実行しないでください
- **環境変数**: `.env` は `.gitignore` に含まれており、Git にコミットされません
- **Supabase anon key**: クライアントサイドで使用される公開キーです。RLS が有効なため、他ユーザーのデータにはアクセスできません
- **Service Role Key**: サーバー側（Vercel 環境変数）でのみ使用。**絶対にクライアントに露出させないでください**

## デプロイ

### Vercel（現在使用中）

GitHub リポジトリと連携済み。`main` ブランチへの push で自動デプロイされます。

環境変数は Vercel ダッシュボードの Settings > Environment Variables で設定：

| 変数名 | スコープ |
|--------|---------|
| `VITE_SUPABASE_URL` | クライアント + サーバー |
| `VITE_SUPABASE_ANON_KEY` | クライアント + サーバー |
| `ANTHROPIC_API_KEY` | サーバーのみ |
| `SUPABASE_URL` | サーバーのみ |
| `SUPABASE_SERVICE_ROLE_KEY` | サーバーのみ |

### 手動デプロイ

```bash
npx vercel --prod
```

## 今後の改善候補

### 優先度: 高

- [ ] 2級・1級の問題数を拡充（現在: 2級20問、1級10問）
- [ ] 1級の教科書トピックを追加（十分統計量、Neyman-Pearson、決定理論、線形モデル論）
- [ ] コード分割によるバンドルサイズ最適化（現在 1.6MB、dynamic import で分割）

### 優先度: 中

- [ ] レート制限（ログイン試行回数の制限）
- [ ] パスワードリセット機能
- [ ] ソーシャルログイン（Google / GitHub）
- [ ] AI利用量のダッシュボード表示（プロフィール画面で今月の残り回数を確認）
- [ ] 模擬試験の記述式回答にもAI評価を適用
- [ ] チャットボットで会話履歴を考慮した応答（複数ターンの文脈維持）

### 優先度: 低

- [ ] PWA 対応（オフラインキャッシュ、ホーム画面追加）
- [ ] ダークモード
- [ ] 問題のシャッフル機能
- [ ] CSV エクスポート（学習履歴のダウンロード）
- [ ] 管理者ダッシュボード（全ユーザーの学習状況・AI利用量の俯瞰）

### 完了済み

- [x] 問題のブックマーク UI 統合
- [x] ブックマーク復習モード
- [x] 難易度タグ（基礎・標準・発展）と難易度別フィルタ
- [x] 弱点分析機能（正答率60%未満のカテゴリ検出）
- [x] 問題数の拡充（184問 → 276問 + 模試115問に難易度付与）
- [x] チャットボットの応答辞書拡充（19 → 72キーワード、レベル別クイック質問）
- [x] 記述式回答のAI評価（Claude Haiku、キーワード採点フォールバック）
- [x] チャットボットのAI応答（Claude Haiku、辞書マッチフォールバック）
- [x] AI利用量のユーザー別月間制限（200回/月 ≈ 100円）

## ライセンス

Private
