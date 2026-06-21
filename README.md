# Resume Screener (MERN + Gemini)

Upload a resume (PDF) and a job description. Gemini scores the match, lists
matched/missing skills, and — the core feature — **points out concrete mistakes
in the resume itself** (weak bullets, missing metrics, formatting issues) with
a reason and a fix for each one. Results are stored in MongoDB Atlas. No login.

```
resume-screener/
├── backend/   Express API, MongoDB Atlas, Gemini calls, PDF parsing
└── frontend/  React + Vite + Tailwind UI
```

## 1. MongoDB Atlas

1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Database Access → add a user with a password.
3. Network Access → add your IP (or `0.0.0.0/0` for local dev).
4. Connect → Drivers → copy the connection string, e.g.
   `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/resume_screener?retryWrites=true&w=majority`

## 2. Gemini API key

1. Go to https://aistudio.google.com/apikey and create a key.
2. Keep it server-side only — it's used by the backend, never the browser.

## 3. Backend

```bash
cd backend
cp .env.example .env
# edit .env: paste your MONGODB_URI and GEMINI_API_KEY
npm install
npm run dev        # nodemon, http://localhost:5000
```

## 4. Frontend

```bash
cd frontend
cp .env.example .env   # defaults to http://localhost:5000/api, edit if needed
npm install
npm run dev         # http://localhost:5173
```

Open http://localhost:5173, upload a PDF resume, paste a job description, and submit.

## How the "explain mistakes" feature works

`backend/services/geminiService.js` sends the resume text + job description to
Gemini with a strict JSON schema (`responseSchema`), so the model can't return
free-form text — every response has a `mistakes` array. Each entry contains:

- `issue` – exactly what's wrong (referencing the resume's actual content)
- `why` – why it hurts the candidate with a recruiter or an ATS
- `fix` – a specific rewrite to apply
- `severity` – `high` / `medium` / `low`

This is separate from the job-match scoring — a resume can score low on
fit for *this* job but still be well written, or vice versa.

## API

| Method | Route                  | Body                                          |
|--------|-------------------------|------------------------------------------------|
| POST   | `/api/screenings`       | `multipart/form-data`: `resume` (PDF), `jobDescription`, `jobTitle` |
| GET    | `/api/screenings`       | —                                              |
| GET    | `/api/screenings/:id`   | —                                              |
| DELETE | `/api/screenings/:id`   | —                                              |

## Notes

- Resumes must be text-based PDFs (not scanned images) — `pdf-parse` needs
  selectable text to extract it.
- Swap the model via `GEMINI_MODEL` in `backend/.env` (defaults to
  `gemini-2.5-flash`; use `gemini-2.5-pro` for deeper analysis at higher cost).
- No authentication, by design — add it before deploying this publicly,
  since anyone with the URL can currently read/delete all stored screenings.
