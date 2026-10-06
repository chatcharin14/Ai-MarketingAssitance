import React from 'react';

interface MarkdownViewProps {
  content: string;
  className?: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split into lines and group into paragraphs, headers, bullet lists
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];

  const flushList = (key: string) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={key} className="space-y-1.5 my-3 pl-4 border-l-2 border-teal-200">
          {currentList.map((item, idx) => (
            <li key={idx} className="text-slate-700 leading-relaxed flex items-start gap-2">
              <span className="text-teal-500 font-bold mt-1 text-xs">●</span>
              <span>{renderFormattedText(item)}</span>
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  const renderFormattedText = (text: string) => {
    // Replace **bold** and *italic*
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={i} className="text-slate-800 italic">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(`list-${index}`);
      return;
    }

    // Bullet point
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      currentList.push(trimmed.replace(/^[-*•]\s+/, ''));
      return;
    }

    // Numbered list
    if (/^\d+\.\s+/.test(trimmed)) {
      currentList.push(trimmed.replace(/^\d+\.\s+/, ''));
      return;
    }

    // Flush any pending list
    flushList(`list-${index}`);

    // Headers
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="text-base font-bold text-slate-900 mt-5 mb-2 flex items-center gap-2">
          {renderFormattedText(trimmed.slice(4))}
        </h3>
      );
      return;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="text-lg font-bold text-slate-900 mt-6 mb-3 pb-1 border-b border-slate-100 flex items-center gap-2">
          {renderFormattedText(trimmed.slice(3))}
        </h2>
      );
      return;
    }
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={index} className="text-xl font-bold text-slate-900 mt-6 mb-3">
          {renderFormattedText(trimmed.slice(2))}
        </h1>
      );
      return;
    }

    // Standard paragraph or blockquote
    if (trimmed.startsWith('> ')) {
      elements.push(
        <div key={index} className="bg-teal-50/60 border-l-4 border-teal-500 p-3 rounded-r-xl my-3 text-slate-700 italic text-sm">
          {renderFormattedText(trimmed.slice(2))}
        </div>
      );
      return;
    }

    elements.push(
      <p key={index} className="text-slate-700 leading-relaxed my-2 text-sm sm:text-base">
        {renderFormattedText(trimmed)}
      </p>
    );
  });

  flushList(`list-end`);

  return <div className={`space-y-1 ${className}`}>{elements}</div>;
};
