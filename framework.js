/**
 * Cognizant CRM Solutions — app.js
 * Genesys Cloud Embeddable Framework + CRM UI logic
 *
 * ──────────────────────────────────────────────────────────────
 *  CONFIGURATION  ←  Replace these values with your own
 * ──────────────────────────────────────────────────────────────
 */
const GENESYS_CONFIG = {
  clientId:    "226182a8-bb53-435b-bc3c-2140f077768f",          // OAuth Client ID from Genesys Admin
  region:      "usw2.pure.cloud",                 // e.g. mypurecloud.com / mypurecloud.ie / usw2.pure.cloud
  redirectUri: "https://apps.usw2.pure.cloud/crm/embeddableFramework.html",  // Must match the redirect URI registered in Genesys Admin
  // redirectUri is used only when using Implicit/Token-based OAuth via the Embeddable Framework
};

/* ─────────────────────────────────────────────────────────────
   DOM REFS
───────────────────────────────────────────────────────────── */
const softphonePanel    = document.getElementById("softphone-panel");
const softphoneToggle   = document.getElementById("softphone-toggle");
const softphoneClose    = document.getElementById("softphone-close");
const softphoneIframe   = document.getElementById("softphone");
const softphoneStatusDot= document.getElementById("softphone-status-dot");
const authStatusBar     = document.getElementById("softphone-auth-status");
const spStatusText      = document.getElementById("sp-status-text");
const mainContent       = document.querySelector(".main");
const callsTodayEl      = document.getElementById("calls-today");
const activityFeed      = document.getElementById("activity-feed");
const toastEl           = document.getElementById("toast");

/* ─────────────────────────────────────────────────────────────
   STATE
───────────────────────────────────────────────────────────── */
let softphoneOpen  = false;
let callsToday     = 0;
let genesysReady   = false;

/* ─────────────────────────────────────────────────────────────
   TOAST UTILITY
───────────────────────────────────────────────────────────── */
let toastTimer = null;
function showToast(msg, duration = 3200) {
  if (toastTimer) clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), duration);
}

/* ─────────────────────────────────────────────────────────────
   SOFTPHONE PANEL TOGGLE
───────────────────────────────────────────────────────────── */
function openSoftphone() {
  softphoneOpen = true;
  softphonePanel.classList.add("open");
  mainContent.classList.add("sp-open");
  softphoneToggle.classList.add("active");
  initGenesys();
}

function closeSoftphone() {
  softphoneOpen = false;
  softphonePanel.classList.remove("open");
  mainContent.classList.remove("sp-open");
  softphoneToggle.classList.remove("active");
}

softphoneToggle.addEventListener("click", (e) => {
  e.preventDefault();
  softphoneOpen ? closeSoftphone() : openSoftphone();
});

softphoneClose.addEventListener("click", closeSoftphone);

/* ─────────────────────────────────────────────────────────────
   GENESYS CLOUD — EMBEDDABLE FRAMEWORK INITIALISATION
   Docs: https://developer.genesys.cloud/commdigital/digital/embeddableframework/
───────────────────────────────────────────────────────────── */
function initGenesys() {
  if (genesysReady) return;

  setStatus("Connecting to Genesys Cloud…");

  /**
   * The iframe URL already embeds the Genesys Embeddable Framework.
   * We communicate via postMessage to pass the OAuth client config
   * so the framework can authenticate the agent without a separate
   * login page redirect.
   *
   * Message schema expected by the Genesys Embeddable Framework:
   *   { type: "COMMAND", name: "authenticate",
   *     data: { clientId, region, redirectUri } }
   *
   * We wait for the iframe to signal it is ready before sending.
   */
  window.addEventListener("message", handleGenesysMessage);

  // Safety timeout — if no ready signal in 10s, show guidance
  setTimeout(() => {
    if (!genesysReady) {
      setStatus("⚠ Check Client ID / Region config in app.js", true);
    }
  }, 10000);
}

/**
 * Send a postMessage to the Genesys iframe.
 * origin is set to the configured region endpoint.
 */
function postToGenesys(payload) {
  try {
    const targetOrigin = `https://apps.${GENESYS_CONFIG.region}`;
    softphoneIframe.contentWindow.postMessage(payload, targetOrigin);
  } catch (err) {
    console.warn("[CRM] postToGenesys error:", err);
  }
}

/**
 * Handle all incoming postMessage events from the Genesys iframe.
 * Full event list: https://developer.genesys.cloud/commdigital/digital/embeddableframework/
 */
function handleGenesysMessage(event) {
  // Only accept messages from the configured Genesys region
  const allowedOrigin = `https://apps.${GENESYS_CONFIG.region}`;
  if (!event.origin.includes(GENESYS_CONFIG.region)) return;

  const msg = event.data;
  if (!msg || typeof msg !== "object") return;

  console.log("[CRM] Genesys message:", msg);

  switch (msg.type || msg.name) {

    // Framework signals it is loaded and ready for config
    case "READY":
    case "ready":
      onGenesysReady();
      break;

    // Authentication was successful
    case "AUTH_SUCCESS":
    case "authenticated":
      onGenesysAuthenticated();
      break;

    // Authentication failed
    case "AUTH_ERROR":
    case "authError":
      setStatus("Authentication failed. Check Client ID.", true);
      break;

    // Agent went on-queue / available
    case "ON_QUEUE":
    case "agentOnQueue":
      softphoneStatusDot.classList.add("online");
      setStatus("Agent Online", false, true);
      break;

    // Inbound / outbound call started
    case "CALL_STARTED":
    case "callStarted":
      onCallStarted(msg.data || {});
      break;

    // Call ended
    case "CALL_ENDED":
    case "callEnded":
      onCallEnded(msg.data || {});
      break;

    // Interaction accepted / alerting
    case "INTERACTION_ALERTING":
      showToast("📞 Incoming call…");
      break;

    default:
      break;
  }
}

function onGenesysReady() {
  setStatus("Authenticating…");

  // Send authentication config to the iframe
  postToGenesys({
    type: "COMMAND",
    name: "authenticate",
    data: {
      clientId:    GENESYS_CONFIG.clientId,
      region:      GENESYS_CONFIG.region,
      redirectUri: GENESYS_CONFIG.redirectUri,
    },
  });
}

function onGenesysAuthenticated() {
  genesysReady = true;
  authStatusBar.classList.add("hidden");
  softphoneStatusDot.classList.add("online");
  showToast("✅ Genesys Cloud connected");
}

function onCallStarted(data) {
  callsToday++;
  callsTodayEl.textContent = callsToday;
  const name = data.customerName || data.ani || "Unknown";
  addActivityItem("call", `Inbound call from <strong>${name}</strong>`, "Just now · in progress");
  showToast(`📞 Call started — ${name}`);
}

function onCallEnded(data) {
  const dur = data.duration ? `${Math.round(data.duration / 1000)}s` : "";
  showToast(`✔ Call ended${dur ? " · " + dur : ""}`);
}

/* ─────────────────────────────────────────────────────────────
   STATUS BAR HELPERS
───────────────────────────────────────────────────────────── */
function setStatus(text, isError = false, hide = false) {
  spStatusText.textContent = text;
  authStatusBar.classList.toggle("hidden", hide);
  authStatusBar.style.color = isError ? "var(--red)" : "var(--text-dim)";
}

/* ─────────────────────────────────────────────────────────────
   ACTIVITY FEED — prepend new items
───────────────────────────────────────────────────────────── */
const ICON_SVG = {
  call: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.34 2 2 0 0 1 3.6 1.14h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.64 16z"/></svg>`,
  email:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  note: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
};

function addActivityItem(type, bodyHtml, timeText) {
  const li = document.createElement("li");
  li.className = "activity-item";
  li.innerHTML = `
    <div class="activity-icon ${type}">${ICON_SVG[type] || ""}</div>
    <div class="activity-body">
      <p>${bodyHtml}</p>
      <span>${timeText}</span>
    </div>`;
  activityFeed.prepend(li);

  // Keep feed manageable — cap at 20 items
  while (activityFeed.children.length > 20) {
    activityFeed.removeChild(activityFeed.lastChild);
  }
}

/* ─────────────────────────────────────────────────────────────
   NAV LINK ACTIVE STATE (SPA-style click handler)
───────────────────────────────────────────────────────────── */
document.querySelectorAll(".nav-link, .sidebar__item").forEach(link => {
  link.addEventListener("click", function (e) {
    if (this.id === "softphone-toggle") return; // handled separately
    const group = this.closest("nav, .sidebar__section");
    if (!group) return;
    group.querySelectorAll(".nav-link, .sidebar__item").forEach(l => l.classList.remove("active"));
    this.classList.add("active");
  });
});

/* ─────────────────────────────────────────────────────────────
   KEYBOARD SHORTCUT — Alt+P toggles softphone
───────────────────────────────────────────────────────────── */
document.addEventListener("keydown", (e) => {
  if (e.altKey && e.key.toLowerCase() === "p") {
    e.preventDefault();
    softphoneOpen ? closeSoftphone() : openSoftphone();
  }
});

/* ─────────────────────────────────────────────────────────────
   IFRAME LOAD FALLBACK
   If the iframe fires its load event without a READY postMessage
   (e.g. dev environment without Genesys credentials),
   we update the status bar gracefully.
───────────────────────────────────────────────────────────── */
softphoneIframe.addEventListener("load", () => {
  if (!genesysReady) {
    setStatus("Waiting for Genesys Framework…");
  }
});

/* ─────────────────────────────────────────────────────────────
   INIT
───────────────────────────────────────────────────────────── */
console.log("[CRM] Cognizant CRM Solutions loaded.");
console.log("[CRM] Genesys region:", GENESYS_CONFIG.region);
console.log("[CRM] Open softphone: click 'Softphone' in sidebar or press Alt+P");
