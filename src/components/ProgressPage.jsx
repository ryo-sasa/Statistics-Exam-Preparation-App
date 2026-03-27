import React, { useState } from 'react';
import { CheckCircle, AlertCircle, TrendingUp, Calendar, Target, ChevronDown, ChevronUp } from 'lucide-react';

export default function ProgressPage({ selectedLevel, results, topics, questions }) {
  // Calculate summary statistics
  const totalAnswers = results.length;
  const totalCorrect = results.filter(r => r.isCorrect).length;
  const accuracyRate = totalAnswers > 0 ? ((totalCorrect / totalAnswers) * 100).toFixed(1) : 0;

  const [expandedTopics, setExpandedTopics] = useState({});

  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  // Build a map of question ID -> latest result
  const questionResultMap = {};
  results.forEach(r => {
    questionResultMap[r.questionId] = r;
  });

  // All questions for this level
  const allQuestions = questions || [];

  // Calculate topic-by-topic progress
  const topicProgress = topics.map(topic => {
    const topicQuestions = allQuestions.filter(q => q.topic === topic.id);
    const topicResults = results.filter(r => r.topicId === topic.id);
    const topicCorrect = topicResults.filter(r => r.isCorrect).length;
    const topicAnswered = topicResults.length;

    // Per-question status (solved or not, latest result)
    const questionStatus = topicQuestions.map(q => {
      const result = questionResultMap[q.id];
      return {
        id: q.id,
        question: q.question,
        type: q.type,
        solved: !!result,
        isCorrect: result?.isCorrect ?? null,
        timestamp: result?.timestamp ?? null,
      };
    });

    const solvedCount = questionStatus.filter(q => q.solved).length;

    return {
      id: topic.id,
      name: topic.name,
      answered: topicAnswered,
      correct: topicCorrect,
      accuracy: topicAnswered > 0 ? ((topicCorrect / topicAnswered) * 100).toFixed(1) : 0,
      totalQuestions: topicQuestions.length,
      solvedCount,
      questionStatus,
    };
  });

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

              {topicProgress.filter(t => t.totalQuestions > 0).length === 0 ? (
                <p className="text-slate-600 text-center py-8">
                  まだデータがありません
                </p>
              ) : (
                <div className="space-y-6">
                  {topicProgress.filter(t => t.totalQuestions > 0).map(topic => (
                    <div key={topic.id}>
                      <button
                        onClick={() => toggleTopic(topic.id)}
                        className="w-full text-left"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {expandedTopics[topic.id] ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                            <h3 className="font-semibold text-slate-900">{topic.name}</h3>
                          </div>
                          <span className="text-sm font-bold text-slate-700">
                            {topic.solvedCount} / {topic.totalQuestions} 問解答済
                            {topic.answered > 0 && ` (正答率 ${topic.accuracy}%)`}
                          </span>
                        </div>
                      </button>

                      {/* Progress Bar - solved count based */}
                      <div className="w-full bg-slate-200 rounded-full h-3 mb-1">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            topic.solvedCount === topic.totalQuestions
                              ? 'bg-green-500'
                              : topic.solvedCount > 0
                              ? 'bg-blue-500'
                              : 'bg-slate-300'
                          }`}
                          style={{ width: `${(topic.solvedCount / topic.totalQuestions) * 100}%` }}
                        />
                      </div>

                      {/* Status indicator */}
                      <div className="mt-1 text-xs text-slate-600">
                        {topic.solvedCount === topic.totalQuestions
                          ? '✓ 全問解答済み'
                          : topic.solvedCount > 0
                          ? `残り ${topic.totalQuestions - topic.solvedCount} 問`
                          : '未着手'}
                      </div>

                      {/* Expanded question details */}
                      {expandedTopics[topic.id] && (
                        <div className="mt-3 space-y-2 pl-6">
                          {topic.questionStatus.map((q, idx) => (
                            <div
                              key={q.id}
                              className={`p-3 rounded-lg border text-sm ${
                                q.solved
                                  ? q.isCorrect
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-red-50 border-red-200'
                                  : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <span className="flex-shrink-0 mt-0.5">
                                  {q.solved
                                    ? q.isCorrect
                                      ? <CheckCircle size={16} className="text-green-600" />
                                      : <AlertCircle size={16} className="text-red-600" />
                                    : <span className="inline-block w-4 h-4 rounded-full border-2 border-slate-300" />
                                  }
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-slate-800 leading-relaxed">
                                    <span className="font-medium text-slate-500">問{idx + 1}.</span>{' '}
                                    {q.question.length > 80 ? q.question.slice(0, 80) + '...' : q.question}
                                  </p>
                                  <div className="flex items-center gap-3 mt-1">
                                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                                      q.type === 'choice' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                    }`}>
                                      {q.type === 'choice' ? '選択式' : '記述式'}
                                    </span>
                                    {q.solved && (
                                      <span className={`text-xs ${q.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                        {q.isCorrect ? '正解' : '不正解'}
                                        {q.timestamp && ` — ${formatDate(q.timestamp)}`}
                                      </span>
                                    )}
                                    {!q.solved && (
                                      <span className="text-xs text-slate-400">未解答</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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
                    const question = allQuestions.find(q => q.id === result.questionId);
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border-l-4 ${
                          result.isCorrect
                            ? 'bg-green-50 border-green-500'
                            : 'bg-red-50 border-red-500'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            {result.isCorrect ? (
                              <CheckCircle size={20} className="text-green-600" />
                            ) : (
                              <AlertCircle size={20} className="text-red-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">
                                {topic?.name || 'カテゴリ未設定'}
                              </span>
                              <span className={`text-xs font-medium ${result.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                {result.isCorrect ? '正解' : '不正解'}
                              </span>
                              <span className="text-xs text-slate-400 ml-auto flex-shrink-0">
                                {formatDate(result.timestamp || result.answered)}
                              </span>
                            </div>
                            {question && (
                              <p className="text-sm text-slate-800 leading-relaxed">
                                {question.question.length > 100 ? question.question.slice(0, 100) + '...' : question.question}
                              </p>
                            )}
                          </div>
                        </div>
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
