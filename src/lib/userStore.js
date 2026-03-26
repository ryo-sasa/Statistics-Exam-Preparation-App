/**
 * ユーザー管理モジュール
 * - Supabase が有効な場合: Supabase Auth + Database
 * - Supabase が無効な場合: localStorage フォールバック
 */

import { supabase, isSupabaseEnabled } from './supabase.js';

// ============================================================
// バリデーションユーティリティ
// ============================================================

/** メールアドレスの形式チェック */
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/** パスワード強度チェック */
export function validatePassword(password) {
  const errors = [];
  if (password.length < 8) errors.push('8文字以上で入力してください');
  if (!/[A-Z]/.test(password)) errors.push('大文字を1つ以上含めてください');
  if (!/[a-z]/.test(password)) errors.push('小文字を1つ以上含めてください');
  if (!/[0-9]/.test(password)) errors.push('数字を1つ以上含めてください');
  return { isValid: errors.length === 0, errors };
}

/** 名前のバリデーション */
export function validateName(name) {
  if (!name || name.trim().length === 0) return { isValid: false, error: '名前を入力してください' };
  if (name.trim().length > 50) return { isValid: false, error: '名前は50文字以内で入力してください' };
  return { isValid: true, error: null };
}

// ============================================================
// localStorage フォールバック（既存ロジック）
// ============================================================

const USERS_KEY = 'stat_app_users';
const CURRENT_USER_KEY = 'stat_app_current_user';

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
  } catch {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getUserData(userId) {
  const users = getUsers();
  return users[userId] || null;
}

function saveUserData(userId, data) {
  const users = getUsers();
  users[userId] = data;
  saveUsers(users);
}

function sanitizeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

// ============================================================
// Supabase 認証
// ============================================================

/** ユーザー登録 */
export async function signUp(name, email, password) {
  // バリデーション
  const nameCheck = validateName(name);
  if (!nameCheck.isValid) return { success: false, error: nameCheck.error };
  if (!validateEmail(email)) return { success: false, error: '有効なメールアドレスを入力してください' };
  const pwCheck = validatePassword(password);
  if (!pwCheck.isValid) return { success: false, error: pwCheck.errors[0] };

  if (isSupabaseEnabled) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: name.trim() } },
    });
    if (error) {
      if (error.message.includes('already registered')) {
        return { success: false, error: 'このメールアドレスは既に登録されています' };
      }
      return { success: false, error: error.message };
    }

    // プロフィールを profiles テーブルに作成
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        name: name.trim(),
        email,
        selected_level: 'jun1kyu',
        created_at: new Date().toISOString(),
      });
    }

    return {
      success: true,
      user: { name: name.trim(), email, id: data.user?.id },
    };
  }

  // localStorage フォールバック
  const users = getUsers();
  if (users[email]) {
    return { success: false, error: 'このメールアドレスは既に登録されています' };
  }
  users[email] = {
    name: name.trim(),
    email,
    password,
    createdAt: Date.now(),
    selectedLevel: 'jun1kyu',
    results: [],
    studyDays: [],
    bookmarks: [],
  };
  saveUsers(users);
  localStorage.setItem(CURRENT_USER_KEY, email);
  return { success: true, user: sanitizeUser(users[email]) };
}

/** ログイン */
export async function login(email, password) {
  if (!validateEmail(email)) return { success: false, error: '有効なメールアドレスを入力してください' };
  if (!password || password.length < 1) return { success: false, error: 'パスワードを入力してください' };

  if (isSupabaseEnabled) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { success: false, error: 'メールアドレスまたはパスワードが正しくありません' };
    }

    // プロフィールを取得
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return {
      success: true,
      user: {
        name: profile?.name || data.user.user_metadata?.name || 'ユーザー',
        email: data.user.email,
        id: data.user.id,
      },
    };
  }

  // localStorage フォールバック
  const users = getUsers();
  const user = users[email];
  if (!user) return { success: false, error: 'ユーザーが見つかりません' };
  if (user.password !== password) return { success: false, error: 'パスワードが正しくありません' };
  localStorage.setItem(CURRENT_USER_KEY, email);
  return { success: true, user: sanitizeUser(user) };
}

/** ログアウト */
export async function logout() {
  if (isSupabaseEnabled) {
    await supabase.auth.signOut();
    return;
  }
  localStorage.removeItem(CURRENT_USER_KEY);
}

/** 現在のログインユーザーを取得 */
export async function getCurrentUser() {
  if (isSupabaseEnabled) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      name: profile?.name || user.user_metadata?.name || 'ユーザー',
      email: user.email,
      id: user.id,
      selectedLevel: profile?.selected_level || 'jun1kyu',
    };
  }

  // localStorage フォールバック
  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return null;
  const data = getUserData(email);
  if (!data) return null;
  return sanitizeUser(data);
}

/** 学習結果を保存 */
export async function saveResult(result) {
  if (isSupabaseEnabled) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('results').insert({
      user_id: user.id,
      question_id: result.questionId,
      topic_id: result.topicId,
      level: result.level,
      is_correct: result.isCorrect,
      user_answer: result.userAnswer || null,
      created_at: new Date().toISOString(),
    });

    // 学習日を記録
    const today = new Date().toISOString().slice(0, 10);
    await supabase.from('study_days').upsert({
      user_id: user.id,
      study_date: today,
    }, { onConflict: 'user_id,study_date' });
    return;
  }

  // localStorage フォールバック
  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return;
  const data = getUserData(email);
  if (!data) return;
  data.results.push({ ...result, timestamp: Date.now() });
  const today = new Date().toISOString().slice(0, 10);
  if (!data.studyDays.includes(today)) data.studyDays.push(today);
  saveUserData(email, data);
}

/** 学習結果を取得 */
export async function getResults() {
  if (isSupabaseEnabled) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
      .from('results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return (data || []).map(r => ({
      questionId: r.question_id,
      topicId: r.topic_id,
      level: r.level,
      isCorrect: r.is_correct,
      userAnswer: r.user_answer,
      timestamp: new Date(r.created_at).getTime(),
    }));
  }

  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return [];
  const data = getUserData(email);
  return data?.results || [];
}

/** 連続学習日数を計算 */
export async function getStreak() {
  if (isSupabaseEnabled) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { data: days } = await supabase
      .from('study_days')
      .select('study_date')
      .eq('user_id', user.id)
      .order('study_date', { ascending: false });

    if (!days || days.length === 0) return 0;

    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const sortedDates = days.map(d => d.study_date);

    if (sortedDates[0] !== today && sortedDates[0] !== yesterday) return 0;

    let streak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diff = (prev - curr) / 86400000;
      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  // localStorage フォールバック
  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return 0;
  const data = getUserData(email);
  if (!data || !data.studyDays || data.studyDays.length === 0) return 0;

  const days = [...data.studyDays].sort().reverse();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (days[0] !== today && days[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const curr = new Date(days[i]);
    const diff = (prev - curr) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

/** 学習統計を取得 */
export async function getStats() {
  const results = await getResults();
  const streak = await getStreak();

  if (isSupabaseEnabled) {
    const { data: { user } } = await supabase.auth.getUser();
    const { count } = await supabase
      .from('study_days')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user?.id);

    return {
      totalAnswered: results.length,
      totalCorrect: results.filter(r => r.isCorrect).length,
      studyDays: count || 0,
      streak,
    };
  }

  const email = localStorage.getItem(CURRENT_USER_KEY);
  const data = email ? getUserData(email) : null;
  return {
    totalAnswered: results.length,
    totalCorrect: results.filter(r => r.isCorrect).length,
    studyDays: data?.studyDays?.length || 0,
    streak,
  };
}

/** レベル設定を保存 */
export async function saveSelectedLevel(level) {
  if (isSupabaseEnabled) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('profiles').update({ selected_level: level }).eq('id', user.id);
    return;
  }

  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return;
  const data = getUserData(email);
  if (!data) return;
  data.selectedLevel = level;
  saveUserData(email, data);
}

/** レベル設定を取得 */
export async function getSelectedLevel() {
  if (isSupabaseEnabled) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 'jun1kyu';
    const { data: profile } = await supabase
      .from('profiles')
      .select('selected_level')
      .eq('id', user.id)
      .single();
    return profile?.selected_level || 'jun1kyu';
  }

  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return 'jun1kyu';
  const data = getUserData(email);
  return data?.selectedLevel || 'jun1kyu';
}

/** ブックマークの操作 */
export async function toggleBookmark(questionId) {
  if (isSupabaseEnabled) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: existing } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq('question_id', questionId)
      .single();

    if (existing) {
      await supabase.from('bookmarks').delete().eq('id', existing.id);
    } else {
      await supabase.from('bookmarks').insert({ user_id: user.id, question_id: questionId });
    }
    return;
  }

  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return;
  const data = getUserData(email);
  if (!data) return;
  if (!data.bookmarks) data.bookmarks = [];
  const idx = data.bookmarks.indexOf(questionId);
  if (idx >= 0) data.bookmarks.splice(idx, 1);
  else data.bookmarks.push(questionId);
  saveUserData(email, data);
}

export async function getBookmarks() {
  if (isSupabaseEnabled) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data } = await supabase
      .from('bookmarks')
      .select('question_id')
      .eq('user_id', user.id);
    return (data || []).map(b => b.question_id);
  }

  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return [];
  const data = getUserData(email);
  return data?.bookmarks || [];
}

/** プロフィール更新 */
export async function updateProfile(updates) {
  const nameCheck = validateName(updates.name);
  if (updates.name && !nameCheck.isValid) return { success: false, error: nameCheck.error };

  if (isSupabaseEnabled) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false };

    const { error } = await supabase
      .from('profiles')
      .update({ name: updates.name?.trim() })
      .eq('id', user.id);

    if (error) return { success: false, error: error.message };

    return {
      success: true,
      user: { name: updates.name?.trim(), email: user.email, id: user.id },
    };
  }

  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return { success: false };
  const data = getUserData(email);
  if (!data) return { success: false };
  if (updates.name) data.name = updates.name.trim();
  saveUserData(email, data);
  return { success: true, user: sanitizeUser(data) };
}

/** 学習履歴をリセット */
export async function resetProgress() {
  if (isSupabaseEnabled) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('results').delete().eq('user_id', user.id);
    await supabase.from('study_days').delete().eq('user_id', user.id);
    await supabase.from('bookmarks').delete().eq('user_id', user.id);
    return;
  }

  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return;
  const data = getUserData(email);
  if (!data) return;
  data.results = [];
  data.studyDays = [];
  data.bookmarks = [];
  saveUserData(email, data);
}
