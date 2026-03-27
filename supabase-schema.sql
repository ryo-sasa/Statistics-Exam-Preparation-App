-- ============================================================
-- 統計検定道場 - Supabase データベーススキーマ
-- ============================================================

-- 1. profiles テーブル（ユーザープロフィール）
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  selected_level TEXT NOT NULL DEFAULT 'jun1kyu',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. results テーブル（学習結果）
CREATE TABLE IF NOT EXISTS results (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  topic_id TEXT,
  level TEXT,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  user_answer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. study_days テーブル（学習日記録）
CREATE TABLE IF NOT EXISTS study_days (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  study_date DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(user_id, study_date)
);

-- 4. bookmarks テーブル（ブックマーク）
CREATE TABLE IF NOT EXISTS bookmarks (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, question_id)
);

-- ============================================================
-- マイグレーション: 難易度カラムの追加 (2026-03-27)
-- 既存データに影響なし（DEFAULT NULL で追加）
-- ============================================================
ALTER TABLE results ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT NULL;

-- マイグレーション: ユーザー別AI利用上限カラムの追加 (2026-03-27)
-- NULL の場合はデフォルト上限（200回/月）が適用される
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ai_monthly_limit INT DEFAULT NULL;

-- 5. ai_usage テーブル（AI利用量の月次管理）(2026-03-27)
CREATE TABLE IF NOT EXISTS ai_usage (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month TEXT NOT NULL,              -- '2026-03' 形式
  request_count INT NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, month)
);

-- ============================================================
-- インデックス
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_results_user_id ON results(user_id);
CREATE INDEX IF NOT EXISTS idx_results_created_at ON results(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_study_days_user_id ON study_days(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_month ON ai_usage(user_id, month);

-- ============================================================
-- Row Level Security (RLS) ポリシー
-- ============================================================

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING ((select auth.uid()) = id);

-- results
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own results"
  ON results FOR SELECT
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own results"
  ON results FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own results"
  ON results FOR DELETE
  USING ((select auth.uid()) = user_id);

-- study_days
ALTER TABLE study_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own study days"
  ON study_days FOR SELECT
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own study days"
  ON study_days FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own study days"
  ON study_days FOR DELETE
  USING ((select auth.uid()) = user_id);

-- bookmarks
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  USING ((select auth.uid()) = user_id);

-- ai_usage（API Route が Service Role Key でアクセスするため、ユーザー側は閲覧のみ）
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ai usage"
  ON ai_usage FOR SELECT
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own ai usage"
  ON ai_usage FOR UPDATE
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own ai usage"
  ON ai_usage FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);
