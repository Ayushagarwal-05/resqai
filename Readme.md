# ✚ ResQAI — AI Emergency Response Assistant

An AI-powered emergency assistant that analyzes situations and returns structured guidance using **Google Gemini**.

---

## 📁 Folder Structure

```
resqai/
├── backend/
│   ├── server.js          ← Express API server
│   ├── package.json
│   └── .env.example       ← Copy to .env and add your key
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── vercel.json        ← For Vercel frontend deploy
├── render.yaml            ← For Render backend deploy
└── README.md
```

---

## ⚙️ Setup Instructions

### Step 1 — Get a Gemini API Key (Free)

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API key"**
4. Copy the key

---

### Step 2 — Set Up the Backend

```bash
# 1. Navigate to backend folder
cd resqai/backend

# 2. Install dependencies
npm install

# 3. Create .env file from example
cp .env.example .env

# 4. Open .env and paste your Gemini key
#    GEMINI_API_KEY=your_key_here
#    PORT=3000
```

---

### Step 3 — Run Locally

**Start the backend:**
```bash
cd backend
npm start
# → Server running at http://localhost:3000
```

**Open the frontend:**
```bash
# Just open frontend/index.html in your browser
# OR use a simple server:
cd frontend
npx serve .
# → Open http://localhost:3000 (or whatever port serve gives)
```

> ⚠️ Make sure `API_BASE` in `script.js` points to `http://localhost:3000`

---

## 🚀 Deploy

### Backend → Render (Free)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Set:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node server.js`
5. Add **Environment Variable**: `GEMINI_API_KEY = your_key`
6. Deploy → Copy your Render URL (e.g. `https://resqai.onrender.com`)

### Frontend → Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your repo → set **Root Directory** to `frontend`
3. Deploy
4. **Update `API_BASE`** in `script.js` to your Render backend URL
5. Redeploy frontend

---

## 🧪 Test the API Directly

```bash
curl -X POST http://localhost:3000/analyze \
  -H "Content-Type: application/json" \
  -d '{"situation": "my friend fainted and is not breathing"}'
```

Expected response:
```json
{
  "emergencyType": "Cardiac Arrest / Unconsciousness",
  "urgencyLevel": "High",
  "steps": [
    "Call emergency services (112/911) immediately",
    "Check if the person is breathing",
    ...
  ]
}
```

---

## 📦 Dependencies

| Package       | Purpose                  |
|---------------|--------------------------|
| express       | HTTP server              |
| cors          | Allow frontend requests  |
| dotenv        | Load .env variables      |
| node-fetch    | Call Gemini API          |
| nodemon (dev) | Auto-restart on changes  |

---

## 💡 Tips

- Press **Ctrl+Enter** inside the textarea to submit quickly
- Use the **example chips** for quick demos
- The AI prompt is in `server.js` — easy to customize