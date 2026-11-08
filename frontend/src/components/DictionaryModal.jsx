import React, { useState } from 'react';
import { X, Search, BookOpen, ExternalLink, Check } from 'lucide-react';

export default function DictionaryModal({ isOpen, onClose, dictionaryData, onSelectPhrase }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);

  if (!isOpen) return null;

  const entries = Object.entries(dictionaryData || {});
  const filtered = entries.filter(([eng, tel]) => 
    eng.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tel.includes(searchTerm)
  );

  const handleSelect = (englishPhrase) => {
    onSelectPhrase(englishPhrase);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <BookOpen size={20} className="modal-icon" />
            <div>
              <h3>Education Domain Dictionary</h3>
              <p className="modal-subtitle">
                {entries.length} Curated English-to-Telugu Academic Phrases
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-search">
          <Search size={18} className="search-icon" />
          <input 
            type="text"
            placeholder="Search phrases in English or Telugu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="modal-search-input"
            autoFocus
          />
        </div>

        <div className="modal-body">
          {filtered.length === 0 ? (
            <div className="modal-empty">
              No matching phrases found in the educational dictionary.
            </div>
          ) : (
            <div className="dictionary-table-wrapper">
              <table className="dictionary-table">
                <thead>
                  <tr>
                    <th>English Phrase</th>
                    <th>Telugu Translation</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(([eng, tel], idx) => (
                    <tr key={idx} className="dictionary-row">
                      <td className="eng-col">{eng}</td>
                      <td className="tel-col">{tel}</td>
                      <td className="action-col">
                        <button
                          type="button"
                          className="btn-use-phrase"
                          onClick={() => handleSelect(eng)}
                          title="Load this phrase into translator"
                        >
                          Use Phrase
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <span className="modal-footer-note">
            Click "Use Phrase" to automatically populate the translation workspace.
          </span>
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
