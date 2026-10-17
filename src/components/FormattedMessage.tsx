import React from 'react';

interface FormattedMessageProps {
  text: string;
}

/**
 * Parses inline markdown:
 * - **bold text** -> <strong>
 * - `code` -> <code>
 * - ₹ currency styling
 */
function renderInlineText(text: string): React.ReactNode[] {
  // Split by bold (**text**) and code (`text`)
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      const content = token.slice(2, -2);
      // Highlight amounts or key words nicely
      const isAmount = content.includes('₹');
      parts.push(
        <strong
          key={match.index}
          className={`font-bold ${isAmount ? 'text-emerald-800 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200' : 'text-slate-900'}`}
        >
          {content}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={match.index} className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-xs font-mono">
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

/**
 * Human-readable message formatter component:
 * Converts raw markdown/Hinglish bot text into clean, structured paragraphs,
 * styled callout cards (for warnings, deductions, questions), and neat bullet lists.
 */
export const FormattedMessage: React.FC<FormattedMessageProps> = ({ text }) => {
  if (!text) return null;

  // Split into lines/paragraphs
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentBullets: string[] = [];
  let bulletCounter = 0;

  const flushBullets = () => {
    if (currentBullets.length > 0) {
      const isNumbered = /^\d+\./.test(currentBullets[0].trim());
      elements.push(
        <div key={`bullets-${bulletCounter++}`} className="my-2 space-y-1.5 pl-1">
          {currentBullets.map((bullet, idx) => {
            const cleanBullet = bullet.replace(/^([•\-\*]|\d+\.)\s*/, '');
            return (
              <div key={idx} className="flex items-start space-x-2 text-xs sm:text-sm">
                <span className="text-saathi-waLight font-bold mt-0.5 select-none">
                  {isNumbered ? `${idx + 1}.` : '•'}
                </span>
                <div className="flex-1 text-slate-700 leading-relaxed">
                  {renderInlineText(cleanBullet)}
                </div>
              </div>
            );
          })}
        </div>
      );
      currentBullets = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Empty line separates paragraphs
    if (!trimmed) {
      flushBullets();
      return;
    }

    // Bullet line check
    if (/^([•\-\*]|\d+\.)\s+/.test(trimmed)) {
      currentBullets.push(trimmed);
      return;
    }

    // If we were collecting bullets, flush them before starting standard content
    flushBullets();

    // Check for special styled callout lines
    // 1. Red Penalty Callout: starts with ❌ or has penalty keyword
    if (trimmed.startsWith('❌') || trimmed.toLowerCase().includes('bada jhatka')) {
      const cleanContent = trimmed.replace(/^❌\s*/, '');
      elements.push(
        <div
          key={`callout-red-${index}`}
          className="my-2 p-2.5 bg-red-50/90 border-l-4 border-red-500 rounded-r-lg text-red-950 text-xs sm:text-sm shadow-xs"
        >
          <div className="flex items-start space-x-2">
            <span className="text-base select-none">❌</span>
            <div className="flex-1 leading-relaxed">
              {renderInlineText(cleanContent)}
            </div>
          </div>
        </div>
      );
      return;
    }

    // 2. Yellow/Amber Warning: starts with ⚠️
    if (trimmed.startsWith('⚠️')) {
      const cleanContent = trimmed.replace(/^⚠️\s*/, '');
      elements.push(
        <div
          key={`callout-amber-${index}`}
          className="my-2 p-2.5 bg-amber-50/90 border-l-4 border-amber-500 rounded-r-lg text-amber-950 text-xs sm:text-sm shadow-xs"
        >
          <div className="flex items-start space-x-2">
            <span className="text-base select-none">⚠️</span>
            <div className="flex-1 leading-relaxed">
              {renderInlineText(cleanContent)}
            </div>
          </div>
        </div>
      );
      return;
    }

    // 3. Green Success / Affirmation: starts with ✅
    if (trimmed.startsWith('✅')) {
      const cleanContent = trimmed.replace(/^✅\s*/, '');
      elements.push(
        <div
          key={`callout-green-${index}`}
          className="my-2 p-2.5 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg text-emerald-950 text-xs sm:text-sm shadow-xs"
        >
          <div className="flex items-start space-x-2">
            <span className="text-base select-none">✅</span>
            <div className="flex-1 leading-relaxed font-medium">
              {renderInlineText(cleanContent)}
            </div>
          </div>
        </div>
      );
      return;
    }

    // 4. Blue Tip / Facts: starts with 💡 or ℹ️
    if (trimmed.startsWith('💡') || trimmed.startsWith('ℹ️')) {
      const cleanContent = trimmed.replace(/^(💡|ℹ️)\s*/, '');
      elements.push(
        <div
          key={`callout-blue-${index}`}
          className="my-2 p-2.5 bg-blue-50/90 border-l-4 border-blue-500 rounded-r-lg text-blue-950 text-xs sm:text-sm shadow-xs"
        >
          <div className="flex items-start space-x-2">
            <span className="text-base select-none">💡</span>
            <div className="flex-1 leading-relaxed">
              {renderInlineText(cleanContent)}
            </div>
          </div>
        </div>
      );
      return;
    }

    // 5. Weather / Rider Defense: starts with 🌧️
    if (trimmed.startsWith('🌧️')) {
      const cleanContent = trimmed.replace(/^🌧️\s*/, '');
      elements.push(
        <div
          key={`callout-weather-${index}`}
          className="my-2 p-2.5 bg-sky-50 border-l-4 border-sky-400 rounded-r-lg text-sky-950 text-xs sm:text-sm shadow-xs"
        >
          <div className="flex items-start space-x-2">
            <span className="text-base select-none">🌧️</span>
            <div className="flex-1 leading-relaxed">
              {renderInlineText(cleanContent)}
            </div>
          </div>
        </div>
      );
      return;
    }

    // 6. Action Prompt: starts with 👉
    if (trimmed.startsWith('👉')) {
      const cleanContent = trimmed.replace(/^👉\s*/, '');
      elements.push(
        <div
          key={`callout-action-${index}`}
          className="my-2.5 p-2.5 bg-emerald-100/60 border border-emerald-300 rounded-xl text-emerald-900 text-xs sm:text-sm font-semibold flex items-center space-x-2"
        >
          <span className="text-base select-none">👉</span>
          <div className="flex-1 leading-relaxed">
            {renderInlineText(cleanContent)}
          </div>
        </div>
      );
      return;
    }

    // Regular readable paragraph
    elements.push(
      <p key={`p-${index}`} className="my-1.5 leading-relaxed text-slate-800 text-xs sm:text-sm">
        {renderInlineText(trimmed)}
      </p>
    );
  });

  flushBullets();

  return <div className="space-y-1">{elements}</div>;
};
