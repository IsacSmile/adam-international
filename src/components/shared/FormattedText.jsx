import React from 'react';

/**
 * Renders text containing client **bold** formatting safely using React elements.
 * Uses no dangerouslySetInnerHTML.
 */
export default function FormattedText({ text, className = '' }) {
  if (typeof text !== 'string') return text || null;

  // Split by **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={index} className="font-bold text-[#0B1F3A]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      })}
    </span>
  );
}
