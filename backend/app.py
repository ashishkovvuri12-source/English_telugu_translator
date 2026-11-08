# -*- coding: utf-8 -*-
"""
TeluguTranslate AI - Backend Server
====================================
An English-to-Telugu Rule-Based and Dictionary-Based NLP Translation Engine
specifically designed for the Education Domain.

Key NLP Pipeline Concepts Implemented:
1. Text Normalization: Lowercase conversion, Unicode normalization (NFC), whitespace collapsing.
2. Punctuation Handling: Regex-based extraction and preservation of sentence tone (e.g. ? or !).
3. Dictionary-Based Phrase Matching: Multi-word phrase matching with high precision.
4. Fallback & Guidance Engine: Informs users when a sentence is outside the limited educational domain.
5. Production Ready: Serves API endpoints and optionally serves the built React frontend.
"""

from __future__ import annotations
import os
import re
import sys
import csv
import json
import unicodedata

# Gracefully verify dependencies with beginner-friendly error messages
try:
    from flask import Flask, request, jsonify, send_from_directory
    from flask_cors import CORS
except ImportError as import_err:
    print("\n" + "=" * 65)
    print("ERROR: Required Python dependencies are missing!")
    print(f"Details: {import_err}")
    print("\nTo fix this, please run:")
    print("    pip install flask flask-cors gunicorn")
    print("or:")
    print("    pip install -r requirements.txt")
    print("=" * 65 + "\n")
    sys.exit(1)

# Initialize Flask Application
app = Flask(__name__)

# Enable Cross-Origin Resource Sharing (CORS) to allow requests from the React frontend
CORS(app, resources={r"/*": {"origins": "*"}})

# Path to the built React frontend (if built with npm run build)
FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))

# ==============================================================================
# EDUCATION DOMAIN NLP DICTIONARY (60+ Curated Phrases)
# Categorized into: Greetings, Students & Faculty, Facilities, Exams, Classes & Learning
# ==============================================================================
EDUCATION_DICTIONARY = {
    # 1. Greetings & Polite Educational Interactions
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
    "welcome to our college": "మా కళాశాలకు స్వాగతం",
    "welcome to our school": "మా పాఠశాలకు స్వాగతం",

    # 2. Student & Teacher Roles
    "i am a student": "నేను విద్యార్థిని",
    "i am a teacher": "నేను ఉపాధ్యాయుడిని",
    "she is a teacher": "ఆమె ఉపాధ్యాయురాలు",
    "he is a teacher": "అతను ఉపాధ్యాయుడు",
    "he is a professor": "అతను ప్రొఫెసర్",
    "she is a professor": "ఆమె ప్రొఫెసర్",
    "we are students": "మేము విద్యార్థులము",
    "who is your teacher": "మీ ఉపాధ్యాయుడు ఎవరు?",
    "who is the principal": "ప్రిన్సిపాల్ ఎవరు?",
    "who is the class representative": "తరగతి ప్రతినిధి ఎవరు?",

    # 3. Campus, Facilities & Places
    "this is my school": "ఇది నా పాఠశాల",
    "this is my college": "ఇది నా కళాశాల",
    "where is the library": "లైబ్రరీ ఎక్కడ ఉంది?",
    "where is the classroom": "తరగతి గది ఎక్కడ ఉంది?",
    "where is the laboratory": "ప్రయోగశాల ఎక్కడ ఉంది?",
    "where is the computer lab": "కంప్యూటర్ ల్యాబ్ ఎక్కడ ఉంది?",
    "where is the principal's office": "ప్రిన్సిపాల్ కార్యాలయం ఎక్కడ ఉంది?",
    "where is the canteen": "క్యాంటీన్ ఎక్కడ ఉంది?",
    "the library is open": "లైబ్రరీ తెరిచి ఉంది",
    "the library is closed": "లైబ్రరీ మూసివేయబడింది",
    "this is our playground": "ఇది మా ఆట స్థలం",

    # 4. Examinations, Marks & Results
    "when is the exam": "పరీక్ష ఎప్పుడు?",
    "what is the syllabus": "సిలబస్ ఏమిటి?",
    "did you pass the exam": "మీరు పరీక్షలో ఉత్తీర్ణులయ్యారా?",
    "when are the results": "ఫలితాలు ఎప్పుడు?",
    "the exam is difficult": "పరీక్ష కష్టంగా ఉంది",
    "the exam is easy": "పరీక్ష సులభంగా ఉంది",
    "hall ticket is required": "హాల్ టికెట్ అవసరం",
    "study well for the exam": "పరీక్ష కోసం బాగా చదవండి",
    "tomorrow is an exam": "రేపు పరీక్ష ఉంది",
    "what are your marks": "మీ మార్కులు ఎంత?",
    "prepare for the test": "పరీక్షకు సిద్ధం కావాలి",

    # 5. Classes, Attendance & Timetable
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
    "class is dismissed": "తరగతి ముగిసింది",

    # 6. Books, Homework & Learning
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
    "what is your favorite subject": "మీకు ఇష్టమైన సబ్జెక్ట్ ఏమిటి?",
    "education is important": "విద్య చాలా ముఖ్యమైనది",
    "knowledge is power": "జ్ఞానమే మహాబలం",
    "practice makes perfect": "సాధన చేయడం వల్ల నైపుణ్యం వస్తుంది",

    # 7. Common Academic Words & Single Vocabulary Lookups
    "student": "విద్యార్థి",
    "students": "విద్యార్థులు",
    "teacher": "ఉపాధ్యాయుడు",
    "teachers": "ఉపాధ్యాయులు",
    "professor": "ప్రొఫెసర్",
    "principal": "ప్రిన్సిపాల్",
    "school": "పాఠశాల",
    "schools": "పాఠశాలలు",
    "college": "కళాశాల",
    "colleges": "కళాశాలలు",
    "university": "విశ్వవిద్యాలయం",
    "classroom": "తరగతి గది",
    "classrooms": "తరగతి గదులు",
    "class": "తరగతి",
    "classes": "తరగతులు",
    "library": "లైబ్రరీ",
    "laboratory": "ప్రయోగశాల",
    "lab": "ల్యాబ్",
    "canteen": "క్యాంటీన్",
    "playground": "ఆట స్థలం",
    "hostel": "హాస్టల్",
    "exam": "పరీక్ష",
    "exams": "పరీక్షలు",
    "examination": "పరీక్ష",
    "test": "పరీక్ష",
    "tests": "పరీక్షలు",
    "quiz": "క్విజ్",
    "result": "ఫలితం",
    "results": "ఫలితాలు",
    "mark": "మార్కు",
    "marks": "మార్కులు",
    "grade": "గ్రేడ్",
    "pass": "పాస్ (ఉత్తీర్ణత)",
    "fail": "ఫెయిల్ (విఫలం)",
    "book": "పుస్తకం",
    "books": "పుస్తకాలు",
    "textbook": "పాఠ్యపుస్తకం",
    "notebook": "నోట్‌బుక్",
    "pen": "పెన్ (కలం)",
    "pencil": "పెన్సిల్",
    "bag": "సంచి (స్కూల్ బ్యాగ్)",
    "paper": "కాగితం",
    "question": "ప్రశ్న",
    "questions": "ప్రశ్నలు",
    "answer": "సమాధానం",
    "answers": "సమాధానాలు",
    "homework": "హోంవర్క్",
    "assignment": "అసైన్‌మెంట్",
    "syllabus": "సిలబస్",
    "timetable": "సమయ పట్టిక",
    "attendance": "హాజరు",
    "holiday": "సెలవు",
    "holidays": "సెలవులు",
    "lesson": "పాఠం",
    "chapter": "అధ్యాయం",
    "subject": "విషయం (సబ్జెక్ట్)",
    "education": "విద్య",
    "knowledge": "జ్ఞానం",
    "fee": "ఫీజు",
    "fees": "ఫీజులు",
    "scholarship": "స్కాలర్‌షిప్",
    "hall ticket": "హాల్ టికెట్",
    "friend": "స్నేహితుడు",
    "friends": "స్నేహితులు",
    "parent": "తల్లిదండ్రులు",
    "boy": "అబ్బాయి",
    "girl": "అమ్మాయి",
    "mathematics": "గణితం",
    "maths": "గణితం",
    "science": "సైన్స్",
    "english": "ఇంగ్లీష్",
    "telugu": "తెలుగు",
    "hindi": "హిందీ",
    "computer": "కంప్యూటర్",
    "reading": "చదవడం",
    "writing": "రాయడం",
    "learning": "నేర్చుకోవడం",
    "studying": "చదువుకోవడం",
    "teaching": "బోధన"
}

# Example sentences for quick user testing in UI
EXAMPLE_SENTENCES = [
    {"english": "Hello", "telugu": "నమస్కారం"},
    {"english": "I am a student", "telugu": "నేను విద్యార్థిని"},
    {"english": "Where is the library?", "telugu": "లైబ్రరీ ఎక్కడ ఉంది?"},
    {"english": "Please explain this", "telugu": "దయచేసి దీనిని వివరించండి"},
    {"english": "When is the exam?", "telugu": "పరీక్ష ఎప్పుడు?"},
    {"english": "Thank you", "telugu": "ధన్యవాదాలు"}
]

# ==============================================================================
# NLP PREPROCESSING & TRANSLATION FUNCTIONS
# ==============================================================================

def normalize_text(text: str) -> str:
    """
    NLP Step 1: Text Normalization
    - Performs Unicode Normalization (NFC)
    - Converts text to lowercase
    - Normalizes internal whitespaces to a single space
    """
    if not text:
        return ""
    text = unicodedata.normalize('NFC', text)
    text = text.lower()
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def clean_punctuation(text: str) -> tuple:
    """
    NLP Step 2: Punctuation Handling
    - Strips surrounding punctuation marks (. , ! ? ; :)
    - Retains ending question mark or exclamation mark to mirror sentence intent
    """
    ending_char = ""
    if text.endswith("?"):
        ending_char = "?"
    elif text.endswith("!"):
        ending_char = "!"

    cleaned = re.sub(r'^[^\w]+|[^\w]+$', '', text)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned, ending_char


# ==============================================================================
# EXTERNAL DATASET LOADER (dataset.csv / dataset.json)
# ==============================================================================
DATASET_CSV_PATH = os.path.join(os.path.dirname(__file__), "dataset.csv")
DATASET_JSON_PATH = os.path.join(os.path.dirname(__file__), "dataset.json")

def load_external_datasets():
    """Automatically loads additional phrases from dataset.csv or dataset.json if present."""
    count = 0
    if os.path.exists(DATASET_CSV_PATH):
        try:
            with open(DATASET_CSV_PATH, mode="r", encoding="utf-8-sig") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    eng = row.get("English") or row.get("english") or ""
                    tel = row.get("Telugu") or row.get("telugu") or ""
                    if not eng:
                        # Fallback case-insensitive key search
                        for k, v in row.items():
                            if k and k.strip().lower() == "english":
                                eng = v
                            elif k and k.strip().lower() == "telugu":
                                tel = v
                    if eng and tel:
                        clean_eng, _ = clean_punctuation(normalize_text(eng))
                        if clean_eng:
                            EDUCATION_DICTIONARY[clean_eng] = tel.strip()
                            count += 1
            if count > 0:
                print(f"[Dataset] Successfully loaded {count} additional phrases from dataset.csv")
        except Exception as e:
            print(f"[Dataset] Note: Could not read dataset.csv ({e})")

    if os.path.exists(DATASET_JSON_PATH):
        try:
            with open(DATASET_JSON_PATH, mode="r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, dict):
                    for eng, tel in data.items():
                        clean_eng, _ = clean_punctuation(normalize_text(eng))
                        EDUCATION_DICTIONARY[clean_eng] = str(tel).strip()
        except Exception as e:
            print(f"[Dataset] Note: Could not read dataset.json ({e})")

# Load external dataset immediately
load_external_datasets()


def translate_sentence(input_text: str) -> dict:
    """
    Core NLP Translation Pipeline:
    1. Normalization
    2. Punctuation processing
    3. Dictionary lookup with exact & phrase matching
    4. Telugu Unicode generation or informative domain fallback
    """
    normalized = normalize_text(input_text)
    if not normalized:
        return {
            "status": "error",
            "error": "Empty input provided",
            "translation": ""
        }

    cleaned_key, punctuation_tone = clean_punctuation(normalized)

    # 1. Exact Match in our educational lexicon
    if cleaned_key in EDUCATION_DICTIONARY:
        telugu_result = EDUCATION_DICTIONARY[cleaned_key]
        return {
            "status": "success",
            "translation": telugu_result,
            "normalized_query": cleaned_key,
            "matched_type": "exact_phrase",
            "domain": "Education"
        }

    # 2. Check if removing leading articles ('a ', 'an ', 'the ') produces a match
    without_articles = re.sub(r'^(a|an|the)\s+', '', cleaned_key).strip()
    if without_articles in EDUCATION_DICTIONARY:
        telugu_result = EDUCATION_DICTIONARY[without_articles]
        prefix = "ఒక " if cleaned_key.startswith(("a ", "an ")) else ""
        return {
            "status": "success",
            "translation": f"{prefix}{telugu_result}".strip(),
            "normalized_query": cleaned_key,
            "matched_type": "article_stripped_match",
            "domain": "Education"
        }

    # 3. Word-by-Word / Token Matching Fallback
    tokens = cleaned_key.split()
    if len(tokens) > 1:
        translated_tokens = []
        matched_count = 0
        common_words = {
            "my": "నా",
            "your": "మీ",
            "our": "మా",
            "his": "అతని",
            "her": "ఆమె",
            "their": "వారి",
            "good": "మంచి",
            "bad": "చెడు",
            "new": "కొత్త",
            "old": "పాత",
            "big": "పెద్ద",
            "small": "చిన్న",
            "and": "మరియు"
        }
        for token in tokens:
            if token in EDUCATION_DICTIONARY:
                translated_tokens.append(EDUCATION_DICTIONARY[token])
                matched_count += 1
            elif token in common_words:
                translated_tokens.append(common_words[token])
                matched_count += 1
            elif token in ["a", "an"]:
                translated_tokens.append("ఒక")
            elif token in ["the", "is", "are"]:
                continue
            else:
                translated_tokens.append(token)

        if matched_count >= len(tokens) // 2 and matched_count > 0:
            telugu_result = " ".join(translated_tokens)
            if punctuation_tone:
                telugu_result += punctuation_tone
            return {
                "status": "success",
                "translation": telugu_result,
                "normalized_query": cleaned_key,
                "matched_type": "token_based_match",
                "domain": "Education"
            }

    # Fallback & Domain Boundary Handling
    suggested_phrases = [
        "Where is the library?",
        "When is the exam?",
        "I am a student",
        "Please explain this",
        "Attendance is compulsory",
        "What is the syllabus?"
    ]

    return {
        "status": "unsupported",
        "translation": "క్షమించండి! ఈ వాక్యం విద్యా నిఘంటువులో అందుబాటులో లేదు.",
        "message": (
            "This sentence was not found in our educational dictionary. "
            "TeluguTranslate AI is a rule-based NLP system specialized for academic phrases "
            "(e.g., library, classroom, exams, homework, students, teachers)."
        ),
        "suggestions": suggested_phrases,
        "normalized_query": cleaned_key,
        "matched_type": "none",
        "domain": "Education"
    }


# ==============================================================================
# REST API ENDPOINTS
# ==============================================================================

@app.route("/health", methods=["GET"])
@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint for local & online hosting services (Render, Railway, etc.)."""
    return jsonify({
        "status": "online",
        "project": "TeluguTranslate AI",
        "domain": "Education NLP",
        "version": "1.0.0",
        "phrases_count": len(EDUCATION_DICTIONARY)
    }), 200


@app.route("/translate", methods=["POST"])
@app.route("/api/translate", methods=["POST"])
def translate():
    """
    Primary Translation Endpoint.
    Expects JSON: {"text": "I am a student"}
    Returns JSON: {"translation": "నేను విద్యార్థిని", "status": "success"}
    """
    if not request.is_json:
        return jsonify({
            "status": "error",
            "error": "Request body must be valid JSON with 'text' field."
        }), 400

    data = request.get_json(silent=True)
    if not data or "text" not in data:
        return jsonify({
            "status": "error",
            "error": "Missing 'text' field in JSON request."
        }), 400

    raw_text = data.get("text", "")

    # Empty Input Validation
    if not isinstance(raw_text, str) or not raw_text.strip():
        return jsonify({
            "status": "error",
            "error": "Please enter an English sentence to translate."
        }), 400

    # NLP Processing
    try:
        result = translate_sentence(raw_text)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": f"An error occurred during translation processing: {str(e)}"
        }), 500


@app.route("/examples", methods=["GET"])
@app.route("/api/examples", methods=["GET"])
def get_examples():
    """Returns curated example sentences for the frontend UI."""
    return jsonify({
        "status": "success",
        "examples": EXAMPLE_SENTENCES
    })


@app.route("/dictionary", methods=["GET"])
@app.route("/api/dictionary", methods=["GET"])
def get_dictionary():
    """Returns all supported educational phrases."""
    return jsonify({
        "status": "success",
        "count": len(EDUCATION_DICTIONARY),
        "dictionary": EDUCATION_DICTIONARY
    })


# ==============================================================================
# FRONTEND STATIC ASSET SERVING (FOR DEPLOYMENT / UNIFIED APP)
# ==============================================================================

@app.route("/", defaults={"path": ""}, methods=["GET"])
@app.route("/<path:path>", methods=["GET"])
def serve_frontend(path):
    """
    Serves the React frontend if built at frontend/dist,
    otherwise provides an API welcome JSON on root.
    """
    # Exclude API endpoints from frontend catch-all
    if path in ["translate", "health", "dictionary", "examples"] or path.startswith("api/"):
        return jsonify({"error": "Endpoint not found"}), 404

    # If the production build exists, serve static assets or index.html
    if os.path.exists(FRONTEND_DIST):
        target_path = os.path.join(FRONTEND_DIST, path)
        if path and os.path.exists(target_path) and os.path.isfile(target_path):
            return send_from_directory(FRONTEND_DIST, path)
        
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_file):
            return send_from_directory(FRONTEND_DIST, "index.html")

    # If frontend is not compiled yet, return API info
    if path == "":
        return jsonify({
            "project": "TeluguTranslate AI",
            "domain": "Education NLP Translation System",
            "version": "1.0.0",
            "status": "online",
            "total_phrases": len(EDUCATION_DICTIONARY),
            "endpoints": {
                "POST /translate": "Translate an English sentence into Telugu",
                "GET /health": "Server health status",
                "GET /examples": "Curated educational example sentences",
                "GET /dictionary": "Educational phrase dictionary"
            },
            "note": "Frontend is running separately via Vite on http://localhost:5173"
        })

    return jsonify({"error": "Resource not found"}), 404


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print("=" * 60)
    print("TeluguTranslate AI Backend is running!")
    print(f"Loaded {len(EDUCATION_DICTIONARY)} educational phrases in NLP dictionary.")
    print(f"Serving on http://127.0.0.1:{port}")
    print("=" * 60)
    app.run(host="0.0.0.0", port=port, debug=True)
