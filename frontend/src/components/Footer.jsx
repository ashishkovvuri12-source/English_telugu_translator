import React from 'react';
import { Heart, Languages, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <Languages size={20} />
              <span>TeluguTranslate AI</span>
            </div>
            <p className="footer-tagline">
              English-to-Telugu Natural Language Processing system engineered for educational and academic environments.
            </p>
          </div>

          <div className="footer-meta">
            <div className="meta-group">
              <span className="meta-title">Domain</span>
              <span className="meta-value">Education & Academia</span>
            </div>
            <div className="meta-group">
              <span className="meta-title">Backend</span>
              <span className="meta-value">Python Flask • Rule-Based NLP</span>
            </div>
            <div className="meta-group">
              <span className="meta-title">Frontend</span>
              <span className="meta-value">React 18 • Vite • Vanilla CSS3</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} <strong>TeluguTranslate AI</strong> — English-to-Telugu NLP Mini Project.
          </p>
          
          <button className="btn-back-to-top" onClick={scrollToTop} aria-label="Back to top">
            <span>Back to Top</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
