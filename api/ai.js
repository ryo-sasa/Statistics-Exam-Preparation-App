// Vercel Serverless Function: Claude Haiku プロキシ
// 環境変数（すべてVITE_接頭辞なし＝サーバー側のみ）:
//   ANTHROPIC_API_KEY   - Anthropic APIキー
//   SUPABASE_URL        - Supabase プロジェクトURL
//   SUPABASE_SERVICE_ROLE_KEY - Supabase Service Role キー（RLSをバイパス）

import { createClient } from '@supabase/supabase-js';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 1024;

// 月間リクエスト上限（1回 ≈ 0.5円、200回 ≈ 100円）
const MONTHLY_LIMIT = 200;

// インメモリ短期レート制限（DDoS防止）
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 20;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    rateLimit.set(ip, { windowStart: now, count: 1 });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7); // "2026-03"
}

/**
 * Supabase で月間利用量をチェック＋インクリメント
 * @returns {{ allowed: boolean, remaining: number, used: number }}
 */
async function checkAndIncrementUsage(supabase, userId) {
  const month = getCurrentMonth();

  // 現在の利用量を取得
  const { data: existing } = await supabase
    .from('ai_usage')
    .select('request_count')
    .eq('user_id', userId)
    .eq('month', month)
    .single();

  const currentCount = existing?.request_count || 0;

  if (currentCount >= MONTHLY_LIMIT) {
    return { allowed: false, remaining: 0, used: currentCount };
  }

  // upsert でカウントをインクリメント
  if (existing) {
    await supabase
      .from('ai_usage')
      .update({ request_count: currentCount + 1 })
      .eq('user_id', userId)
      .eq('month', month);
  } else {
    await supabase
      .from('ai_usage')
      .insert({ user_id: userId, month, request_count: 1 });
  }

  return { allowed: true, remaining: MONTHLY_LIMIT - currentCount - 1, used: currentCount + 1 };
}

/**
 * Authorization ヘッダーの JWT からユーザーIDを取得
 */
async function getUserFromToken(supabase, authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user.id;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'AI service not configured' });

  // IP レート制限
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'リクエストが多すぎます。少し待ってから再度お試しください。' });
  }

  // Supabase 初期化（サーバー側 Service Role キー）
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let userId = null;
  let usageInfo = null;

  if (supabaseUrl && supabaseServiceKey) {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ユーザー認証
    userId = await getUserFromToken(supabase, req.headers.authorization);

    if (!userId) {
      return res.status(401).json({ error: 'ログインが必要です。AI機能を使うにはログインしてください。' });
    }

    // 月間利用量チェック
    usageInfo = await checkAndIncrementUsage(supabase, userId);
    if (!usageInfo.allowed) {
      return res.status(429).json({
        error: `今月のAI利用上限（${MONTHLY_LIMIT}回）に達しました。来月にリセットされます。`,
        monthly_limit: MONTHLY_LIMIT,
        used: usageInfo.used,
        remaining: 0,
      });
    }
  }
  // Supabase 未設定の場合は IP レート制限のみで動作

  const { type, payload } = req.body || {};
  if (!type || !payload) return res.status(400).json({ error: 'Missing type or payload' });

  try {
    let systemPrompt, userPrompt;

    if (type === 'evaluate') {
      const { question, sampleAnswer, keywords, userAnswer } = payload;
      systemPrompt = `あなたは統計検定の採点官です。受験者の記述式回答を評価してください。

評価基準：
- 正確性：統計学的に正しいか
- 完全性：必要な要素を網羅しているか
- 論理性：説明が論理的か

以下のJSON形式で回答してください（JSONのみ、他のテキスト不要）：
{
  "score": 0〜100の数値,
  "feedback": "総合的なフィードバック（2-3文）",
  "missing": ["不足しているポイント"],
  "good": ["良い点"]
}`;
      userPrompt = `【問題】\n${question}\n\n【模範解答】\n${sampleAnswer}\n\n【キーワード】\n${(keywords || []).join(', ')}\n\n【受験者の回答】\n${userAnswer}`;

    } else if (type === 'chat') {
      const { message, level } = payload;
      const levelName = { '2kyu': '2級', 'jun1kyu': '準1級', '1kyu': '1級' }[level] || '準1級';
      systemPrompt = `あなたは統計検定${levelName}の学習を支援するAIアシスタントです。
統計学の概念を正確かつ分かりやすく日本語で説明してください。
数式はLaTeX記法（$...$）を使ってください。
回答は簡潔に、200文字程度に収めてください。`;
      userPrompt = message;

    } else {
      return res.status(400).json({ error: 'Invalid type. Use "evaluate" or "chat".' });
    }

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', response.status, errText);
      return res.status(502).json({ error: 'AI service error' });
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || '';

    // レスポンスに残り回数を付与
    const usageMeta = usageInfo ? { remaining: usageInfo.remaining, used: usageInfo.used, monthly_limit: MONTHLY_LIMIT } : {};

    if (type === 'evaluate') {
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const evaluation = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        if (evaluation && typeof evaluation.score === 'number') {
          return res.status(200).json({ ...evaluation, ...usageMeta });
        }
      } catch { /* パース失敗 */ }
      return res.status(200).json({ score: null, feedback: content, missing: [], good: [], ...usageMeta });
    }

    return res.status(200).json({ response: content, ...usageMeta });

  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
