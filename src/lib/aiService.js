/**
 * AI サービスクライアント
 * Vercel API Route (/api/ai) を呼び出す
 * Supabase の JWT を Authorization ヘッダーで送信し、ユーザー認証＋月間利用量管理を行う
 */

import { supabase, isSupabaseEnabled } from './supabase.js';

const API_URL = '/api/ai';

/**
 * Supabase のアクセストークンを取得
 */
async function getAuthToken() {
  if (!isSupabaseEnabled) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

/**
 * API リクエストの共通処理
 */
async function apiRequest(type, payload) {
  const token = await getAuthToken();

  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ type, payload }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `API error: ${res.status}`);
  }

  return res.json();
}

/**
 * 記述式回答をAIで評価する
 * @returns {{ score: number, feedback: string, missing: string[], good: string[], remaining?: number }}
 */
export async function evaluateWrittenAnswer({ question, sampleAnswer, keywords, userAnswer }) {
  return apiRequest('evaluate', { question, sampleAnswer, keywords, userAnswer });
}

/**
 * AIチャット応答を取得する
 * @returns {{ response: string, remaining?: number }}
 */
export async function getAIChatResponse({ message, level }) {
  return apiRequest('chat', { message, level });
}

/**
 * ローカルキーワード採点（AI無効時のフォールバック）
 */
export function evaluateLocally({ keywords, userAnswer }) {
  if (!keywords || keywords.length === 0) {
    return { score: null, feedback: 'キーワードが設定されていないため、自動採点できません。模範解答と比較してください。' };
  }

  const answer = userAnswer.toLowerCase();
  const matched = keywords.filter(kw => answer.includes(kw.toLowerCase()));
  const score = Math.round((matched.length / keywords.length) * 100);

  let feedback;
  if (score >= 80) {
    feedback = '主要なポイントをよく押さえています。';
  } else if (score >= 50) {
    feedback = 'いくつかのポイントが含まれていますが、不足している要素があります。';
  } else {
    feedback = '重要なキーワードが不足しています。模範解答を確認しましょう。';
  }

  const missing = keywords.filter(kw => !answer.includes(kw.toLowerCase()));

  return {
    score,
    feedback,
    missing: missing.length > 0 ? [`不足キーワード: ${missing.join(', ')}`] : [],
    good: matched.length > 0 ? [`含まれたキーワード: ${matched.join(', ')}`] : [],
  };
}
