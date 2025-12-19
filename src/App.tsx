// src/App.tsx
import React from 'react';
import { SuggestionCard } from '@/components/SuggestionCard';
import { useBhashaMitra } from '@/hooks/useBhashaMitra';
import { DictionaryPanel } from '@/components/DictionaryPanel'; // New Import

function App() {
  const {
    // State
    apiKey,
    setApiKey,
    selectedModel,
    setSelectedModel,
    docType,
    setDocType,
    isLoading,
    loadingText,
    message,
    activeModal,
    setActiveModal,
    viewFilter,
    setViewFilter,
    collapsedSections,
    selectedTone,
    setSelectedTone,
    selectedStyle,
    setSelectedStyle,
    corrections,
    toneSuggestions,
    styleSuggestions,
    languageStyleMixing,
    punctuationIssues,
    euphonyImprovements,
    contentAnalysis,
    stats,
    userDictionary, // New State

    // Actions
    saveSettings,
    toggleSection,
    handleHighlight,
    handleReplace,
    dismissSuggestion,
    checkSpelling,
    shouldShowSection,
    handleAddToDictionary, // New Action
    handleRemoveFromDictionary, // New Action

    // Helpers
    getToneName,
    getDocTypeLabel,
    TONE_OPTIONS,
    STYLE_OPTIONS,
    DOC_TYPE_CONFIG
  } = useBhashaMitra();

  // --- Render Helpers ---
  const renderSectionHeader = (title: string, key: keyof typeof collapsedSections, badgeContent?: React.ReactNode) => (
    <div className="section-header">
      <h3>{title}</h3>
      {badgeContent && <span className="section-badge">{badgeContent}</span>}
      <button className="collapse-btn" onClick={() => toggleSection(key)}>
        {collapsedSections[key] ? '➕' : '➖'}
      </button>
    </div>
  );

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header-section">
        <div className="header-top">
          <button className="menu-btn header-menu-btn" onClick={() => setActiveModal('mainMenu')}>☰</button>
          <div className="app-title">
            <h1>🌟 ভাষা মিত্র</h1>
            <p>বাংলা বানান ও ব্যাকরণ পরীক্ষক</p>
          </div>
          <div className="header-spacer" />
        </div>

        <div className="toolbar">
          <div className="toolbar-top">
            <button onClick={checkSpelling} disabled={isLoading} className="btn-check">
              {isLoading ? '⏳ অপেক্ষা করুন...' : '🔍 পরীক্ষা করুন'}
            </button>
          </div>
          <div className="toolbar-bottom">
            <div className="view-filter">
              <button className={viewFilter === 'all' ? 'active' : ''} onClick={() => setViewFilter('all')}>সব</button>
              <button className={viewFilter === 'spelling' ? 'active' : ''} onClick={() => setViewFilter('spelling')}>শুধু বানান</button>
              <button className={viewFilter === 'punctuation' ? 'active' : ''} onClick={() => setViewFilter('punctuation')}>বিরামচিহ্ন</button>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Tags */}
      {(selectedTone || selectedStyle !== 'none' || docType !== 'generic') && (
        <div className="selection-display">
          {selectedTone && (
            <span className="selection-tag tone-tag">
              {getToneName(selectedTone)} <button onClick={() => setSelectedTone('')}>✕</button>
            </span>
          )}
          {selectedStyle !== 'none' && (
            <span className="selection-tag style-tag">
              {selectedStyle === 'sadhu' ? '📜 সাধু' : '💬 চলিত'} <button onClick={() => setSelectedStyle('none')}>✕</button>
            </span>
          )}
          {docType && (
            <span className="selection-tag doc-type-tag">
              📂 {getDocTypeLabel(docType)} <button onClick={() => setDocType('generic')}>✕</button>
            </span>
          )}
        </div>
      )}

      {/* Content Area */}
      <div className="content-area">
        {isLoading && (
          <div className="loading-box">
            <div className="loader"></div>
            <p>{loadingText}</p>
          </div>
        )}

        {message && <div className={`message-box ${message.type}`}>{message.text}</div>}

        {!isLoading && stats.totalWords === 0 && !message && (
          <div className="empty-state">
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>✨</div>
            <p>সাজেশন এখানে দেখা যাবে</p>
          </div>
        )}

        {/* Stats */}
        {stats.totalWords > 0 && (
          <div className="stats-grid">
            <div className="stat-card"><div className="val" style={{ color: '#667eea' }}>{stats.totalWords}</div><div className="lbl">শব্দ</div></div>
            <div className="stat-card"><div className="val" style={{ color: '#dc2626' }}>{stats.errorCount}</div><div className="lbl">ভুল</div></div>
            <div className="stat-card"><div className="val" style={{ color: '#16a34a' }}>{stats.accuracy}%</div><div className="lbl">শুদ্ধতা</div></div>
          </div>
        )}

        {/* Content Analysis */}
        {contentAnalysis && shouldShowSection('content') && (
          <>
            {renderSectionHeader('📋 কনটেন্ট বিশ্লেষণ', 'content')}
            {!collapsedSections.content && (
              <>
                <div className="analysis-card content-analysis">
                  <h3>{contentAnalysis.contentType}</h3>
                  <p>{contentAnalysis.description}</p>
                </div>
                {contentAnalysis.missingElements?.length ? (
                  <div className="analysis-card missing-analysis">
                    <h3>⚠️ যা যোগ করুন</h3>
                    <ul>{contentAnalysis.missingElements.map((e, i) => <li key={i}>{e}</li>)}</ul>
                  </div>
                ) : null}
              </>
            )}
          </>
        )}

        {/* Spelling */}
        {corrections.length > 0 && shouldShowSection('spelling') && (
          <>
            {renderSectionHeader(
              '📝 বানান ভুল',
              'spelling',
              <span style={{ background: '#fee2e2', color: '#dc2626' }}>{corrections.length}</span>
            )}
            {!collapsedSections.spelling && corrections.map((c, i) => (
              <SuggestionCard
                key={`spelling-${i}`}
                type="spelling"
                data={c}
                onDismiss={() => dismissSuggestion('spelling', c.wrong)}
                onHighlight={() => handleHighlight(c.wrong, '#fee2e2', c.position)}
                onReplace={(s) => handleReplace(c.wrong, s, c.position)}
                onAddToDictionary={handleAddToDictionary} // New Prop
              />
            ))}
          </>
        )}

        {/* Tone */}
        {toneSuggestions.length > 0 && shouldShowSection('tone') && (
          <>
            {renderSectionHeader(
              '💬 টোন রূপান্তর',
              'tone',
              <span style={{ background: '#fef3c7', color: '#92400e' }}>{getToneName(selectedTone)}</span>
            )}
            {!collapsedSections.tone && toneSuggestions.map((t, i) => (
              <SuggestionCard
                key={`tone-${i}`}
                type="tone"
                data={t}
                onDismiss={() => dismissSuggestion('tone', t.current)}
                onHighlight={() => handleHighlight(t.current, '#fef3c7', t.position)}
                onReplace={(s) => handleReplace(t.current, s, t.position)}
              />
            ))}
          </>
        )}

        {/* Style */}
        {styleSuggestions.length > 0 && shouldShowSection('style') && (
          <>
            {renderSectionHeader('📝 ভাষারীতি', 'style')}
            {!collapsedSections.style && styleSuggestions.map((s, i) => (
              <SuggestionCard
                key={`style-${i}`}
                type="style"
                data={s}
                onDismiss={() => dismissSuggestion('style', s.current)}
                onHighlight={() => handleHighlight(s.current, '#ccfbf1', s.position)}
                onReplace={(newText) => handleReplace(s.current, newText, s.position)}
              />
            ))}
          </>
        )}

        {/* Mixing */}
        {languageStyleMixing?.detected && selectedStyle === 'none' && shouldShowSection('mixing') && (
          <>
            {renderSectionHeader('🔄 মিশ্রণ সনাক্ত', 'mixing')}
            {!collapsedSections.mixing && languageStyleMixing.corrections?.map((c, i) => (
              <SuggestionCard
                key={`mixing-${i}`}
                type="style"
                data={c}
                onDismiss={() => dismissSuggestion('mixing', c.current)}
                onHighlight={() => handleHighlight(c.current, '#e9d5ff', c.position)}
                onReplace={(newText) => handleReplace(c.current, newText, c.position)}
              />
            ))}
          </>
        )}

        {/* Punctuation */}
        {punctuationIssues.length > 0 && shouldShowSection('punctuation') && (
          <>
            {renderSectionHeader('🔤 বিরাম চিহ্ন', 'punctuation')}
            {!collapsedSections.punctuation && punctuationIssues.map((p, i) => (
              <SuggestionCard
                key={`punct-${i}`}
                type="punctuation"
                data={p}
                onDismiss={() => dismissSuggestion('punct', p.currentSentence)}
                onHighlight={() => handleHighlight(p.currentSentence, '#ffedd5')}
                onReplace={(newText) => handleReplace(p.currentSentence, newText)}
              />
            ))}
          </>
        )}

        {/* Euphony */}
        {euphonyImprovements.length > 0 && shouldShowSection('euphony') && (
          <>
            {renderSectionHeader('🎵 শ্রুতিমধুরতা', 'euphony')}
            {!collapsedSections.euphony && euphonyImprovements.map((e, i) => (
              <SuggestionCard
                key={`euphony-${i}`}
                type="euphony"
                data={e}
                onDismiss={() => dismissSuggestion('euphony', e.current)}
                onHighlight={() => handleHighlight(e.current, '#fce7f3', e.position)}
                onReplace={(s) => handleReplace(e.current, s, e.position)}
              />
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="footer">
        <p>Developed by: হিমাদ্রি বিশ্বাস</p>
      </div>

      {/* ============ MODALS ============ */}

      {/* Dictionary Panel */}
      {activeModal === 'dictionary' && (
        <DictionaryPanel
          words={userDictionary}
          onRemove={handleRemoveFromDictionary}
          onClose={() => setActiveModal('none')}
        />
      )}

      {/* Main Menu */}
      {activeModal === 'mainMenu' && (
        <div className="modal-overlay" onClick={() => setActiveModal('none')}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header menu-header"><h3>☰ মেনু</h3><button onClick={() => setActiveModal('none')}>✕</button></div>
            <div className="modal-body">
              {/* Dictionary Option Added */}
              <div className="option-item" onClick={() => setActiveModal('dictionary')}>
                <div className="opt-icon">📕</div>
                <div><div className="opt-title">আমার ডিকশনারি</div><div className="opt-desc">আপনার সেভ করা শব্দ দেখুন</div></div>
              </div>
              
              <div className="option-item" onClick={() => setActiveModal('tone')}>
                <div className="opt-icon">🗣️</div>
                <div><div className="opt-title">টোন</div><div className="opt-desc">{selectedTone ? getToneName(selectedTone) : 'সেট নেই'}</div></div>
              </div>
              <div className="option-item" onClick={() => setActiveModal('style')}>
                <div className="opt-icon">📝</div>
                <div><div className="opt-title">ভাষারীতি</div><div className="opt-desc">{selectedStyle === 'none' ? 'স্বয়ংক্রিয়' : selectedStyle}</div></div>
              </div>
              <div className="option-item" onClick={() => setActiveModal('doctype')}>
                <div className="opt-icon">📂</div>
                <div><div className="opt-title">ডকুমেন্ট টাইপ</div><div className="opt-desc">{getDocTypeLabel(docType)}</div></div>
              </div>
              <div className="option-item" onClick={() => setActiveModal('settings')}>
                <div className="opt-icon">⚙️</div>
                <div><div className="opt-title">সেটিংস</div></div>
              </div>
              <div className="option-item" onClick={() => setActiveModal('instructions')}>
                <div className="opt-icon">❓</div>
                <div><div className="opt-title">নির্দেশিকা</div></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings, Instructions, Tone, Style, DocType Modals remain same (just hide for brevity if you want, but I'll assume they are there as per your request to keep features) */}
      
      {/* Settings */}
      {activeModal === 'settings' && (
        <div className="modal-overlay" onClick={() => setActiveModal('none')}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header settings-header"><h3>⚙️ সেটিংস</h3><button onClick={() => setActiveModal('none')}>✕</button></div>
            <div className="modal-body">
              <label>🔑 Google Gemini API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="API Key"
              />
              <label>🤖 AI Model</label>
              <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)}>
                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                <option value="gemini-2.5-flash-lite">Gemini 2.5 Flash Lite</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
              </select>
              <button onClick={saveSettings} className="btn-primary-full">✓ সংরক্ষণ</button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {activeModal === 'instructions' && (
        <div className="modal-overlay" onClick={() => setActiveModal('none')}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header instructions-header"><h3>🎯 নির্দেশিকা</h3><button onClick={() => setActiveModal('none')}>✕</button></div>
            <div className="modal-body">
              <p>১. সেটিংস থেকে API Key দিন।<br />২. টেক্সট সিলেক্ট করুন।<br />৩. পরীক্ষা করুন বাটনে ক্লিক করুন।</p>
            </div>
          </div>
        </div>
      )}

      {/* Tone Modal */}
      {activeModal === 'tone' && (
        <div className="modal-overlay" onClick={() => setActiveModal('none')}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header tone-header"><h3>💬 টোন</h3><button onClick={() => setActiveModal('none')}>✕</button></div>
            <div className="modal-body">
              {TONE_OPTIONS.map(opt => (
                <div
                  key={opt.id}
                  className={`option-item ${selectedTone === opt.id ? 'selected' : ''}`}
                  onClick={() => { setSelectedTone(opt.id); setActiveModal('none'); }}
                >
                  <div className="opt-icon">{opt.icon}</div>
                  <div>
                    <div className="opt-title">{opt.title}</div>
                    <div className="opt-desc">{opt.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Style Modal */}
      {activeModal === 'style' && (
        <div className="modal-overlay" onClick={() => setActiveModal('none')}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header style-header"><h3>📝 ভাষারীতি</h3><button onClick={() => setActiveModal('none')}>✕</button></div>
            <div className="modal-body">
              {STYLE_OPTIONS.map(opt => (
                <div
                  key={opt.id}
                  className={`option-item ${selectedStyle === opt.id ? 'selected' : ''}`}
                  onClick={() => { setSelectedStyle(opt.id); setActiveModal('none'); }}
                >
                  <div className="opt-icon">{opt.icon}</div>
                  <div>
                    <div className="opt-title">{opt.title}</div>
                    <div className="opt-desc">{opt.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DocType Modal */}
      {activeModal === 'doctype' && (
        <div className="modal-overlay" onClick={() => setActiveModal('none')}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header style-header"><h3>📂 ডকুমেন্ট টাইপ</h3><button onClick={() => setActiveModal('none')}>✕</button></div>
            <div className="modal-body">
              {(['generic', 'academic', 'official', 'marketing', 'social'] as const).map(dt => (
                <div
                  key={dt}
                  className={`option-item ${docType === dt ? 'selected' : ''}`}
                  onClick={() => { setDocType(dt); setActiveModal('none'); }}
                >
                  <div className="opt-icon">📂</div>
                  <div>
                    <div className="opt-title">{getDocTypeLabel(dt)}</div>
                    <div className="opt-desc">{DOC_TYPE_CONFIG[dt].description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;