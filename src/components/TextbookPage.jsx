import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TextbookPage({ selectedLevel, topics, LEVELS }) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSection, setSelectedSection] = useState(0);
  const level = LEVELS.find(l => l.id === selectedLevel);

  const renderContent = (text) => {
    if (!text) return null;

    const lines = text.split('\n');
    const elements = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Empty line - add spacing
      if (line.trim() === '') {
        elements.push(<div key={`empty-${i}`} className="h-2" />);
        i++;
        continue;
      }

      // Bold text (starts with **)
      if (line.startsWith('**') && line.endsWith('**')) {
        const text = line.slice(2, -2);
        elements.push(
          <h4 key={`heading-${i}`} className="text-lg font-bold text-slate-900 mt-4 mb-3">
            {text}
          </h4>
        );
        i++;
        continue;
      }

      // Bullet points (starts with -)
      if (line.trim().startsWith('- ')) {
        const bulletItems = [];
        while (i < lines.length && lines[i].trim().startsWith('- ')) {
          bulletItems.push(lines[i].trim().slice(2));
          i++;
        }
        elements.push(
          <ul key={`bullets-${i}`} className="list-disc list-inside space-y-2 text-slate-700 ml-4 mb-4">
            {bulletItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        );
        continue;
      }

      // Formula blocks (starts with two spaces)
      if (line.startsWith('  ') && !line.startsWith('   ')) {
        const formulas = [];
        while (i < lines.length && lines[i].startsWith('  ') && !lines[i].startsWith('   ')) {
          formulas.push(lines[i].trim());
          i++;
        }
        elements.push(
          <div key={`formula-${i}`} className="bg-slate-100 border border-slate-300 rounded-lg p-4 my-4 font-mono text-sm">
            {formulas.map((formula, idx) => (
              <div key={idx} className="text-slate-800">{formula}</div>
            ))}
          </div>
        );
        continue;
      }

      // Regular paragraph
      elements.push(
        <p key={`para-${i}`} className="text-slate-700 leading-relaxed mb-3">
          {line}
        </p>
      );
      i++;
    }

    return elements;
  };

  // Show topic list view
  if (selectedTopic === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20 lg:pt-0">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">教科書</h1>
          <p className="text-slate-600 mb-8">各単元の講義を確認します</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => {
                  setSelectedTopic(topic.id);
                  setSelectedSection(0);
                }}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all hover:scale-105 text-left border border-slate-200"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`${level?.bgColor || 'bg-blue-500'} p-3 rounded-lg text-white`}>
                    <topic.icon size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900">{topic.name}</h3>
                    <p className="text-slate-600 text-sm mt-1">
                      {topic.sections?.length || 0} セクション
                    </p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm">{topic.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show topic detail view
  const topic = topics.find(t => t.id === selectedTopic);
  const sections = topic?.sections || [];
  const currentSection = sections[selectedSection] || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20 lg:pt-0">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
        {/* Back Button */}
        <button
          onClick={() => setSelectedTopic(null)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
        >
          <ArrowLeft size={20} />
          教科書に戻る
        </button>

        {/* Topic Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-8 border-l-4 border-blue-500">
          <div className="flex items-center gap-4 mb-4">
            <div className={`${level?.bgColor || 'bg-blue-500'} p-3 rounded-lg text-white`}>
              <topic.icon size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{topic.name}</h1>
              <p className="text-slate-600 mt-1">{sections.length} セクション</p>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        {sections.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-8 overflow-hidden">
            <div className="flex overflow-x-auto border-b border-slate-200">
              {sections.map((section, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSection(idx)}
                  className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
                    selectedSection === idx
                      ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {section.title || `セクション ${idx + 1}`}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {currentSection.title || `セクション ${selectedSection + 1}`}
              </h2>

              <div className="prose prose-sm max-w-none">
                {renderContent(currentSection.content)}
              </div>

              {/* Special note for jun1kyu */}
              {selectedLevel === 'jun1kyu' && (
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                  <strong>注：</strong> このカテゴリはとけたろう準1級講座の単元構成に基づいています。
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {sections.length > 0 && (
          <div className="flex gap-4 justify-between">
            <button
              onClick={() => setSelectedSection(Math.max(0, selectedSection - 1))}
              disabled={selectedSection === 0}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronLeft size={20} />
              前へ
            </button>

            <div className="flex items-center gap-2 text-slate-600 font-medium">
              {selectedSection + 1} / {sections.length}
            </div>

            <button
              onClick={() => setSelectedSection(Math.min(sections.length - 1, selectedSection + 1))}
              disabled={selectedSection === sections.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 border border-blue-600 rounded-lg font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
            >
              次へ
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
