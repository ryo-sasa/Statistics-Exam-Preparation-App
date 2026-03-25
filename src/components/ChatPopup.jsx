import React, { useState } from 'react';
import { MessageCircle, Brain, X, Minus, Send } from 'lucide-react';

export default function ChatPopup({ selectedLevel, visible }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // AI response generator with keyword matching
  const generateAIResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();

    const responses = {
      '分散': '分散（ぶんさん）は、データが平均値からどの程度ばらついているかを示す統計量です。分散が大きいほど、データのばらつきが大きいです。分散の平方根は標準偏差と呼ばれます。',
      'ベイズ': 'ベイズの定理は、事前確率と尤度から事後確率を計算する方法です。P(A|B) = P(B|A) × P(A) / P(B) という式で表されます。統計検定では重要な概念です。',
      '主成分分析': '主成分分析（PCA）は、多次元データを少ない次元に圧縮する手法です。データの分散を最大限保つ新しい軸を見つけることで、データの構造を理解しやすくします。',
      '検定': '統計的検定は、標本データから母集団の性質について仮説を立て、その仮説が正しいかどうかを確率的に判断するプロセスです。有意水準5%が一般的に使われます。',
      '相関': '相関係数は、2つの変数がどの程度直線的な関係にあるかを示す値です。-1から1の範囲をとり、1に近いほど正の相関が強く、-1に近いほど負の相関が強いです。',
      '回帰': '回帰分析は、2つ以上の変数の関係を数式で表す手法です。最小二乗法により、データに最も適合する直線または曲線を求めます。予測や因果関係の分析に用いられます。',
      '標準偏差': '標準偏差は分散の平方根で、元のデータと同じ単位で表されます。データが平均値から標準偏差の1倍以内にある確率は約68%です。',
      '確率': '確率は、ある事象が起こる可能性の度合いを0から1の数値で表したものです。全ての事象の確率の合計は1です。',
      '分布': '確率分布は、確率変数がとりうる値とその確率を示したものです。正規分布（ガウス分布）は統計学で最も重要な分布です。',
      '平均': '平均（期待値）はデータを足して個数で割った値です。母集団の平均を推定するために標本平均が用いられます。',
      '中央値': '中央値（メジアン）はデータを大きさ順に並べたときの真ん中の値です。外れ値の影響を受けにくいため、平均と合わせて用いられます。',
      '最頻値': '最頻値（モード）は最も頻繁に現れるデータの値です。カテゴリカルデータの代表値として用いられます。',
      '信頼区間': '信頼区間は、母数が含まれる可能性が高い区間を示します。95%信頼区間は、同じ方法で100回調査したら95回は母数を含む区間です。',
      'p値': 'p値は帰無仮説が真の場合に、観測されたような結果が得られる確率です。一般的にp値が0.05未満なら帰無仮説を棄却します。',
      'カイ二乗': 'カイ二乗検定は、カテゴリカル変数の独立性を検定する手法です。観測度数と期待度数の差を比較します。',
      't検定': 't検定は、2つのグループの平均が異なるかどうかを検定する手法です。サンプルサイズが小さい場合に有効です。',
      'z検定': 'z検定は、標本平均が母平均と異なるかどうかを検定する手法です。サンプルサイズが大きい場合やt検定の代わりに用いられます。',
      'f検定': 'f検定は、複数のグループの平均が等しいかどうかを検定する手法です。分散分析（ANOVA）で用いられます。',
      'anova': '分散分析（ANOVA）は、3つ以上のグループの平均を比較する手法です。全体のばらつきを群間の分散と群内の分散に分解します。',
    };

    for (const [keyword, response] of Object.entries(responses)) {
      if (lowerMsg.includes(keyword)) {
        return response;
      }
    }

    // Default response if no keyword matches
    return '申し訳ありませんが、その質問についての情報は用意されていません。質問キーボタンを使うか、もっと詳しく説明してもらえますか？';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMsg = {
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const aiMsg = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsLoading(false);
    }, 500);
  };

  const quickQuestions = [
    { text: '分散', keyword: '分散' },
    { text: 'ベイズ', keyword: 'ベイズ' },
    { text: '主成分分析', keyword: '主成分分析' },
    { text: '検定', keyword: '検定' },
  ];

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
                <h3 className="font-bold">統計検定AI助手</h3>
                <p className="text-xs opacity-80">いつでも質問できます</p>
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
                        <p className="text-sm leading-relaxed">{msg.content}</p>
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
              </div>

              {/* Quick Questions - only show if no messages */}
              {messages.length === 0 && (
                <div className="px-4 py-3 border-t border-slate-200 bg-white">
                  <p className="text-xs font-semibold text-slate-600 mb-2">クイック質問:</p>
                  <div className="space-y-2">
                    {quickQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickQuestion(q.text)}
                        className="w-full text-left px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded transition-colors text-slate-700 font-medium"
                      >
                        {q.text} について
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
                  onKeyPress={(e) => {
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
