import React from 'react';
import { Filter, Search, Globe2, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: <Filter className="step-icon" size={24} />,
      title: "Text Preprocessing",
      description: "Normalizes input by converting to lowercase, collapsing whitespace, and isolating sentence punctuation for clean lexical tokens.",
      detail: "e.g., 'Where is the library??' -> 'where is the library' + '?'"
    },
    {
      num: "02",
      icon: <Search className="step-icon" size={24} />,
      title: "Phrase Matching",
      description: "Scans the normalized query against our educational domain dictionary containing 60+ academic phrases and syntactic structures.",
      detail: "Matches against verified student/teacher educational pairs"
    },
    {
      num: "03",
      icon: <Globe2 className="step-icon" size={24} />,
      title: "Telugu Translation",
      description: "Generates high-fidelity Unicode Telugu script (UTF-8) preserving semantic context and linguistic naturalness.",
      detail: "-> 'లైబ్రరీ ఎక్కడ ఉంది?' (Telugu script rendering)"
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works-section">
      <div className="section-container">
        <div className="section-header">
          <div className="badge-pill sm">
            <span>NLP WORKFLOW</span>
          </div>
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            A 3-stage Rule-Based Natural Language Processing pipeline ensuring fast and accurate educational translation.
          </p>
        </div>

        <div className="steps-container">
          {steps.map((step, idx) => (
            <div key={idx} className="step-card">
              <div className="step-header">
                <span className="step-number">{step.num}</span>
                <div className="step-icon-wrap">{step.icon}</div>
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.description}</p>
              <div className="step-detail-pill">
                <code>{step.detail}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
