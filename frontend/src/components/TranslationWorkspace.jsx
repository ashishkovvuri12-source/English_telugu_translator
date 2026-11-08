import React, { useState } from 'react';
import { 
  ArrowRight, 
  Copy, 
  Check, 
  Trash2, 
  Loader2, 
  Volume2, 
  AlertCircle, 
  BookOpen, 
  Sparkles,
  Info
} from 'lucide-react';

export default function TranslationWorkspace({ 
  inputText, 
  setInputText, 
  outputText, 
  isLoading, 
  errorMessage, 
  warningNotice,
  nlpMetadata,
  onTranslate, 
  onClear,
  onSelectExample
}) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const charCount = inputText.length;
  const maxChars = 500;

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSpeak = () => {
    if (!outputText || !window.speechSynthesis) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(outputText);
    // Attempt Telugu voice if available in the browser, fallback to default
    const voices = window.speechSynthesis.getVoices();
    const teluguVoice = voices.find(v => v.lang.includes('te') || v.lang.includes('Telugu'));
    if (teluguVoice) {
      utterance.voice = teluguVoice;
      utterance.lang = 'te-IN';
    } else {
      utterance.lang = 'en-US';
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const handleKeyDown = (e) => {
    // Ctrl+Enter or Cmd+Enter to trigger translation
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (inputText.trim() && !isLoading) {
        onTranslate();
      }
    }
  };

  return (
    <section id="workspace" className="workspace-section">
      <div className="workspace-container">
        
        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="alert-banner error-banner" role="alert">
            <AlertCircle size={18} className="alert-icon" />
            <div className="alert-text">
              <strong>Connection Notice:</strong> {errorMessage}
            </div>
          </div>
        )}

        {/* Translation Panels Container */}
        <div className="panels-wrapper">
          
          {/* LEFT PANEL: ENGLISH INPUT */}
          <div className="panel input-panel">
            <div className="panel-header">
              <div className="panel-label">
                <span className="lang-code">EN</span>
                <span className="lang-title">English</span>
                <span className="lang-subtitle">(Source)</span>
              </div>
              <div className="panel-actions-top">
                {inputText && (
                  <button 
                    type="button" 
                    className="btn-icon-text" 
                    onClick={onClear}
                    title="Clear input text"
                    id="clear-btn"
                  >
                    <Trash2 size={15} />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            <div className="textarea-container">
              <textarea
                id="english-input"
                className="translation-textarea"
                value={inputText}
                onChange={(e) => setInputText(e.target.value.slice(0, maxChars))}
                onKeyDown={handleKeyDown}
                placeholder="Enter an English sentence (e.g. 'Where is the library?' or 'I am a student')..."
                rows={6}
                aria-label="English input text"
              />
            </div>

            <div className="panel-footer">
              <div className="char-counter" aria-live="polite">
                <span className={charCount >= maxChars ? 'char-limit' : ''}>
                  {charCount}
                </span> / {maxChars} characters
              </div>
              <div className="keyboard-tip">
                Tip: Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to translate
              </div>
            </div>
          </div>

          {/* ACTION BUTTON BETWEEN PANELS */}
          <div className="action-divider">
            <button
              type="button"
              id="translate-btn"
              className="btn-translate"
              onClick={onTranslate}
              disabled={!inputText.trim() || isLoading}
              title={!inputText.trim() ? "Type a sentence first" : "Translate to Telugu"}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="spin-icon" />
                  <span>Translating...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Translate Now</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          {/* RIGHT PANEL: TELUGU OUTPUT */}
          <div className="panel output-panel">
            <div className="panel-header">
              <div className="panel-label">
                <span className="lang-code telugu-badge">TE</span>
                <span className="lang-title">తెలుగు</span>
                <span className="lang-subtitle">(Telugu)</span>
              </div>
              <div className="panel-actions-top">
                {outputText && (
                  <div className="output-actions">
                    <button
                      type="button"
                      className="btn-icon-text"
                      onClick={handleSpeak}
                      disabled={isSpeaking}
                      title="Listen to pronunciation"
                    >
                      <Volume2 size={15} />
                      <span>{isSpeaking ? 'Speaking...' : 'Listen'}</span>
                    </button>
                    <button
                      type="button"
                      className={`btn-icon-text ${copied ? 'copied-btn' : ''}`}
                      onClick={handleCopy}
                      title="Copy Telugu translation"
                      id="copy-btn"
                    >
                      {copied ? <Check size={15} className="check-green" /> : <Copy size={15} />}
                      <span>{copied ? 'Copied!' : 'Copy Translation'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="textarea-container output-container">
              {isLoading ? (
                <div className="loading-state">
                  <Loader2 size={36} className="spin-icon loader-accent" />
                  <p className="loading-text">Analyzing sentence with NLP pipeline...</p>
                  <span className="loading-subtext">Normalizing • Matching phrase dictionary • Encoding Unicode</span>
                </div>
              ) : outputText ? (
                <div className="telugu-output-box">
                  <div className="telugu-text" id="telugu-output">
                    {outputText}
                  </div>
                  
                  {/* Warning / limited domain notice if sentence was out-of-domain */}
                  {warningNotice && (
                    <div className="domain-notice">
                      <Info size={16} className="notice-icon" />
                      <div>
                        <strong>Limited Domain Notice:</strong> {warningNotice}
                      </div>
                    </div>
                  )}

                  {/* NLP Pipeline pill */}
                  {nlpMetadata && (
                    <div className="nlp-pipeline-badge">
                      <span className="pill-dot"></span>
                      <span>NLP Method: <strong>{nlpMetadata.matched_type === 'exact_phrase' ? 'Exact Phrase Match' : 'Domain Guided Rule'}</strong></span>
                      <span className="pill-divider">•</span>
                      <span>Domain: <strong>Education</strong></span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon-circle">
                    <BookOpen size={28} className="empty-icon" />
                  </div>
                  <h3 className="empty-title">Your Telugu translation will appear here</h3>
                  <p className="empty-subtitle">
                    Type an English educational sentence on the left or select an example sentence below.
                  </p>
                </div>
              )}
            </div>

            <div className="panel-footer output-footer">
              <span className="unicode-badge">UTF-8 Telugu Script Supported</span>
              {outputText && (
                <span className="word-count">
                  {outputText.trim().split(/\s+/).filter(Boolean).length} Telugu words
                </span>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
