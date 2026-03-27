import React, { useState } from 'react';
import { GraduationCap, LogIn, UserPlus, Eye, EyeOff, Loader2 } from 'lucide-react';
import { validateEmail, validatePassword, validateName } from '../lib/userStore.js';

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // バリデーション
    if (mode === 'signup') {
      const nameCheck = validateName(name);
      if (!nameCheck.isValid) {
        setError(nameCheck.error);
        return;
      }
    }

    if (!email.trim()) {
      setError('メールアドレスを入力してください');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError('有効なメールアドレスを入力してください');
      return;
    }

    if (mode === 'signup') {
      const pwCheck = validatePassword(password);
      if (!pwCheck.isValid) {
        setError(pwCheck.errors[0]);
        return;
      }
    } else {
      if (!password || password.length < 1) {
        setError('パスワードを入力してください');
        return;
      }
    }

    setLoading(true);
    try {
      const result = await onLogin(mode, { name: name.trim(), email: email.trim(), password });
      if (result && !result.success) {
        setError(result.error || 'エラーが発生しました');
      }
    } catch (err) {
      setError('接続エラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl mb-4">
            <GraduationCap size={36} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">統計検定道場</h1>
          <p className="text-slate-300 mt-2">Statistical Learning Hub</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Tab Switch */}
          <div className="flex mb-6 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              ログイン
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              新規登録
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">名前</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="山田太郎"
                  maxLength={50}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                パスワード
                {mode === 'signup' && (
                  <span className="text-xs text-slate-400 ml-2">
                    8文字以上（大文字・小文字・数字を含む）
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? '8文字以上' : 'パスワード'}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : mode === 'login' ? (
                <>
                  <LogIn size={20} />
                  ログイン
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  アカウント作成
                </>
              )}
            </button>
          </form>

          {/* Admin mode */}
          <div className="mt-4 text-center">
            {!showAdminPrompt ? (
              <button
                onClick={() => setShowAdminPrompt(true)}
                disabled={loading}
                className="text-sm text-slate-500 hover:text-blue-600 underline disabled:opacity-50"
              >
                管理者モード
              </button>
            ) : (
              <div className="mt-2 space-y-2">
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (adminPassword === (import.meta.env.VITE_ADMIN_PASSWORD || '')) {
                        onLogin('guest');
                      } else {
                        setError('管理者パスワードが正しくありません');
                        setAdminPassword('');
                      }
                    }
                  }}
                  placeholder="管理者パスワード"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (adminPassword === (import.meta.env.VITE_ADMIN_PASSWORD || '')) {
                        onLogin('guest');
                      } else {
                        setError('管理者パスワードが正しくありません');
                        setAdminPassword('');
                      }
                    }}
                    className="flex-1 py-2 bg-slate-700 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
                  >
                    ログイン
                  </button>
                  <button
                    onClick={() => { setShowAdminPrompt(false); setAdminPassword(''); setError(''); }}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300"
                  >
                    戻る
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
