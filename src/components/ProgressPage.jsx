import React from 'react';
import { CheckCircle, AlertCircle, TrendingUp, Calendar, Target } from 'lucide-react';

export default function ProgressPage({ selectedLevel, results, topics }) {
  // Calculate summary statistics
  const totalAnswers = results.length;
  const totalCorrect = results.filter(r => r.isCorrect).length;
  const accuracyRate = totalAnswers > 0 ? ((totalCorrect / totalAnswers) * 100).toFixed(1) : 0;

  // Calculate topic-by-topic progress
  const topicProgress = topics.map(topic => {
    const topicResults = results.filter(r => r.topicId === topic.id);
    const topicCorrect = topicResults.filter(r => r.isCorrect).length;
    const topicAnswered = topicResults.length;

    return {
      id: topic.id,
      name: topic.name,
      answered: topicAnswered,
      correct: topicCorrect,
      accuracy: topicAnswered > 0 ? ((topicCorrect / topicAnswered) * 100).toFixed(1) : 0,
    };
  }).filter(t => t.answered > 0);

  // Get recent answers (last 10)
  const recentAnswers = results.slice(-10).reverse();

  // Format date
  const formatDate = (dateObj) => {
    if (!dateObj) return '不明';
    const date = new Date(dateObj);
    return date.toLocaleDateString('ja-JP');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20 lg:pt-0">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">学習進捗</h1>
        <p className="text-slate-600 mb-8">あなたの学習状況を確認します</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Answers Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-600 text-sm font-medium">総回答数</p>
              <div className="bg-blue-100 p-2 rounded-lg">
                <Target size={24} className="text-blue-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-slate-900">{totalAnswers}</p>
            <p className="text-xs text-slate-500 mt-2">問題に回答しました</p>
          </div>

          {/* Correct Answers Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-600 text-sm font-medium">正解数</p>
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-slate-900">{totalCorrect}</p>
            <p className="text-xs text-slate-500 mt-2">正解を獲得しました</p>
          </div>

          {/* Accuracy Rate Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-600 text-sm font-medium">正答率</p>
              <div className="bg-purple-100 p-2 rounded-lg">
                <TrendingUp size={24} className="text-purple-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-slate-900">{accuracyRate}%</p>
            <p className="text-xs text-slate-500 mt-2">
              {accuracyRate >= 80 ? '合格圏内です！' : 'もっと頑張ろう！'}
            </p>
          </div>
        </div>

        {/* Empty State */}
        {totalAnswers === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="inline-block p-4 bg-slate-100 rounded-full mb-4">
              <AlertCircle size={48} className="text-slate-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">まだ問題を解いていません</h2>
            <p className="text-slate-600">
              問題演習を始めると、ここに学習進捗が表示されます
            </p>
          </div>
        ) : (
          <>
            {/* Topic Progress Section */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">カテゴリ別進捗</h2>

              {topicProgress.length === 0 ? (
                <p className="text-slate-600 text-center py-8">
                  まだデータがありません
                </p>
              ) : (
                <div className="space-y-6">
                  {topicProgress.map(topic => (
                    <div key={topic.id}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-slate-900">{topic.name}</h3>
                        <span className="text-sm font-bold text-slate-700">
                          {topic.correct} / {topic.answered} ({topic.accuracy}%)
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            topic.accuracy >= 80
                              ? 'bg-green-500'
                              : topic.accuracy >= 60
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${topic.accuracy}%` }}
                        />
                      </div>

                      {/* Status indicator */}
                      <div className="mt-2 text-xs text-slate-600">
                        {topic.accuracy >= 80 ? '✓ 苦手分野を克服' : '⚠ 復習が必要'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Answers Section */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">最近の回答履歴</h2>

              {recentAnswers.length === 0 ? (
                <p className="text-slate-600 text-center py-8">
                  まだデータがありません
                </p>
              ) : (
                <div className="space-y-3">
                  {recentAnswers.map((result, idx) => {
                    const topic = topics.find(t => t.id === result.topicId);
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border-l-4 flex items-center justify-between ${
                          result.isCorrect
                            ? 'bg-green-50 border-green-500'
                            : 'bg-red-50 border-red-500'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {result.isCorrect ? (
                            <CheckCircle size={24} className="text-green-600" />
                          ) : (
                            <AlertCircle size={24} className="text-red-600" />
                          )}
                          <div>
                            <p className="font-medium text-slate-900">
                              {topic?.name || 'カテゴリ未設定'}
                            </p>
                            <p className="text-sm text-slate-600">
                              {result.isCorrect ? '正解' : '不正解'}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600">
                          {formatDate(result.timestamp || result.answered)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
