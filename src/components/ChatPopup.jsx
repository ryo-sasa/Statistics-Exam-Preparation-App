import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Brain, X, Minus, Send, Sparkles, BookOpen } from 'lucide-react';
import { chatResponses, quickQuestionsByLevel } from '../data/chat-responses.js';
import { getAIChatResponse } from '../lib/aiService.js';
import { MathText } from './MathText.jsx';

export default function ChatPopup({ selectedLevel, visible, useAI = false, topics = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 教科書コンテンツからクエリに最も関連するセクションを検索
   * トピック名・セクションタイトル・本文をスコアリングして最適な結果を返す
   */
  const searchTextbook = (query) => {
    if (!topics || topics.length === 0) return null;

    const lowerQuery = query.toLowerCase();
    // クエリを単語に分割（2文字以上）
    const queryTerms = lowerQuery.split(/[\s、。,．・]+/).filter(t => t.length >= 2);
    if (queryTerms.length === 0) return null;

    let bestMatch = null;
    let bestScore = 0;

    for (const topic of topics) {
      for (const section of topic.sections || []) {
        const title = (section.title || '').toLowerCase();
        const content = (section.content || '').toLowerCase();
        let score = 0;

        for (const term of queryTerms) {
          // タイトルへのマッチは高スコア
          if (title.includes(term)) score += 10;
          // トピック名へのマッチ
          if ((topic.name || '').toLowerCase().includes(term)) score += 8;
          // 本文へのマッチ（出現回数に応じてスコア加算、上限あり）
          const contentMatches = content.split(term).length - 1;
          if (contentMatches > 0) score += Math.min(contentMatches, 5) * 2;
        }

        if (score > bestScore) {
          bestScore = score;
          bestMatch = { topic, section, score };
        }
      }
    }

    // スコアが一定以上ならマッチとみなす
    if (bestMatch && bestScore >= 6) {
      // コンテンツから最初の400文字を抽出（数式マークアップ付き）
      let excerpt = bestMatch.section.content;
      // 【例題】以降はカット（長くなりすぎるため）
      const exampleIdx = excerpt.indexOf('【例題】');
      if (exampleIdx > 0) excerpt = excerpt.slice(0, exampleIdx);
      // 400文字でトリミング
      if (excerpt.length > 400) {
        excerpt = excerpt.slice(0, 400).replace(/\n[^\n]*$/, '') + '...';
      }
      return {
        topicName: bestMatch.topic.name,
        sectionTitle: bestMatch.section.title,
        content: excerpt,
      };
    }

    return null;
  };

  // ローカル応答生成：教科書検索 → キーワード辞書 → デフォルト
  const generateLocalResponse = (userMessage) => {
    // 1. 教科書コンテンツを検索
    const textbookResult = searchTextbook(userMessage);
    if (textbookResult) {
      return `【${textbookResult.topicName} — ${textbookResult.sectionTitle}】\n\n${textbookResult.content}`;
    }

    // 2. キーワード辞書
    const lowerMsg = userMessage.toLowerCase();
    const sortedEntries = Object.entries(chatResponses).sort(
      (a, b) => b[0].length - a[0].length
    );
    for (const [keyword, response] of sortedEntries) {
      if (lowerMsg.includes(keyword.toLowerCase())) {
        return response;
      }
    }

    // 3. デフォルト
    return `申し訳ありませんが、「${userMessage}」に関する情報は見つかりませんでした。教科書のトピック名やキーワード（例：分散、ベイズ、最尤法、主成分分析、マルコフ）で質問してみてください。`;
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg = {
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    const query = inputValue;
    setInputValue('');
    setIsLoading(true);

    if (useAI) {
      // AI モード: API 経由で Claude に質問
      try {
        const result = await getAIChatResponse({ message: query, level: selectedLevel });
        const remainingText = result.remaining != null ? `\n\n(残り ${result.remaining}/${result.monthly_limit} 回)` : '';
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: result.response + remainingText,
          timestamp: new Date(),
          isAI: true,
        }]);
      } catch (err) {
        // 利用上限エラーの場合はメッセージを表示、それ以外はフォールバック
        const isLimitError = err.message.includes('上限');
        const fallback = isLimitError
          ? err.message
          : generateLocalResponse(query) + '\n\n(AI応答に失敗したため、キーワード応答を表示しています)';
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: fallback,
          timestamp: new Date(),
        }]);
      }
      setIsLoading(false);
    } else {
      // ローカルモード: 教科書検索 → キーワードマッチング
      setTimeout(() => {
        const textbookResult = searchTextbook(query);
        const content = generateLocalResponse(query);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content,
          timestamp: new Date(),
          isTextbook: !!textbookResult,
        }]);
        setIsLoading(false);
      }, 300);
    }
  };

  const quickQuestions = quickQuestionsByLevel[selectedLevel] || quickQuestionsByLevel['jun1kyu'];

  const handleQuickQuestion = (question) => {
    setInputValue(question);
  };

  // Hidden during exam
  if (!visible) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center z-40"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-2xl flex flex-col z-50 overflow-hidden" style={{ height: '32rem' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Brain size={20} />
              </div>
              <div>
                <h3 className="font-bold flex items-center gap-1.5">
                  統計検定AI助手
                  {useAI && <Sparkles size={14} className="text-yellow-300" />}
                </h3>
                <p className="text-xs opacity-80">{useAI ? '生成AI モード' : 'キーワード応答モード'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-white/20 p-1 rounded transition-colors"
              >
                <Minus size={20} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Minimized State */}
          {isMinimized && (
            <div className="p-4 text-center text-slate-600 text-sm">
              クリックしてチャットを展開
            </div>
          )}

          {/* Message Area */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.length === 0 ? (
                  <div className="text-center text-slate-500 py-8">
                    <p className="mb-4">統計学に関する質問を入力してください</p>
                    <p className="text-xs">またはクイック質問を選択してください</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none'
                        }`}
                      >
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                          <MathText text={msg.content} keyPrefix={`msg-${idx}`} />
                        </div>
                        {msg.isAI && (
                          <p className="text-xs text-purple-400 mt-1 flex items-center gap-1"><Sparkles size={10} /> Claude Haiku</p>
                        )}
                        {msg.isTextbook && (
                          <p className="text-xs text-blue-400 mt-1 flex items-center gap-1"><BookOpen size={10} /> 教科書より</p>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg rounded-bl-none">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions - only show if no messages */}
              {messages.length === 0 && (
                <div className="px-4 py-3 border-t border-slate-200 bg-white">
                  <p className="text-xs font-semibold text-slate-600 mb-2">クイック質問:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickQuestion(q.text)}
                        className="text-left px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded transition-colors text-slate-700 font-medium"
                      >
                        {q.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="border-t border-slate-200 bg-white p-3 flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      handleSendMessage();
                    }
                  }}
                  placeholder="質問を入力..."
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <Send size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
