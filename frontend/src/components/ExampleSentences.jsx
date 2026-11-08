import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

const EXAMPLES = [
  { id: 1, english: "Hello", telugu: "నమస్కారం", category: "Greeting" },
  { id: 2, english: "I am a student", telugu: "నేను విద్యార్థిని", category: "Identity" },
  { id: 3, english: "Where is the library?", telugu: "లైబ్రరీ ఎక్కడ ఉంది?", category: "Campus" },
  { id: 4, english: "Please explain this", telugu: "దయచేసి దీనిని వివరించండి", category: "Classroom" },
  { id: 5, english: "When is the exam?", telugu: "పరీక్ష ఎప్పుడు?", category: "Exams" },
  { id: 6, english: "Thank you", telugu: "ధన్యవాదాలు", category: "Courtesy" }
];

export default function ExampleSentences({ onSelectExample }) {
  return (
    <section className="examples-section">
      <div className="examples-container">
        <div className="section-header">
          <div className="badge-pill sm">
            <Sparkles size={14} />
            <span>TRY THESE OUT</span>
          </div>
          <h2 className="section-title">Popular Example Sentences</h2>
          <p className="section-subtitle">
            Click any sentence below to instantly load and test the Telugu NLP translation.
          </p>
        </div>

        <div className="examples-grid">
          {EXAMPLES.map((item) => (
            <div 
              key={item.id} 
              className="example-card"
              onClick={() => onSelectExample(item.english)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectExample(item.english);
                }
              }}
              title={`Click to translate "${item.english}"`}
            >
              <div className="example-top">
                <span className="example-category">{item.category}</span>
                <span className="example-arrow">
                  <ArrowRight size={14} />
                </span>
              </div>
              <div className="example-english">"{item.english}"</div>
              <div className="example-telugu">{item.telugu}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
