import React, { useState } from 'react';
import { User, Mail, Calendar, Award, Trash2, BookMarked, LogOut, Save } from 'lucide-react';

export default function ProfilePage({ user, onUpdateProfile, onResetProgress, onLogout }) {
  const [editName, setEditName] = useState(user?.name || '');
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSave = async () => {
    if (editName.trim()) {
      await onUpdateProfile({ name: editName.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleReset = async () => {
    if (confirmReset) {
      await onResetProgress();
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 5000);
    }
  };

  const createdDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('ja-JP')
    : '不明';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20 lg:pt-0">
      <div className="max-w-2xl mx-auto px-6 lg:px-12 py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">プロフィール</h1>
        <p className="text-slate-600 mb-8">アカウント情報と設定を管理します</p>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.[0] || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{user?.name || 'ユーザー'}</h2>
              <p className="text-slate-500 text-sm">{user?.email || 'ゲスト'}</p>
            </div>
          </div>

          {/* Edit Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <User size={16} className="inline mr-1" />
              表示名
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 flex items-center gap-2 transition-colors"
              >
                <Save size={16} />
                {saved ? '保存しました' : '保存'}
              </button>
            </div>
          </div>

          {/* Info Items */}
          <div className="space-y-4 border-t border-slate-200 pt-6">
            <div className="flex items-center gap-3 text-slate-700">
              <Mail size={18} className="text-slate-400" />
              <span className="text-sm">{user?.email || 'ゲストモード'}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Calendar size={18} className="text-slate-400" />
              <span className="text-sm">登録日: {createdDate}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Award size={18} className="text-slate-400" />
              <span className="text-sm">学習日数: {user?.studyDays?.length || 0}日</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <BookMarked size={18} className="text-slate-400" />
              <span className="text-sm">ブックマーク: {user?.bookmarks?.length || 0}問</span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-red-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">設定</h3>

          <div className="space-y-4">
            <button
              onClick={handleReset}
              className={`w-full px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                confirmReset
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
              }`}
            >
              <Trash2 size={18} />
              {confirmReset ? '本当にリセットしますか？もう一度クリック' : '学習進捗をリセット'}
            </button>

            <button
              onClick={onLogout}
              className="w-full px-4 py-3 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-medium hover:bg-slate-200 flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut size={18} />
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
