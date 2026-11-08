import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TranslationWorkspace from './components/TranslationWorkspace';
import ExampleSentences from './components/ExampleSentences';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import AboutProject from './components/AboutProject';
import DictionaryModal from './components/DictionaryModal';
import Footer from './components/Footer';

// Fallback education dictionary in case backend is offline during initial view
const FALLBACK_DICTIONARY = {
  "hello": "నమస్కారం",
  "good morning": "శుభోదయం",
  "good afternoon": "శుభ మధ్యాహ్నం",
  "good evening": "శుభ సాయంత్రం",
  "thank you": "ధన్యవాదాలు",
  "thank you very much": "మీకు చాలా ధన్యవాదాలు",
  "you are welcome": "స్వాగతం",
  "please explain this": "దయచేసి దీనిని వివరించండి",
  "please help me": "దయచేసి నాకు సహాయం చేయండి",
  "excuse me": "నన్ను క్షమించండి",
  "may i come in": "నేను లోపలికి రావచ్చా?",
  "student": "విద్యార్థి",
  "students": "విద్యార్థులు",
  "teacher": "ఉపాధ్యాయుడు",
  "teachers": "ఉపాధ్యాయులు",
  "school": "పాఠశాల",
  "college": "కళాశాల",
  "library": "లైబ్రరీ",
  "book": "పుస్తకం",
  "exam": "పరీక్ష",
  "i am a student": "నేను విద్యార్థిని",
  "i am a teacher": "నేను ఉపాధ్యాయుడిని",
  "she is a teacher": "ఆమె ఉపాధ్యాయురాలు",
  "he is a professor": "అతను ప్రొఫెసర్",
  "who is your teacher": "మీ ఉపాధ్యాయుడు ఎవరు?",
  "who is the principal": "ప్రిన్సిపాల్ ఎవరు?",
  "we are students": "మేము విద్యార్థులము",
  "this is my school": "ఇది నా పాఠశాల",
  "this is my college": "ఇది నా కళాశాల",
  "where is the library": "లైబ్రరీ ఎక్కడ ఉంది?",
  "where is the classroom": "తరగతి గది ఎక్కడ ఉంది?",
  "where is the laboratory": "ప్రయోగశాల ఎక్కడ ఉంది?",
  "where is the computer lab": "కంప్యూటర్ ల్యాబ్ ఎక్కడ ఉంది?",
  "where is the principal's office": "ప్రిన్సిపాల్ కార్యాలయం ఎక్కడ ఉంది?",
  "the library is open": "లైబ్రరీ తెరిచి ఉంది",
  "the library is closed": "లైబ్రరీ మూసివేయబడింది",
  "when is the exam": "పరీక్ష ఎప్పుడు?",
  "what is the syllabus": "సిలబస్ ఏమిటి?",
  "did you pass the exam": "మీరు పరీక్షలో ఉత్తీర్ణులయ్యారా?",
  "when are the results": "ఫలితాలు ఎప్పుడు?",
  "the exam is difficult": "పరీక్ష కష్టంగా ఉంది",
  "the exam is easy": "పరీక్ష సులభంగా ఉంది",
  "hall ticket is required": "హాల్ టికెట్ అవసరం",
  "study well for the exam": "పరీక్ష కోసం బాగా చదవండి",
  "what is the timetable": "సమయ పట్టిక ఏమిటి?",
  "class starts at nine am": "తరగతి ఉదయం తొమ్మిది గంటలకు ప్రారంభమవుతుంది",
  "i like mathematics": "నాకు గణితం అంటే ఇష్టం",
  "i like science": "నాకు సైన్స్ అంటే ఇష్టం",
  "i am studying english": "నేను ఇంగ్లీష్ చదువుతున్నాను",
  "today is a holiday": "ఈ రోజు సెలవు దినం",
  "attendance is compulsory": "హాజరు తప్పనిసరి",
  "open your textbook": "మీ పాఠ్యపుస్తకాన్ని తెరవండి",
  "open your notebook": "మీ నోట్‌బుక్‌ను తెరవండి",
  "write down the notes": "నోట్స్ రాసుకోండి",
  "i want a book": "నాకు ఒక పుస్తకం కావాలి",
  "i am reading a book": "నేను పుస్తకం చదువుతున్నాను",
  "have you completed your homework": "మీరు మీ హోంవర్క్ పూర్తి చేశారా?",
  "i completed my homework": "నేను నా హోంవర్క్ పూర్తి చేసాను",
  "please submit the assignment": "దయచేసి అసైన్‌మెంట్‌ను సమర్పించండి",
  "i have a doubt": "నాకు ఒక సందేహం ఉంది",
  "can you explain again": "మీరు మళ్లీ వివరించగలరా?",
  "i do not understand": "నాకు అర్థం కాలేదు",
  "i understand": "నాకు అర్థమైంది",
  "listen carefully": "శ్రద్ధగా వినండి",
  "ask questions": "ప్రశ్నలు అడగండి",
  "education is important": "విద్య చాలా ముఖ్యమైనది",
  "knowledge is power": "జ్ఞానమే మహాబలం",
  "practice makes perfect": "సాధన చేయడం వల్ల నైపుణ్యం వస్తుంది"
};

// Dynamically determine backend API base URL for local development and online public deployment
const getApiBaseUrl = () => {
  // If an environment variable is configured (e.g. on Vercel: VITE_API_URL=https://my-backend.onrender.com)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }
  // If running locally in development (Vite dev server)
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://127.0.0.1:5000';
  }
  // If deployed in production where frontend and backend are hosted together
  return '';
};

const API_BASE_URL = getApiBaseUrl();

export default function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [warningNotice, setWarningNotice] = useState('');
  const [nlpMetadata, setNlpMetadata] = useState(null);
  
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [dictionaryData, setDictionaryData] = useState(FALLBACK_DICTIONARY);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);

  // Check backend health on initial load
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        setBackendStatus('online');
        setErrorMessage('');
        fetchDictionary();
      } else {
        setBackendStatus('offline');
      }
    } catch (err) {
      console.warn('Backend server not currently reached at', API_BASE_URL || window.location.origin);
      setBackendStatus('offline');
    }
  };

  const fetchDictionary = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/dictionary`);
      if (res.ok) {
        const data = await res.json();
        if (data.dictionary) {
          setDictionaryData(data.dictionary);
        }
      }
    } catch (e) {
      // Fallback dictionary is already pre-loaded
    }
  };

  const performTranslation = async (textToTranslate) => {
    const text = (textToTranslate !== undefined ? textToTranslate : inputText).trim();
    if (!text) return;

    setIsLoading(true);
    setErrorMessage('');
    setWarningNotice('');
    setNlpMetadata(null);

    try {
      const response = await fetch(`${API_BASE_URL}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server returned error (${response.status})`);
      }

      setBackendStatus('online');
      setOutputText(data.translation || '');

      if (data.status === 'unsupported') {
        setWarningNotice(data.message || 'This sentence is not found in the education domain dictionary.');
      }

      setNlpMetadata({
        matched_type: data.matched_type || 'phrase_matching',
        domain: data.domain || 'Education',
        normalized_query: data.normalized_query
      });

    } catch (error) {
      console.error('Translation error:', error);
      setBackendStatus('offline');
      setErrorMessage(
        'Unable to connect to the Python Flask backend at ' + (API_BASE_URL || 'current host') + '. ' +
        'Please ensure the Flask backend server is running ("python app.py" or run_backend.bat).'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setErrorMessage('');
    setWarningNotice('');
    setNlpMetadata(null);
  };

  const handleSelectExample = (sentence) => {
    setInputText(sentence);
    // Smooth scroll to workspace
    const workspaceEl = document.getElementById('workspace');
    if (workspaceEl) {
      workspaceEl.scrollIntoView({ behavior: 'smooth' });
    }
    // Auto-translate the example sentence
    performTranslation(sentence);
  };

  return (
    <div className="app-layout">
      {/* Navigation Header */}
      <Header 
        onOpenDictionary={() => setIsDictionaryOpen(true)}
        backendStatus={backendStatus}
      />

      <main className="main-content">
        {/* Hero Section */}
        <Hero />

        {/* Translation Workspace */}
        <TranslationWorkspace
          inputText={inputText}
          setInputText={setInputText}
          outputText={outputText}
          isLoading={isLoading}
          errorMessage={errorMessage}
          warningNotice={warningNotice}
          nlpMetadata={nlpMetadata}
          onTranslate={() => performTranslation()}
          onClear={handleClear}
          onSelectExample={handleSelectExample}
        />

        {/* Clickable Example Sentences */}
        <ExampleSentences onSelectExample={handleSelectExample} />

        {/* How It Works NLP Pipeline */}
        <HowItWorks />

        {/* Feature Highlights */}
        <Features />

        {/* About Project & Educational Domain Overview */}
        <AboutProject />
      </main>

      {/* Dictionary Explorer Modal */}
      <DictionaryModal 
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
        dictionaryData={dictionaryData}
        onSelectPhrase={handleSelectExample}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
