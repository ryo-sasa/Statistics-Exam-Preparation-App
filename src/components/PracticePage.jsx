import React, { useState, useEffect } from 'react';
import { ChevronDown, Check, X, ChevronRight, Bookmark, Loader2 } from 'lucide-react';
import { MathText, renderInlineContent } from './MathText.jsx';
import { evaluateWrittenAnswer, evaluateLocally } from '../lib/aiService.js';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const DIFFICULTY_CONFIG = {
  basic:    { label: '基礎', color: 'bg-green-100 text-green-700' },
  standard: { label: '標準', color: 'bg-blue-100 text-blue-700' },
  advanced: { label: '発展', color: 'bg-red-100 text-red-700' },
};

export default function PracticePage({ selectedLevel, questions, topics, addResult, bookmarks = [], onToggleBookmark, useAI = false }) {
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [bookmarkMode, setBookmarkMode] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [aiEvaluation, setAiEvaluation] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Reset bookmark mode when level changes
  useEffect(() => {
    setBookmarkMode(false);
    setCurrentQuestionIdx(0);
  }, [selectedLevel]);

  // Filter questions by topic, bookmark mode, and difficulty
  const baseQuestions = bookmarkMode
    ? questions.filter(q => bookmarks.includes(q.id))
    : questions;
  const topicFiltered = selectedTopic === 'all'
    ? baseQuestions
    : baseQuestions.filter(q => q.topic === selectedTopic);
  const filteredQuestions = selectedDifficulty === 'all'
    ? topicFiltered
    : topicFiltered.filter(q => q.difficulty === selectedDifficulty);

  if (filteredQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20 lg:pt-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-slate-600 mb-4">
            {bookmarkMode ? 'ブックマークした問題がありません' : 'このレベルではまだ問題がありません'}
          </p>
          {bookmarkMode && (
            <button
              onClick={() => { setBookmarkMode(false); setCurrentQuestionIdx(0); }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              通常モードに戻る
            </button>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = filteredQuestions[currentQuestionIdx];
  const isChoiceQuestion = currentQuestion.type === 'choice';
  const isCorrect = isChoiceQuestion
    ? userAnswer === currentQuestion.correctIndex
    : true;

  const handleSubmit = () => {
    if (isChoiceQuestion) {
      if (userAnswer === null) return;
      setIsSubmitted(true);
      addResult({
        questionId: currentQuestion.id,
        topicId: currentQuestion.topic,
        level: selectedLevel,
        isCorrect,
        userAnswer: userAnswer,
        difficulty: currentQuestion.difficulty || null,
      });
    } else {
      if (!writtenAnswer.trim()) return;
      setIsSubmitted(true);
      addResult({
        questionId: currentQuestion.id,
        topicId: currentQuestion.topic,
        level: selectedLevel,
        isCorrect: true,
        userAnswer: writtenAnswer,
        difficulty: currentQuestion.difficulty || null,
      });

      // AI 評価 or ローカル評価
      if (useAI) {
        setIsEvaluating(true);
        evaluateWrittenAnswer({
          question: currentQuestion.question,
          sampleAnswer: currentQuestion.sampleAnswer || '',
          keywords: currentQuestion.keywords || [],
          userAnswer: writtenAnswer,
        })
          .then(result => setAiEvaluation(result))
          .catch((err) => {
            // 利用上限エラーはそのまま表示、それ以外はローカル評価にフォールバック
            if (err.message.includes('上限') || err.message.includes('ログイン')) {
              setAiEvaluation({ score: null, feedback: err.message, missing: [], good: [] });
            } else {
              setAiEvaluation(evaluateLocally({ keywords: currentQuestion.keywords, userAnswer: writtenAnswer }));
            }
          })
          .finally(() => setIsEvaluating(false));
      } else {
        const localResult = evaluateLocally({ keywords: currentQuestion.keywords, userAnswer: writtenAnswer });
        setAiEvaluation(localResult);
      }
    }
  };

  const handleNext = () => {
    setUserAnswer(null);
    setWrittenAnswer('');
    setIsSubmitted(false);
    setShowExplanation(false);
    setAiEvaluation(null);
    setIsEvaluating(false);
    setCurrentQuestionIdx(Math.min(currentQuestionIdx + 1, filteredQuestions.length - 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20 lg:pt-0">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-slate-900">問題演習</h1>
          {onToggleBookmark && (
            <button
              onClick={() => { setBookmarkMode(!bookmarkMode); setCurrentQuestionIdx(0); setUserAnswer(null); setWrittenAnswer(''); setIsSubmitted(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                bookmarkMode
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Bookmark size={16} className={bookmarkMode ? 'fill-white' : ''} />
              {bookmarkMode ? 'ブックマーク復習中' : `ブックマーク復習 (${bookmarks.length})`}
            </button>
          )}
        </div>

        {/* Topic Filter Dropdown */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            カテゴリで絞り込む
          </label>
          <div className="relative">
            <select
              value={selectedTopic}
              onChange={(e) => {
                setSelectedTopic(e.target.value);
                setCurrentQuestionIdx(0);
                setUserAnswer(null);
                setWrittenAnswer('');
                setIsSubmitted(false);
              }}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 appearance-none cursor-pointer hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">すべてのカテゴリ ({questions.length} 問)</option>
              {topics.map(topic => {
                const count = questions.filter(q => q.topic === topic.id).length;
                return (
                  <option key={topic.id} value={topic.id}>
                    {topic.name} ({count} 問)
                  </option>
                );
              })}
            </select>
            <ChevronDown size={20} className="absolute right-3 top-3.5 text-slate-600 pointer-events-none" />
          </div>

          {/* Difficulty Filter */}
          <div className="flex gap-2 mt-3">
            {[
              { value: 'all', label: 'すべて' },
              { value: 'basic', label: '基礎' },
              { value: 'standard', label: '標準' },
              { value: 'advanced', label: '発展' },
            ].map(d => (
              <button
                key={d.value}
                onClick={() => {
                  setSelectedDifficulty(d.value);
                  setCurrentQuestionIdx(0);
                  setUserAnswer(null);
                  setWrittenAnswer('');
                  setIsSubmitted(false);
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedDifficulty === d.value
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="inline-block bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                {isChoiceQuestion ? '選択式' : '記述式'}
              </span>
              {currentQuestion.difficulty && DIFFICULTY_CONFIG[currentQuestion.difficulty] && (
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${DIFFICULTY_CONFIG[currentQuestion.difficulty].color}`}>
                  {DIFFICULTY_CONFIG[currentQuestion.difficulty].label}
                </span>
              )}
              <span className="text-slate-600 text-sm">
                {currentQuestionIdx + 1} / {filteredQuestions.length}
              </span>
            </div>
            {onToggleBookmark && (
              <button
                onClick={() => onToggleBookmark(currentQuestion.id)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                title={bookmarks.includes(currentQuestion.id) ? 'ブックマークを外す' : 'ブックマークする'}
              >
                <Bookmark
                  size={22}
                  className={bookmarks.includes(currentQuestion.id)
                    ? 'text-amber-500 fill-amber-500'
                    : 'text-slate-400'
                  }
                />
              </button>
            )}
          </div>

          {/* Question Text */}
          <h2 className="text-2xl font-bold text-slate-900 mb-8 leading-relaxed">
            <MathText text={currentQuestion.question} keyPrefix="q" />
          </h2>

          {/* Choice Question Options */}
          {isChoiceQuestion && currentQuestion.options && (
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((optionText, idx) => {
                const label = OPTION_LABELS[idx];
                const isSelected = userAnswer === idx;
                const isCorrectOption = currentQuestion.correctIndex === idx;

                let buttonClass = 'bg-white border-2 border-slate-300 text-slate-900 hover:border-slate-400';

                if (isSubmitted) {
                  if (isCorrectOption) {
                    buttonClass = 'bg-green-50 border-2 border-green-500 text-slate-900';
                  } else if (isSelected && !isCorrectOption) {
                    buttonClass = 'bg-red-50 border-2 border-red-500 text-slate-900';
                  } else {
                    buttonClass = 'bg-white border-2 border-slate-300 text-slate-900';
                  }
                } else if (isSelected) {
                  buttonClass = 'bg-blue-50 border-2 border-blue-500 text-slate-900';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => !isSubmitted && setUserAnswer(idx)}
                    disabled={isSubmitted}
                    className={`w-full p-4 rounded-lg font-medium text-left transition-all ${buttonClass} disabled:cursor-default`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold">
                        {label}
                      </div>
                      <span>{renderInlineContent(optionText, `opt-${idx}`)}</span>
                      {isSubmitted && isCorrectOption && <Check className="ml-auto flex-shrink-0 text-green-600" size={24} />}
                      {isSubmitted && isSelected && !isCorrectOption && <X className="ml-auto flex-shrink-0 text-red-600" size={24} />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Written Question Answer */}
          {!isChoiceQuestion && (
            <div className="mb-8">
              <textarea
                value={writtenAnswer}
                onChange={(e) => setWrittenAnswer(e.target.value)}
                disabled={isSubmitted}
                placeholder="ここに答えを入力してください..."
                className="w-full p-4 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                rows={6}
              />
              {isSubmitted && (
                <>
                  {/* AI 評価結果 */}
                  {isEvaluating && (
                    <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-center gap-3">
                      <Loader2 size={20} className="text-purple-500 animate-spin" />
                      <span className="text-sm text-purple-700">AIが回答を評価中...</span>
                    </div>
                  )}
                  {aiEvaluation && !isEvaluating && (
                    <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-bold text-purple-800">
                          {useAI ? 'AI 評価' : 'キーワード採点'}
                        </p>
                        {aiEvaluation.score !== null && (
                          <span className={`text-lg font-bold px-3 py-1 rounded-full ${
                            aiEvaluation.score >= 80 ? 'bg-green-100 text-green-700' :
                            aiEvaluation.score >= 50 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {aiEvaluation.score}点
                          </span>
                        )}
                      </div>
                      {aiEvaluation.feedback && (
                        <p className="text-sm text-slate-700 mb-2">{aiEvaluation.feedback}</p>
                      )}
                      {aiEvaluation.good && aiEvaluation.good.length > 0 && (
                        <div className="mb-2">
                          {aiEvaluation.good.map((g, i) => (
                            <p key={i} className="text-sm text-green-700">+ {g}</p>
                          ))}
                        </div>
                      )}
                      {aiEvaluation.missing && aiEvaluation.missing.length > 0 && (
                        <div>
                          {aiEvaluation.missing.map((m, i) => (
                            <p key={i} className="text-sm text-red-600">- {m}</p>
                          ))}
                        </div>
                      )}
                      {useAI && aiEvaluation.remaining != null && (
                        <p className="text-xs text-slate-400 mt-3 text-right">
                          今月の残り: {aiEvaluation.remaining} / {aiEvaluation.monthly_limit} 回
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-sm font-medium text-slate-700 mb-2">模範解答:</p>
                    <p className="text-slate-700 whitespace-pre-wrap"><MathText text={currentQuestion.sampleAnswer} keyPrefix="sa" /></p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Explanation Section */}
          {isSubmitted && (
            <div className="mb-8">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 mb-4"
              >
                <span>{showExplanation ? '✕' : '+'}</span>
                解説を表示
              </button>
              {showExplanation && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-slate-800 leading-relaxed">
                    <MathText text={currentQuestion.explanation} keyPrefix="expl" />
                  </div>

                  {/* Per-option explanations */}
                  {isChoiceQuestion && currentQuestion.optionExplanations && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                      <h4 className="font-bold text-slate-800 mb-4">各選択肢の解説</h4>
                      <div className="space-y-3">
                        {currentQuestion.options.map((optionText, idx) => {
                          const isCorrectOption = idx === currentQuestion.correctIndex;
                          return (
                            <div key={idx} className={`p-3 rounded-lg ${isCorrectOption ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                              <div className="flex items-start gap-2">
                                <span className={`font-bold flex-shrink-0 ${isCorrectOption ? 'text-green-700' : 'text-red-700'}`}>
                                  {OPTION_LABELS[idx]}.
                                </span>
                                <div>
                                  <p className="font-medium text-slate-800 mb-1">{renderInlineContent(optionText, `oe-opt-${idx}`)}</p>
                                  <p className={`text-sm ${isCorrectOption ? 'text-green-700' : 'text-red-700'}`}>
                                    <MathText text={currentQuestion.optionExplanations[idx]} keyPrefix={`oe-${idx}`} />
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Result Display */}
          {isSubmitted && isChoiceQuestion && (
            <div className={`p-6 rounded-lg text-center mb-8 ${isCorrect ? 'bg-green-50 border border-green-300' : 'bg-red-50 border border-red-300'}`}>
              <p className={`text-xl font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? '正解です！' : '不正解です'}
              </p>
            </div>
          )}

          {/* Submit / Next Button */}
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={isChoiceQuestion && userAnswer === null}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              提出する
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={currentQuestionIdx === filteredQuestions.length - 1}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              次の問題へ <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestionIdx + 1) / filteredQuestions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
