import React from 'react';
import { Languages, BookOpen, Activity } from 'lucide-react';

export default function Header({ onOpenDictionary, backendStatus }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="logo-brand" onClick={() => scrollTo('hero')}>
          <div className="logo-icon-wrapper">
            <Languages className="logo-icon" size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-name">TeluguTranslate<span className="gradient-text"> AI</span></span>
            <span className="brand-domain">EDUCATION NLP</span>
          </div>
        </div>

        <nav className="nav-links">
          <button className="nav-link" onClick={() => scrollTo('workspace')}>Home</button>
          <button className="nav-link" onClick={() => scrollTo('features')}>Features</button>
          <button className="nav-link" onClick={() => scrollTo('how-it-works')}>How It Works</button>
          <button className="nav-link" onClick={() => scrollTo('about')}>About Project</button>
        </nav>

        <div className="header-actions">
          <button 
            className="btn-outline-pill"
            onClick={onOpenDictionary}
            title="Explore 60+ Education phrases"
          >
            <BookOpen size={16} />
            <span>Dictionary</span>
          </button>

          <div className={`status-badge ${backendStatus}`} title={`Backend server is ${backendStatus}`}>
            <span className="status-dot"></span>
            <span className="status-label">
              {backendStatus === 'online' ? 'API Ready' : backendStatus === 'checking' ? 'Connecting...' : 'API Offline'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
