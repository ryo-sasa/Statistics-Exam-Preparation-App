import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Renders a string that may contain:
 *   - $$...$$ display math
 *   - $...$ inline math
 *   - 【解答】...【/解答】 collapsible answer blocks
 *   - **bold** text
 *   - Markdown-style formatting
 */

function TexInline({ tex }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(tex, ref.current, { throwOnError: false, displayMode: false });
      } catch {
        ref.current.textContent = tex;
      }
    }
  }, [tex]);
  return <span ref={ref} className="inline" />;
}

function TexBlock({ tex }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(tex, ref.current, { throwOnError: false, displayMode: true });
      } catch {
        ref.current.textContent = tex;
      }
    }
  }, [tex]);
  return <div ref={ref} className="my-4 overflow-x-auto" />;
}

function CollapsibleAnswer({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="my-4 border border-amber-300 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 hover:bg-amber-100 transition-colors text-amber-800 font-semibold text-sm"
      >
        <span>{open ? '解答を隠す' : '解答を表示'}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && (
        <div className="px-4 py-4 bg-amber-50/50">
          {children}
        </div>
      )}
    </div>
  );
}

/** Parse a text line into React nodes, handling inline $...$ and **bold** */
function renderInlineContent(text, keyPrefix) {
  // Split on $...$ (inline math) and **...** (bold)
  const parts = [];
  const regex = /(\$\$[^$]+\$\$|\$[^$]+\$|\*\*[^*]+\*\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={`${keyPrefix}-t${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>
      );
    }
    const m = match[0];
    if (m.startsWith('$$') && m.endsWith('$$')) {
      parts.push(<TexBlock key={`${keyPrefix}-db${match.index}`} tex={m.slice(2, -2)} />);
    } else if (m.startsWith('$') && m.endsWith('$')) {
      parts.push(<TexInline key={`${keyPrefix}-ib${match.index}`} tex={m.slice(1, -1)} />);
    } else if (m.startsWith('**') && m.endsWith('**')) {
      parts.push(
        <strong key={`${keyPrefix}-b${match.index}`} className="font-bold text-slate-900">
          {m.slice(2, -2)}
        </strong>
      );
    }
    lastIndex = match.index + m.length;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={`${keyPrefix}-tail`}>{text.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : text;
}

function renderContent(text) {
  if (!text) return null;

  // First, split by 【解答】...【/解答】 blocks
  const answerRegex = /【解答】([\s\S]*?)【\/解答】/g;
  const topSegments = [];
  let lastIdx = 0;
  let m;

  while ((m = answerRegex.exec(text)) !== null) {
    if (m.index > lastIdx) {
      topSegments.push({ type: 'content', text: text.slice(lastIdx, m.index) });
    }
    topSegments.push({ type: 'answer', text: m[1] });
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx < text.length) {
    topSegments.push({ type: 'content', text: text.slice(lastIdx) });
  }

  const allElements = [];

  topSegments.forEach((segment, segIdx) => {
    const renderTextBlock = (blockText, baseKey) => {
      const lines = blockText.split('\n');
      const elements = [];
      let i = 0;

      while (i < lines.length) {
        const line = lines[i];
        const key = `${baseKey}-${i}`;

        // Empty line
        if (line.trim() === '') {
          elements.push(<div key={key} className="h-2" />);
          i++;
          continue;
        }

        // Display math block: line is just $$...$$
        if (line.trim().startsWith('$$') && line.trim().endsWith('$$') && line.trim().length > 4) {
          const tex = line.trim().slice(2, -2);
          elements.push(<TexBlock key={key} tex={tex} />);
          i++;
          continue;
        }

        // Multi-line display math $$
        if (line.trim() === '$$') {
          const mathLines = [];
          i++;
          while (i < lines.length && lines[i].trim() !== '$$') {
            mathLines.push(lines[i]);
            i++;
          }
          i++; // skip closing $$
          elements.push(<TexBlock key={key} tex={mathLines.join('\n')} />);
          continue;
        }

        // Heading (starts with **)
        if (line.startsWith('**') && line.endsWith('**')) {
          const heading = line.slice(2, -2);
          elements.push(
            <h4 key={key} className="text-lg font-bold text-slate-900 mt-6 mb-3">
              {renderInlineContent(heading, key)}
            </h4>
          );
          i++;
          continue;
        }

        // 【例題】or 【問題】marker
        if (line.trim().startsWith('【例題】') || line.trim().startsWith('【問題】') || line.trim().startsWith('【演習】')) {
          elements.push(
            <div key={key} className="mt-6 mb-2 px-4 py-2 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <span className="font-bold text-blue-800">
                {renderInlineContent(line.trim(), key)}
              </span>
            </div>
          );
          i++;
          continue;
        }

        // Bullet points
        if (line.trim().startsWith('- ')) {
          const items = [];
          while (i < lines.length && lines[i].trim().startsWith('- ')) {
            items.push(lines[i].trim().slice(2));
            i++;
          }
          elements.push(
            <ul key={key} className="list-disc list-inside space-y-2 text-slate-700 ml-4 mb-4">
              {items.map((item, idx) => (
                <li key={idx}>{renderInlineContent(item, `${key}-li${idx}`)}</li>
              ))}
            </ul>
          );
          continue;
        }

        // Numbered list (1. 2. 3. etc)
        if (/^\d+[\.\)]\s/.test(line.trim())) {
          const items = [];
          while (i < lines.length && /^\d+[\.\)]\s/.test(lines[i].trim())) {
            items.push(lines[i].trim().replace(/^\d+[\.\)]\s/, ''));
            i++;
          }
          elements.push(
            <ol key={key} className="list-decimal list-inside space-y-2 text-slate-700 ml-4 mb-4">
              {items.map((item, idx) => (
                <li key={idx}>{renderInlineContent(item, `${key}-ol${idx}`)}</li>
              ))}
            </ol>
          );
          continue;
        }

        // Regular paragraph
        elements.push(
          <p key={key} className="text-slate-700 leading-relaxed mb-3">
            {renderInlineContent(line, key)}
          </p>
        );
        i++;
      }

      return elements;
    };

    if (segment.type === 'answer') {
      allElements.push(
        <CollapsibleAnswer key={`answer-${segIdx}`}>
          {renderTextBlock(segment.text, `ans-${segIdx}`)}
        </CollapsibleAnswer>
      );
    } else {
      allElements.push(...renderTextBlock(segment.text, `seg-${segIdx}`));
    }
  });

  return allElements;
}

export default function TextbookPage({ selectedLevel, topics, LEVELS }) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSection, setSelectedSection] = useState(0);
  const level = LEVELS.find(l => l.id === selectedLevel);

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
