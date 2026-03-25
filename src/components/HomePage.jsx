import React from 'react';
import { BookOpen, PenTool, FileText, BarChart3, TrendingUp, Calendar, Flame } from 'lucide-react';

export default function HomePage({ setCurrentPage, selectedLevel, stats, LEVELS, topicCount, questionCount }) {
  const level = LEVELS.find(l => l.id === selectedLevel);

  const statCards = [
    { label: 'カテゴリ数', value: topicCount, icon: BookOpen, color: 'bg-blue-500' },
    { label: '問題数', value: questionCount, icon: PenTool, color: 'bg-purple-500' },
    { label: '回答済み', value: stats.totalAnswered || 0, icon: TrendingUp, color: 'bg-green-500' },
  ];

  const quickNavCards = [
    { id: 'textbook', label: '教科書', icon: BookOpen, color: 'from-blue-500 to-blue-600', description: '統計学の基礎を学ぶ' },
    { id: 'practice', label: '問題演習', icon: PenTool, color: 'from-purple-500 to-purple-600', description: '問題を解いて復習' },
    { id: 'exam', label: '模擬試験', icon: FileText, color: 'from-orange-500 to-orange-600', description: '本番環境で模試' },
    { id: 'progress', label: '学習進捗', icon: BarChart3, color: 'from-green-500 to-green-600', description: '成績を確認' },
  ];

  const hasProgress = stats.totalAnswered > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20 lg:pt-0">
      {/* Hero Banner */}
      <div className={`bg-gradient-to-r ${level?.bgGradient || 'from-blue-600 to-blue-700'} text-white py-12 px-6 lg:px-12`}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold mb-3">
            {level?.name}へようこそ！
          </h1>
          <p className="text-lg opacity-90">
            統計検定合格に向けて、効率的に学習を進めましょう
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">{card.label}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{card.value}</p>
                  </div>
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <Icon size={28} className="text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Overview - Show if has answered questions */}
        {hasProgress && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12 border-l-4 border-blue-500">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">学習状況</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={20} className="text-blue-500" />
                  <p className="text-slate-600 font-medium">正答率</p>
                </div>
                <p className="text-3xl font-bold text-slate-900">
                  {stats.totalAnswered > 0
                    ? ((stats.totalCorrect / stats.totalAnswered) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={20} className="text-purple-500" />
                  <p className="text-slate-600 font-medium">学習日数</p>
                </div>
                <p className="text-3xl font-bold text-slate-900">
                  {stats.studyDays || 0}日
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Flame size={20} className="text-orange-500" />
                  <p className="text-slate-600 font-medium">連続学習</p>
                </div>
                <p className="text-3xl font-bold text-slate-900">
                  {stats.streak || 0}日
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Navigation Cards */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">次のステップ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickNavCards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  onClick={() => setCurrentPage(card.id)}
                  className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-all hover:scale-105 text-left group"
                >
                  <div className={`bg-gradient-to-r ${card.color} p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{card.label}</h3>
                  <p className="text-slate-600">{card.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Encouragement Message */}
        {!hasProgress && (
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8 text-center">
            <p className="text-lg text-slate-700">
              さあ、学習を始めましょう！まずは<span className="font-bold">教科書</span>で基礎を学ぶか、
              <span className="font-bold">問題演習</span>に挑戦してください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
