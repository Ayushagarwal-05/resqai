const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

app.post("/analyze", async (req, res) => {
  const { situation } = req.body;

  if (!situation || situation.trim() === "") {
    return res.status(400).json({ error: "Please describe the emergency situation." });
  }

  const prompt = `You are an emergency response AI assistant. Analyze the following emergency situation and respond ONLY in this exact format with no extra text:

EMERGENCY_TYPE: [one short label, e.g. Cardiac Arrest, Fire, Choking, Seizure, etc.]
URGENCY_LEVEL: [High / Medium / Low]
IMMEDIATE_STEPS:
1. [First action]
2. [Second action]
3. [Third action]
4. [Fourth action]
5. [Fifth action]

Emergency situation: "${situation}"

Rules:
- Be concise and clear
- Steps must be actionable and practical
- Always recommend calling emergency services if life-threatening
- Do NOT add any text outside the format above`;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY not set in environment." });
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 512 },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res.status(502).json({ error: data.error?.message || "Gemini API error." });
    }

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const parsed = parseResponse(rawText);

    res.json(parsed);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
});

function parseResponse(text) {
  const lines = text.trim().split("\n");
  let emergencyType = "";
  let urgencyLevel = "";
  let steps = [];
  let inSteps = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("EMERGENCY_TYPE:")) {
      emergencyType = trimmed.replace("EMERGENCY_TYPE:", "").trim();
    } else if (trimmed.startsWith("URGENCY_LEVEL:")) {
      urgencyLevel = trimmed.replace("URGENCY_LEVEL:", "").trim();
    } else if (trimmed.startsWith("IMMEDIATE_STEPS:")) {
      inSteps = true;
    } else if (inSteps && /^\d+\./.test(trimmed)) {
      steps.push(trimmed.replace(/^\d+\.\s*/, ""));
    }
  }

  return { emergencyType, urgencyLevel, steps, raw: text };
}

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`ResQAI backend running on http://localhost:${PORT}`));