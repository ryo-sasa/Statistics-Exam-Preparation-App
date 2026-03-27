import React, { useState, useEffect } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { MathText, renderInlineContent } from './MathText.jsx';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function ExamPage({ selectedLevel, questions, addResult, LEVELS }) {
  const [phase, setPhase] = useState('setup'); // setup, running, review
  const [timeLimit, setTimeLimit] = useState(60); // minutes
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [results, setResults] = useState(null);

  const level = LEVELS.find(l => l.id === selectedLevel);
  // Exam only uses choice questions
  const examQuestions = (questions || []).filter(q => q.type === 'choice');

  // Timer logic
  useEffect(() => {
    if (phase !== 'running') return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          setPhase('review');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = () => {
    setPhase('running');
    setTimeRemaining(timeLimit * 60);
    setStartTime(Date.now());
    setUserAnswers({});
    setCurrentQuestionIdx(0);
  };

  const handleAnswerQuestion = (questionId, answerIdx) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIdx
    }));
  };

  const handleFinishExam = () => {
    let correct = 0;
    examQuestions.forEach(q => {
      const isCorrect = userAnswers[q.id] === q.correctIndex;
      if (isCorrect) correct++;
      addResult({
        questionId: q.id,
        topicId: q.topic,
        level: selectedLevel,
        isCorrect,
      });
    });

    const elapsedMinutes = Math.round((Date.now() - startTime) / 1000 / 60);
    setResults({
      correct,
      total: examQuestions.length,
      percentage: examQuestions.length > 0 ? Math.round((correct / examQuestions.length) * 100) : 0,
      timeSpent: elapsedMinutes,
    });
    setPhase('review');
  };

  const handleRetry = () => {
    setPhase('setup');
    setUserAnswers({});
    setCurrentQuestionIdx(0);
    setResults(null);
  };

  // SETUP PHASE
  if (phase === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20 lg:pt-0">
        <div className="max-w-2xl mx-auto px-6 lg:px-12 py-12">
          <div className={`bg-gradient-to-r ${level?.bgGradient || 'from-blue-600 to-blue-700'} text-white rounded-lg p-8 mb-8`}>
            <h1 className="text-4xl font-bold mb-2">模擬試験</h1>
            <p className="text-lg opacity-90">{level?.name}のレベルで本番環境を体験</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900 mb-4">試験内容</h2>
              <div className="space-y-2 text-slate-700">
                <p><span className="font-semibold">出題数:</span> {examQuestions.length} 問</p>
                <p><span className="font-semibold">問題形式:</span> 選択式</p>
                <p><span className="font-semibold">難易度:</span> {level?.name}</p>
              </div>
            </div>

            <div>
              <label className="block text-lg font-bold text-slate-900 mb-4">
                制限時間を選択してください
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[30, 60, 90, 120].map(minutes => (
                  <button
                    key={minutes}
                    onClick={() => setTimeLimit(minutes)}
                    className={`px-4 py-4 rounded-lg font-bold transition-all ${
                      timeLimit === minutes
                        ? 'bg-blue-500 text-white shadow-lg scale-105'
                        : 'bg-slate-100 text-slate-900 border border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {minutes}分
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartExam}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-blue-600 hover:to-blue-700 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <Play size={24} />
              試験を開始
            </button>
          </div>
        </div>
      </div>
    );
  }

  // RUNNING PHASE
  if (phase === 'running') {
    const currentQuestion = examQuestions[currentQuestionIdx];
    const currentAnswer = userAnswers[currentQuestion?.id];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20 lg:pt-0">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 py-6">
          <div className="bg-white rounded-lg shadow p-4 mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">進捗</p>
              <p className="text-xl font-bold text-slate-900">
                {currentQuestionIdx + 1} / {examQuestions.length}
              </p>
            </div>
            <div className={`text-center px-6 py-3 rounded-lg font-bold text-2xl ${
              timeRemaining < 600 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {formatTime(timeRemaining)}
            </div>
            <button
              onClick={handleFinishExam}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
            >
              終了する
            </button>
          </div>

          <div className="bg-white rounded-lg p-3 mb-6 shadow">
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestionIdx + 1) / examQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <p className="text-sm font-semibold text-slate-700 mb-3">クイックナビゲーション</p>
            <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
              {examQuestions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIdx(idx)}
                  className={`w-10 h-10 rounded font-bold text-sm transition-all ${
                    idx === currentQuestionIdx
                      ? 'bg-blue-500 text-white shadow-lg scale-110'
                      : userAnswers[q.id] !== undefined
                      ? 'bg-green-500 text-white hover:scale-105'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {currentQuestion && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">
                <MathText text={currentQuestion.question} keyPrefix="eq" />
              </h2>

              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((optionText, idx) => {
                  const label = OPTION_LABELS[idx];
                  const isSelected = currentAnswer === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerQuestion(currentQuestion.id, idx)}
                      className={`w-full p-4 rounded-lg font-medium text-left transition-all ${
                        isSelected
                          ? 'bg-blue-50 border-2 border-blue-500 text-slate-900'
                          : 'bg-white border-2 border-slate-300 text-slate-900 hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold">
                          {label}
                        </div>
                        <span>{renderInlineContent(optionText, `eopt-${idx}`)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentQuestionIdx(Math.max(0, currentQuestionIdx - 1))}
                  disabled={currentQuestionIdx === 0}
                  className="px-6 py-3 bg-slate-200 text-slate-900 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300"
                >
                  前へ
                </button>

                <button
                  onClick={() => setCurrentQuestionIdx(Math.min(examQuestions.length - 1, currentQuestionIdx + 1))}
                  disabled={currentQuestionIdx === examQuestions.length - 1}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 flex items-center gap-2"
                >
                  次へ
                </button>

                {currentQuestionIdx === examQuestions.length - 1 && (
                  <button
                    onClick={handleFinishExam}
                    className="ml-auto px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
                  >
                    試験を終了
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // REVIEW PHASE
  if (phase === 'review' && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20 lg:pt-0">
        <div className="max-w-2xl mx-auto px-6 lg:px-12 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">試験結果</h1>

            <div className="grid grid-cols-3 gap-6 my-8">
              <div className="p-6 bg-blue-50 rounded-lg">
                <p className="text-sm text-slate-600 font-medium mb-2">正答数</p>
                <p className="text-4xl font-bold text-blue-600">
                  {results.correct} / {results.total}
                </p>
              </div>
              <div className="p-6 bg-purple-50 rounded-lg">
                <p className="text-sm text-slate-600 font-medium mb-2">正答率</p>
                <p className="text-4xl font-bold text-purple-600">{results.percentage}%</p>
              </div>
              <div className="p-6 bg-green-50 rounded-lg">
                <p className="text-sm text-slate-600 font-medium mb-2">所要時間</p>
                <p className="text-4xl font-bold text-green-600">{results.timeSpent}分</p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-lg mb-8 text-left">
              <p className="text-lg font-semibold text-slate-900 mb-3">
                {results.percentage >= 80
                  ? '素晴らしい成績です！合格レベルに達しています。'
                  : results.percentage >= 60
                  ? 'もう少しです！苦手な単元を復習しましょう。'
                  : '基礎から復習することをお勧めします。'}
              </p>
            </div>

            <button
              onClick={handleRetry}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-blue-600 hover:to-blue-700 flex items-center justify-center gap-2 transition-all"
            >
              <RotateCcw size={24} />
              もう一度試験を受ける
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">回答の確認</h2>
            <div className="space-y-4">
              {examQuestions.map((q, idx) => {
                const answerIdx = userAnswers[q.id];
                const isCorrect = answerIdx === q.correctIndex;
                const answerLabel = answerIdx !== undefined ? OPTION_LABELS[answerIdx] : '未回答';
                const correctLabel = OPTION_LABELS[q.correctIndex];
                return (
                  <div key={q.id} className={`p-4 rounded-lg border-l-4 ${
                    isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
                  }`}>
                    <p className="font-medium text-slate-900">
                      問{idx + 1}: {isCorrect ? '正解' : '不正解'}
                    </p>
                    <p className="text-sm text-slate-600 mt-1 mb-2">
                      あなたの回答: <span className="font-semibold">{answerLabel}</span>
                      {!isCorrect && ` | 正解: ${correctLabel}`}
                    </p>
                    <p className="text-sm text-slate-700 mb-1"><MathText text={q.question} keyPrefix={`rv-q-${idx}`} /></p>
                    {q.explanation && (
                      <details className="mt-2">
                        <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-700 font-medium">
                          解説を表示
                        </summary>
                        <div className="mt-2 space-y-2">
                          <p className="text-sm text-slate-700 bg-blue-50 p-3 rounded">
                            <MathText text={q.explanation} keyPrefix={`rv-e-${idx}`} />
                          </p>
                          {q.optionExplanations && (
                            <div className="space-y-1">
                              {q.options.map((optText, optIdx) => {
                                const isCorrectOpt = optIdx === q.correctIndex;
                                return (
                                  <div key={optIdx} className={`text-xs p-2 rounded ${isCorrectOpt ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                    <span className="font-bold">{OPTION_LABELS[optIdx]}.</span> {renderInlineContent(optText, `rv-o-${idx}-${optIdx}`)}
                                    <br />
                                    <span className="italic">{renderInlineContent(q.optionExplanations[optIdx], `rv-oe-${idx}-${optIdx}`)}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </details>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
