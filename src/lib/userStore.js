/**
 * localStorage ベースのユーザー管理
 * - ユーザー登録・ログイン・ログアウト
 * - 学習結果の永続化
 * - 連続学習日数（ストリーク）の計算
 */

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

/** ユーザー登録 */
export function signUp(name, email, password) {
  const users = getUsers();
  if (users[email]) {
    return { success: false, error: 'このメールアドレスは既に登録されています' };
  }
  users[email] = {
    name,
    email,
    password, // 本番ではハッシュ化が必要
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
export function login(email, password) {
  const users = getUsers();
  const user = users[email];
  if (!user) {
    return { success: false, error: 'ユーザーが見つかりません' };
  }
  if (user.password !== password) {
    return { success: false, error: 'パスワードが正しくありません' };
  }
  localStorage.setItem(CURRENT_USER_KEY, email);
  return { success: true, user: sanitizeUser(user) };
}

/** ログアウト */
export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

/** 現在のログインユーザーを取得 */
export function getCurrentUser() {
  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return null;
  const data = getUserData(email);
  if (!data) return null;
  return sanitizeUser(data);
}

/** パスワードを除外 */
function sanitizeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

/** 学習結果を保存 */
export function saveResult(result) {
  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return;
  const data = getUserData(email);
  if (!data) return;

  data.results.push({ ...result, timestamp: Date.now() });

  // 学習日を記録
  const today = new Date().toISOString().slice(0, 10);
  if (!data.studyDays.includes(today)) {
    data.studyDays.push(today);
  }

  saveUserData(email, data);
}

/** 学習結果を取得 */
export function getResults() {
  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return [];
  const data = getUserData(email);
  return data?.results || [];
}

/** 連続学習日数を計算 */
export function getStreak() {
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
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/** 学習統計を取得 */
export function getStats() {
  const results = getResults();
  const email = localStorage.getItem(CURRENT_USER_KEY);
  const data = email ? getUserData(email) : null;

  return {
    totalAnswered: results.length,
    totalCorrect: results.filter((r) => r.isCorrect).length,
    studyDays: data?.studyDays?.length || 0,
    streak: getStreak(),
  };
}

/** レベル設定を保存 */
export function saveSelectedLevel(level) {
  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return;
  const data = getUserData(email);
  if (!data) return;
  data.selectedLevel = level;
  saveUserData(email, data);
}

/** レベル設定を取得 */
export function getSelectedLevel() {
  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return 'jun1kyu';
  const data = getUserData(email);
  return data?.selectedLevel || 'jun1kyu';
}

/** ブックマークの操作 */
export function toggleBookmark(questionId) {
  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return;
  const data = getUserData(email);
  if (!data) return;
  if (!data.bookmarks) data.bookmarks = [];

  const idx = data.bookmarks.indexOf(questionId);
  if (idx >= 0) {
    data.bookmarks.splice(idx, 1);
  } else {
    data.bookmarks.push(questionId);
  }
  saveUserData(email, data);
}

export function getBookmarks() {
  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return [];
  const data = getUserData(email);
  return data?.bookmarks || [];
}

/** プロフィール更新 */
export function updateProfile(updates) {
  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return { success: false };
  const data = getUserData(email);
  if (!data) return { success: false };

  if (updates.name) data.name = updates.name;
  saveUserData(email, data);
  return { success: true, user: sanitizeUser(data) };
}

/** 学習履歴をリセット */
export function resetProgress() {
  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return;
  const data = getUserData(email);
  if (!data) return;
  data.results = [];
  data.studyDays = [];
  data.bookmarks = [];
  saveUserData(email, data);
}
