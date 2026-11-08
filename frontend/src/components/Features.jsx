import React from 'react';
import { Zap, Layout, BookOpenCheck, Type } from 'lucide-react';

export default function Features() {
  const featuresList = [
    {
      icon: <Zap size={24} className="feature-icon" />,
      title: "Fast Translation",
      description: "Sub-50ms instant response times using an in-memory dictionary-based lookup that requires no external network bottlenecks."
    },
    {
      icon: <Layout size={24} className="feature-icon" />,
      title: "Easy Interface",
      description: "Clean, responsive dual-pane workspace designed with modern aesthetics, keyboard shortcuts, character counters, and one-click copy."
    },
    {
      icon: <BookOpenCheck size={24} className="feature-icon" />,
      title: "Education Vocabulary",
      description: "Carefully curated dictionary of 60+ phrases focused on school, college, exams, timetable, attendance, classrooms, and teachers."
    },
    {
      icon: <Type size={24} className="feature-icon" />,
      title: "Unicode Telugu Support",
      description: "Full UTF-8 Telugu font rendering using Google Noto Sans Telugu, guaranteeing accurate conjunct characters and vowel signs."
    }
  ];

  return (
    <section id="features" className="features-section">
      <div className="section-container">
        <div className="section-header">
          <div className="badge-pill sm">
            <span>KEY CAPABILITIES</span>
          </div>
          <h2 className="section-title">Features Built for Students & Educators</h2>
          <p className="section-subtitle">
            Designed to make language translation accessible, transparent, and educational.
          </p>
        </div>

        <div className="features-grid">
          {featuresList.map((feat, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon-wrapper">
                {feat.icon}
              </div>
              <h3 className="feature-title">{feat.title}</h3>
              <p className="feature-desc">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
