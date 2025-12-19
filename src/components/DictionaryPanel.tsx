// src/components/DictionaryPanel.tsx
import React from 'react';

interface DictionaryPanelProps {
  words: string[];
  onRemove: (word: string) => void;
  onClose: () => void;
}

export const DictionaryPanel: React.FC<DictionaryPanelProps> = ({ words, onRemove, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}>
          <h3>📕 আমার ডিকশনারি</h3>
          <button onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-body">
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
            নিচের শব্দগুলো "ভুল" হিসেবে আর দেখানো হবে না। ডিলিট করতে ✕ এ ক্লিক করুন।
          </p>

          {words.length === 0 ? (
            <div className="empty-state" style={{ padding: '20px 0' }}>
              <div style={{ fontSize: '30px', marginBottom: '8px' }}>📭</div>
              <p>কোনো শব্দ সেভ করা নেই</p>
            </div>
          ) : (
            <div className="dictionary-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {words.map((word, index) => (
                <div 
                  key={index} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    background: '#f3f4f6',
                    border: '1px solid #e5e7eb',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#374151'
                  }}
                >
                  {word}
                  <button
                    onClick={() => onRemove(word)}
                    style={{
                      border: 'none',
                      background: '#fee2e2',
                      color: '#ef4444',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      marginLeft: '4px'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};