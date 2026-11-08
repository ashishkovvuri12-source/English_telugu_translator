import React from 'react';
import { Sparkles, GraduationCap, ShieldCheck, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-content">
        <div className="badge-pill">
          <GraduationCap size={16} className="badge-icon" />
          <span>EDUCATION DOMAIN NLP PROJECT</span>
        </div>

        <h1 className="hero-title">
          Break Language Barriers <br />
          <span className="gradient-text">with AI</span>
        </h1>

        <p className="hero-subtitle">
          Translate English into Telugu using Natural Language Processing.
          Specially trained on educational terminology for schools, colleges, exams, and classrooms.
        </p>

        <div className="hero-tags">
          <span className="hero-tag">
            <Zap size={14} /> Rule-Based NLP Pipeline
          </span>
          <span className="hero-tag">
            <ShieldCheck size={14} /> 60+ Academic Phrases
          </span>
          <span className="hero-tag">
            <Sparkles size={14} /> 100% Unicode Telugu Support
          </span>
        </div>
      </div>
    </section>
  );
}
