import React from 'react';
import { Info, Cpu, CheckCircle2, AlertTriangle, BookMarked } from 'lucide-react';

export default function AboutProject() {
  return (
    <section id="about" className="about-section">
      <div className="section-container">
        <div className="section-header">
          <div className="badge-pill sm">
            <span>ACADEMIC FOUNDATION</span>
          </div>
          <h2 className="section-title">About TeluguTranslate AI</h2>
          <p className="section-subtitle">
            Exploring the foundations of Natural Language Processing and Machine Translation.
          </p>
        </div>

        <div className="about-grid">
          {/* Column 1: Role of NLP */}
          <div className="about-card">
            <div className="about-card-header">
              <Cpu className="about-card-icon" size={24} />
              <h3 className="about-card-title">The Role of NLP in Translation</h3>
            </div>
            <p className="about-text">
              Natural Language Processing (NLP) is a branch of artificial intelligence that empowers computers to comprehend, analyze, and generate human language. In language translation, NLP bridges grammatical and structural differences between languages.
            </p>
            <p className="about-text">
              While English primarily follows a <strong>Subject-Verb-Object (SVO)</strong> word order (e.g., <em>"I read a book"</em>), Dravidian languages like Telugu follow a <strong>Subject-Object-Verb (SOV)</strong> structure (e.g., <em>"నేను పుస్తకం చదువుతున్నాను"</em>).
            </p>
            <div className="about-highlight-box">
              <span className="font-semibold text-indigo">Linguistic Fact:</span> Telugu is known as the <em>"Italian of the East"</em> because every native word ends with a vowel sound (Ajanta Bhasha).
            </div>
          </div>

          {/* Column 2: Educational Scope & Rule-Based Design */}
          <div className="about-card">
            <div className="about-card-header">
              <BookMarked className="about-card-icon" size={24} />
              <h3 className="about-card-title">Rule-Based & Limited Domain Scope</h3>
            </div>
            <p className="about-text">
              This project implements <strong>Rule-Based Machine Translation (RBMT)</strong> and an extensive <strong>Domain-Specific Lexicon</strong>. Rather than relying on expensive, black-box cloud APIs, TeluguTranslate AI leverages deterministic linguistic rules and curated parallel corpora.
            </p>
            
            <div className="disclaimer-callout">
              <div className="disclaimer-title">
                <AlertTriangle size={18} className="warn-icon" />
                <span>Limited Domain Notice</span>
              </div>
              <p className="disclaimer-text">
                This application does <strong>not</strong> claim to translate arbitrary or open-domain English sentences. It is intentionally specialized for the <strong>educational domain</strong> (classroom dialogues, examination queries, campus facilities, student-teacher interactions).
              </p>
            </div>

            <ul className="about-bullet-list">
              <li>
                <CheckCircle2 size={16} className="bullet-icon" />
                <span>Zero hallucination risk within defined vocabulary</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="bullet-icon" />
                <span>Deterministic, explainable NLP pipeline for learning</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="bullet-icon" />
                <span>No external paid API keys or internet tracking required</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
