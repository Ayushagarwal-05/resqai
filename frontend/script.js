// ── Config ────────────────────────────────────────────
const API_BASE = "http://localhost:3000";

// ── DOM refs ──────────────────────────────────────────
const situationInput = document.getElementById("situation");
const analyzeBtn     = document.getElementById("analyzeBtn");
const spinner        = document.getElementById("spinner");
const btnText        = document.querySelector(".btn-text");
const outputSection  = document.getElementById("outputSection");
const errorBox       = document.getElementById("errorBox");
const errorMsg       = document.getElementById("errorMsg");
const charCount      = document.getElementById("charCount");

// ── State ─────────────────────────────────────────────
let currentLocation  = null;
let currentEmergency = "";

// ── Char counter ──────────────────────────────────────
situationInput.addEventListener("input", () => {
  charCount.textContent = `${situationInput.value.length} / 500`;
});

// ── Example chips ─────────────────────────────────────
function fillExample(text) {
  situationInput.value = text;
  charCount.textContent = `${text.length} / 500`;
  situationInput.focus();
}

// ── Main analyze ──────────────────────────────────────
async function analyzeEmergency() {
  const situation = situationInput.value.trim();
  if (!situation) { showError("Please describe the emergency situation first."); return; }

  currentEmergency = situation;
  setLoading(true);
  hideError();
  hideOutput();

  try {
    const response = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ situation }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Something went wrong.");
    renderOutput(data);
  } catch (err) {
    showError(err.message || "Could not reach the server. Is the backend running?");
  } finally {
    setLoading(false);
  }
}

// ── Render output ─────────────────────────────────────
function renderOutput({ emergencyType, urgencyLevel, steps }) {
  const levelKey = urgencyLevel?.toLowerCase().includes("high")
    ? "high" : urgencyLevel?.toLowerCase().includes("medium")
    ? "medium" : "low";

  const badge = document.getElementById("urgencyBadge");
  badge.textContent = urgencyLevel || "—";
  badge.className = `urgency-badge ${levelKey}`;

  document.getElementById("emergencyType").textContent = emergencyType || "Unknown";

  const urgEl = document.getElementById("urgencyLevel");
  urgEl.textContent = urgencyLevel || "—";
  urgEl.className = `card-value urgency-value ${levelKey}`;

  const list = document.getElementById("stepsList");
  list.innerHTML = "";
  (steps || []).forEach((step) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = step;
    li.appendChild(span);
    list.appendChild(li);
  });

  outputSection.style.display = "block";
  outputSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── Location sharing ──────────────────────────────────
function shareLocation() {
  const statusEl = document.getElementById("locationStatus");
  const box      = document.getElementById("locationBox");

  if (!navigator.geolocation) {
    statusEl.textContent = "Not supported";
    return;
  }

  statusEl.textContent = "Getting GPS...";

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude.toFixed(6);
      const lng = pos.coords.longitude.toFixed(6);
      currentLocation = { lat, lng };

      statusEl.textContent = "Location ready ✓";

      document.getElementById("locationCoords").textContent = `${lat}, ${lng}`;
      document.getElementById("locationLink").href =
        `https://www.google.com/maps?q=${lat},${lng}`;

      box.style.display = "flex";
    },
    (err) => {
      statusEl.textContent = "Permission denied";
    },
    { timeout: 8000 }
  );
}

function copyLocation() {
  if (!currentLocation) return;
  const text = `${currentLocation.lat}, ${currentLocation.lng}`;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector(".location-copy");
    btn.textContent = "✓";
    setTimeout(() => (btn.textContent = "📋"), 1500);
  });
}

// ── Alert contact (SOS email) ─────────────────────────
function alertContact() {
  const locText = currentLocation
    ? `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`
    : "Location not available";

  const subject = encodeURIComponent("🚨 SOS EMERGENCY ALERT from ResQAI");
  const body = encodeURIComponent(
`EMERGENCY ALERT

Someone needs help!

Emergency: ${currentEmergency || "Emergency reported"}
Location: ${locText}
Time: ${new Date().toLocaleString()}

This alert was sent via ResQAI Emergency Response App.
Please respond immediately or call emergency services: 112 / 108`
  );

  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

// ── Helpers ───────────────────────────────────────────
function setLoading(isLoading) {
  analyzeBtn.disabled = isLoading;
  spinner.style.display = isLoading ? "inline" : "none";
  btnText.textContent = isLoading ? "ANALYZING..." : "ANALYZE EMERGENCY";
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorBox.style.display = "flex";
}
function hideError()  { errorBox.style.display = "none"; }
function hideOutput() { outputSection.style.display = "none"; }

// ── Ctrl+Enter shortcut ───────────────────────────────
situationInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.ctrlKey) analyzeEmergency();
});