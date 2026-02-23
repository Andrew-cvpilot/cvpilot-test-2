# ResumeIQ — AI Resume Evaluator

An AI-powered resume evaluation tool that gives students and job seekers specific, actionable feedback in seconds.

---

## Project Structure

```
resume-ai/
├── backend/          # Flask API
│   ├── app.py
│   ├── requirements.txt
│   ├── Procfile
│   └── .env.example
├── frontend/         # React app
│   ├── src/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## Local Development

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/resume-ai.git
cd resume-ai
```

### 2. Backend setup
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

python app.py
# Runs on http://localhost:5000
```

### 3. Frontend setup
```bash
cd frontend
npm install

cp .env.example .env
# .env already points to http://localhost:5000 for local dev

npm start
# Runs on http://localhost:3000
```

---

## Deployment

### Backend → Railway (recommended, free tier available)

1. Go to [railway.app](https://railway.app) and create a new project
2. Connect your GitHub repo and select the `backend` folder as the root
3. Add environment variable: `ANTHROPIC_API_KEY=your_key_here`
4. Railway auto-detects the Procfile and deploys
5. Copy your Railway backend URL (e.g. `https://resume-ai-backend.up.railway.app`)

**Alternative backends:** Render.com, Heroku, Fly.io — all support the same Procfile format.

### Frontend → Vercel (recommended, free)

1. Go to [vercel.com](https://vercel.com) and import your GitHub repo
2. Set the **Root Directory** to `frontend`
3. Add environment variable: `REACT_APP_API_URL=https://your-railway-url.up.railway.app`
4. Deploy — Vercel builds and hosts automatically

**Alternative frontends:** Netlify, GitHub Pages (requires build step).

---

## Environment Variables

| Variable | Where | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Backend | Your Anthropic API key from console.anthropic.com |
| `REACT_APP_API_URL` | Frontend | Full URL of your deployed backend |

---

## Customization

- **Change the AI model:** Edit `model=` in `backend/app.py` — swap to `claude-haiku-4-5-20251001` for faster/cheaper evaluations
- **Adjust the prompt:** The prompt in `evaluate_resume()` controls feedback quality — this is the highest-leverage thing to tweak
- **Branding:** Update the logo name and colors (CSS variables at the top of `frontend/src/App.js`)

---

## Tech Stack

- **Backend:** Python, Flask, Anthropic SDK, pdfplumber, python-docx
- **Frontend:** React, vanilla CSS
- **AI:** Claude (Anthropic)
