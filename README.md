# TeluguTranslate AI - English to Telugu Education NLP Translation Website

**TeluguTranslate AI** is a complete, modern web application for translating English to Telugu in the limited domain of **Education** (schools, colleges, exams, classrooms, students, and teachers).

The system uses **Rule-Based Machine Translation (RBMT)** and an in-memory **NLP Dictionary** with 60+ curated educational phrases, returning authentic Unicode Telugu script without calling expensive external APIs or simulating fake responses.

---

## 1. Quick Start: How to Open the Website Locally in Your Browser

You have 3 easy ways to run and open the website on Windows:

### Option 1: 1-Click All-in-One Launcher (Fastest)
Double-click [`start_website.bat`](file:///c:/Users/ashis/OneDrive/Desktop/projectnlp/telugu-translate-ai/start_website.bat).
- It will immediately open the complete website in your default browser (Chrome, Edge, Firefox).
- It will automatically launch the **Flask Backend** (port 5000) and **React Vite Frontend** (port 5173) in separate command windows.

### Option 2: Instant Browser View (Zero Setup)
Double-click [`open_website.html`](file:///c:/Users/ashis/OneDrive/Desktop/projectnlp/telugu-translate-ai/open_website.html) directly in your file explorer.
- It opens the exact same modern UI in your browser immediately.
- Connects automatically to the Python Flask backend on `http://127.0.0.1:5000` when running.

### Option 3: Standard Developer Mode in VS Code
Open two terminal tabs in VS Code (**Terminal > New Terminal**):

**Tab 1 (Flask Backend):**
```powershell
cd backend
pip install -r requirements.txt
python app.py
```
*Backend runs on: `http://127.0.0.1:5000`*

**Tab 2 (React Frontend):**
```powershell
cd frontend
npm install
npm run dev -- --open
```
*Frontend opens automatically in your browser at: `http://localhost:5173`*

---

## 2. Project Architecture & Directory Layout

```
telugu-translate-ai/
  ├── backend/
  │     ├── app.py              # Flask REST API, NLP pipeline, 60+ phrases, static serving
  │     ├── requirements.txt    # Flask, flask-cors, gunicorn
  │     ├── Procfile            # Cloud WSGI process config for Render / Heroku / Railway
  │     └── test_nlp.py         # Automated unit test suite
  ├── frontend/
  │     ├── src/
  │     │    ├── components/
  │     │    │     ├── Header.jsx               # Navigation bar & API status indicator
  │     │    │     ├── Hero.jsx                 # Hero section & domain badge
  │     │    │     ├── TranslationWorkspace.jsx # Dual-pane English/Telugu workspace
  │     │    │     ├── ExampleSentences.jsx     # 6 Clickable academic examples
  │     │    │     ├── HowItWorks.jsx           # 3-step NLP pipeline visualizer
  │     │    │     ├── Features.jsx             # Key project capabilities
  │     │    │     ├── AboutProject.jsx         # NLP linguistics & domain scope
  │     │    │     ├── DictionaryModal.jsx      # Interactive 60+ phrase browser
  │     │    │     └── Footer.jsx               # Project footer & metadata
  │     │    ├── App.jsx                        # State & dynamic API URL connector
  │     │    ├── App.css                        # Modern CSS3 responsive design
  │     │    └── main.jsx                       # Vite entry point
  │     ├── index.html          # HTML5 template with Google Fonts & SEO
  │     ├── vite.config.js      # Vite build configuration with API proxy
  │     ├── vercel.json         # 1-click Vercel deployment configuration
  │     └── package.json        # Frontend scripts & React dependencies
  ├── open_website.html         # Instant browser preview
  ├── render.yaml               # 1-click Render blueprint deployment config
  ├── run_backend.bat           # 1-click Windows launcher for Flask Backend
  ├── run_frontend.bat          # 1-click Windows launcher for React Frontend
  ├── start_website.bat         # 1-click Master launcher for full website
  └── README.md                 # Complete documentation & test suite
```

---

## 3. How to Publish the Website Online (Public URL)

You can deploy the website to the cloud for free so anyone in the world can access it via a public URL (e.g. `https://your-telugu-translate.vercel.app` or `https://your-app.onrender.com`).

Here are the two simplest methods for beginners:

### Method A: Deploy Frontend on Vercel + Backend on Render (Recommended & 100% Free)

#### Step 1: Upload Your Project to GitHub
1. Create a free account at [GitHub.com](https://github.com).
2. Create a new repository named `telugu-translate-ai`.
3. In VS Code, push your project folder to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of TeluguTranslate AI"
   git branch -M main
   git remote add origin https://github.com/<your-username>/telugu-translate-ai.git
   git push -u origin main
   ```

#### Step 2: Deploy the Flask Backend on Render (Free)
1. Go to [Render.com](https://render.com) and sign up with your GitHub account.
2. Click **New +** > **Web Service**.
3. Select your `telugu-translate-ai` repository.
4. Set the following settings:
   - **Name**: `telugu-translate-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
5. Click **Deploy Web Service**.
6. When deployment finishes, copy your public backend URL (e.g. `https://telugu-translate-api.onrender.com`).

#### Step 3: Deploy the React Frontend on Vercel (Free)
1. Go to [Vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New...** > **Project** and import your `telugu-translate-ai` repository.
3. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click edit and choose `frontend`.
   - **Environment Variables**:
     - Key: `VITE_API_URL`
     - Value: Paste your Render backend URL (e.g. `https://telugu-translate-api.onrender.com`)
4. Click **Deploy**.
5. In ~45 seconds, Vercel gives you your live public website URL (e.g. `https://telugu-translate-ai.vercel.app`)!

---

### Method B: Single All-in-One Deployment on Render
Using the included [`render.yaml`](file:///c:/Users/ashis/OneDrive/Desktop/projectnlp/telugu-translate-ai/render.yaml) file, Render can automatically deploy both the backend service and the frontend static site with one click:
1. Connect your GitHub repository to Render as a **Blueprint**.
2. Render reads `render.yaml` and links the backend URL to the frontend environment variables automatically.

---

## 4. NLP Architecture & Methodology

### 1. Linguistic Background
- **English**: Follows a **Subject-Verb-Object (SVO)** structure (e.g., *"I am a student"*).
- **Telugu**: Follows a **Subject-Object-Verb (SOV)** structure (e.g., *"నేను విద్యార్థిని"*).
- **Phonetics**: Telugu is an *Ajanta Bhasha* where native words end in vowel sounds.

### 2. The 3-Step NLP Pipeline
1. **Text Normalization**: Unicode NFC normalization, lowercase conversion, and whitespace collapsing.
2. **Punctuation Handling**: Surrounding non-alphanumeric characters are stripped while preserving sentence tone (questions `?` or statements).
3. **Dictionary & Phrase Matching**: Searches against 60+ verified educational phrases with exact match and multi-word phrase substitution.
4. **Fallback Mechanism**: For out-of-domain sentences, returns an informative Telugu notice and suggests relevant academic phrases.

---

## 5. Verified Test Sentences

| # | Input Sentence | Telugu Output | Category | Status |
|---|----------------|---------------|----------|--------|
| 1 | `Hello` | **నమస్కారం** | Greeting | Verified |
| 2 | `I am a student` | **నేను విద్యార్థిని** | Student Role | Verified |
| 3 | `Where is the library?` | **లైబ్రరీ ఎక్కడ ఉంది?** | Campus Facility | Verified |
| 4 | `Please explain this` | **దయచేసి దీనిని వివరించండి** | Classroom Assistance | Verified |
| 5 | `When is the exam?` | **పరీక్ష ఎప్పుడు?** | Examination | Verified |
| 6 | `Thank you` | **ధన్యవాదాలు** | Courtesy | Verified |
| 7 | `This is my college` | **ఇది నా కళాశాల** | Campus | Verified |
| 8 | `What is the syllabus?` | **సిలబస్ ఏమిటి?** | Examination | Verified |
| 9 | `Attendance is compulsory` | **హాజరు తప్పనిసరి** | Academic Rules | Verified |
| 10 | `I want a book` | **నాకు ఒక పుస్తకం కావాలి** | Library / Books | Verified |
| 11 | `Where is the classroom?` | **తరగతి గది ఎక్కడ ఉంది?** | Campus Facility | Verified |
| 12 | `May I come in?` | **నేను లోపలికి రావచ్చా?** | Etiquette | Verified |

---

## 6. REST API Endpoints

- `POST /translate` or `/api/translate`: Accepts `{"text": "Where is the library?"}` and returns Telugu translation JSON.
- `GET /health` or `/api/health`: Health status check for monitoring.
- `GET /dictionary` or `/api/dictionary`: Returns all 60+ educational phrases.
- `GET /examples` or `/api/examples`: Returns popular example sentences.
