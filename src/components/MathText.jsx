import React, { useRef, useEffect } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export function TexInline({ tex }) {
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

export function TexBlock({ tex }) {
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

/** Parse a text string into React nodes, handling inline $...$ , display $$...$$ and **bold** */
export function renderInlineContent(text, keyPrefix = 'math') {
  if (!text) return text;
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

/** Convenience component: renders text with inline math support */
export function MathText({ text, keyPrefix = 'math', className = '' }) {
  if (!text) return null;
  return <span className={className}>{renderInlineContent(text, keyPrefix)}</span>;
}
