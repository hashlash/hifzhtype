import React from 'react';
import { GameConfig, WordStatus } from '../types/game';
import { normalizeArabic, compareArabic } from '../utils/gameUtils';

export interface WordProps {
  text: string;
  translation?: string;
  status: WordStatus['status'] | 'typing';
  typedText?: string;
  config?: GameConfig;
}

export default function Word({
  text,
  translation,
  status,
  typedText = '',
  config,
}: WordProps) {
  const showVocalized =
    status === 'correct' ||
    status === 'leadin' ||
    (status === 'revealed' && config?.spoilerRevealType === 'vocalized');

  const showBase =
    status === 'revealed' && config?.spoilerRevealType === 'base';

  const displayText = showVocalized
    ? text
    : showBase
      ? normalizeArabic(text)
      : typedText;

  const showTranslation =
    config &&
    (config.translationDisplay === 'word' ||
      config.translationDisplay === 'both') &&
    (status === 'correct' || status === 'revealed' || status === 'leadin');

  const renderTypedContent = () => {
    if (status !== 'typing' && status !== 'incorrect') return displayText;

    if (!config?.realTimeFeedback && status === 'typing') return typedText;

    // Real-time feedback rendering letter by letter
    const chars = typedText.split('');
    const targetBase = normalizeArabic(text);

    return chars.map((char, idx) => {
      const isCorrect =
        idx < targetBase.length && compareArabic(char, targetBase[idx]);
      return (
        <span key={idx} style={{ color: isCorrect ? 'green' : 'red' }}>
          {char}
        </span>
      );
    });
  };

  const getStatusColor = () => {
    if (status === 'correct' || status === 'leadin') return 'black';
    if (status === 'revealed') return 'blue';
    if (status === 'incorrect') return 'red';
    return 'inherit';
  };

  return (
    <span className="word-wrapper">
      <span
        className={`word ${status}`}
        title={
          config?.translationPosition === 'tooltip' ? translation : undefined
        }
        style={{ color: getStatusColor() }}
      >
        {status === 'typing' || status === 'incorrect'
          ? renderTypedContent()
          : displayText}
      </span>
      {showTranslation && config.translationPosition === 'below' && (
        <div className="word-translation" dir="ltr">
          {translation}
        </div>
      )}
      <style>{`
        .word-wrapper {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          vertical-align: top;
        }
        .word-translation {
          font-size: 0.4em;
          color: #888;
          line-height: 1;
          margin-top: -5px;
        }
        .word.typing {
           border-bottom: 2px solid #007bff;
           min-width: 1em;
           display: inline-block;
        }
      `}</style>
    </span>
  );
}
