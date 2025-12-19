// src/components/SuggestionCard.tsx
import React from 'react';
import type {
  Correction,
  ToneSuggestion,
  StyleSuggestion,
  PunctuationIssue,
  EuphonyImprovement
} from '@/types';

interface BaseProps {
  onDismiss: () => void;
  onHighlight: () => void;
  onReplace: (newText: string) => void;
  onAddToDictionary?: (word: string) => void; // New Prop
}

interface SpellingCardProps extends BaseProps {
  type: 'spelling';
  data: Correction;
}

interface ToneCardProps extends BaseProps {
  type: 'tone';
  data: ToneSuggestion;
}

interface StyleCardProps extends BaseProps {
  type: 'style';
  data: StyleSuggestion;
}

interface PunctuationCardProps extends BaseProps {
  type: 'punctuation';
  data: PunctuationIssue;
}

interface EuphonyCardProps extends BaseProps {
  type: 'euphony';
  data: EuphonyImprovement;
}

type SuggestionCardProps =
  | SpellingCardProps
  | ToneCardProps
  | StyleCardProps
  | PunctuationCardProps
  | EuphonyCardProps;

export const SuggestionCard: React.FC<SuggestionCardProps> = (props) => {
  const { type, data, onDismiss, onHighlight, onReplace, onAddToDictionary } = props;

  const getCardClass = () => {
    switch (type) {
      case 'spelling': return 'suggestion-card error-card';
      case 'tone': return 'suggestion-card warning-card';
      case 'style': return 'suggestion-card info-card';
      case 'punctuation': return 'suggestion-card orange-card';
      case 'euphony': return 'suggestion-card';
      default: return 'suggestion-card';
    }
  };

  const handleMouseEnter = () => {
    onHighlight();
  };

  return (
    <div
      className={getCardClass()}
      onMouseEnter={handleMouseEnter}
      style={type === 'euphony' ? { borderLeft: '4px solid #db2777' } : {}}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        {/* New Ignore Button for Spelling */}
        {type === 'spelling' && onAddToDictionary && (
          <button 
            className="dismiss-btn" 
            title="Add to Dictionary"
            onClick={(e) => {
              e.stopPropagation();
              onAddToDictionary(data.wrong);
            }}
            style={{ position: 'relative', top: 0, right: 0, color: '#059669' }}
          >
            📕
          </button>
        )}
        <button className="dismiss-btn" onClick={onDismiss} style={{ position: 'relative', top: 0, right: 0 }}>✕</button>
      </div>

      {type === 'spelling' && (
        <>
          <div className="wrong-word">❌ {data.wrong}</div>
          {data.suggestions.map((s, j) => (
            <button key={j} className="suggestion-btn success-btn" onClick={() => onReplace(s)}>✓ {s}</button>
          ))}
        </>
      )}

      {type === 'tone' && (
        <>
          <div className="wrong-word" style={{ color: '#b45309' }}>💡 {data.current}</div>
          <div className="reason">{data.reason}</div>
          <button className="suggestion-btn warning-btn" onClick={() => onReplace(data.suggestion)}>✨ {data.suggestion}</button>
        </>
      )}

      {type === 'style' && (
        <>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>🔄 {data.current}</div>
          <button className="suggestion-btn info-btn" onClick={() => onReplace(data.suggestion)}>➜ {data.suggestion}</button>
        </>
      )}

      {type === 'punctuation' && (
        <>
          <div className="wrong-word" style={{ color: '#ea580c' }}>⚠️ {data.issue}</div>
          <div className="reason">{data.explanation}</div>
          <button className="suggestion-btn orange-btn" onClick={() => onReplace(data.correctedSentence)}>✓ {data.correctedSentence}</button>
        </>
      )}

      {type === 'euphony' && (
        <>
          <div className="wrong-word" style={{ color: '#db2777' }}>🎵 {data.current}</div>
          <div className="reason">{data.reason}</div>
          {data.suggestions.map((s, j) => (
            <button
              key={j}
              className="suggestion-btn"
              style={{ background: '#fce7f3', color: '#9f1239' }}
              onClick={() => onReplace(s)}
            >
              ♪ {s}
            </button>
          ))}
        </>
      )}
    </div>
  );
};