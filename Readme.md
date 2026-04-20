# 🚑 ResQAI — AI Emergency Response Assistant

An AI-powered emergency response assistant that analyzes real-life situations and provides structured, actionable guidance using Google Gemini.

---

## 🌐 Live Demo

* **Frontend:** https://resqai-7k8b.vercel.app
* **Backend API:** https://resqai-x50x.onrender.com

---

## ✨ Features

* 🧠 AI-powered emergency analysis (Gemini API)
* ⚡ Instant response with structured steps
* 🚨 Detects urgency level and emergency type
* 🌍 Fully deployed (Vercel + Render)
* 💻 Clean and simple UI for quick interaction

---

## 🛠️ Tech Stack

**Frontend**

* HTML, CSS, JavaScript

**Backend**

* Node.js
* Express.js

**AI Integration**

* Google Gemini API

**Deployment**

* Vercel (Frontend)
* Render (Backend)

---

## 📁 Project Structure

```
resqai/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
├── README.md
```

---

## 🚀 Getting Started (Local Setup)

### 1. Clone the repository

```bash
git clone https://github.com/Ayushagarwal-05/resqai.git
cd resqai
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```
GEMINI_API_KEY=your_api_key_here
PORT=3000
```

Run server:

```bash
npm start
```

---

### 3. Run Frontend

Open:

```
frontend/index.html
```

Or run a local server:

```bash
cd frontend
npx serve .
```

---

## 🔌 API Usage

### Endpoint

```
POST /analyze
```

### Request

```json
{
  "situation": "my friend fainted and is not breathing"
}
```

### Response

```json
{
  "emergencyType": "Cardiac Arrest / Unconsciousness",
  "urgencyLevel": "High",
  "steps": [
    "Call emergency services immediately",
    "Check if the person is breathing"
  ]
}
```

---

## ⚙️ Environment Variables

| Variable       | Description                 |
| -------------- | --------------------------- |
| GEMINI_API_KEY | Your Google Gemini API key  |
| PORT           | Server port (default: 3000) |

---

## 🚀 Deployment

### Backend (Render)

* Node service using `server.js`
* Environment variable: `GEMINI_API_KEY`

### Frontend (Vercel)

* Root directory: `frontend`
* Static site deployment

---

## 🔐 Security Note

* API keys are stored securely using environment variables
* Never expose keys in frontend code or public repositories

---

## 📌 Future Improvements

* 🔐 User authentication
* 💾 Save emergency history
* 🎤 Voice input support
* 📱 Mobile UI optimization

---

## 🤝 Contributing

Feel free to fork the repo and submit pull requests!

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 🙌 Acknowledgements

* Google Gemini API
* Render & Vercel for free hosting

---
