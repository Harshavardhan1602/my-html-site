(function () {
  "use strict";

  /* ── Config ─────────────────────────────────────────────── */
  const CONFIG = window.GENESYS_CONFIG || {};
  const CLIENT_ID = CONFIG.clientId || "226182a8-bb53-435b-bc3c-2140f077768f";
  const REGION = CONFIG.region || "usw2.pure.cloud";
  const IFRAME_URL = "https://apps.usw2.pure.cloud/crm/index.html?crm=framework-local-secure";

  let iframe, iframeOverlay, statusDot, statusText, softphoneBadge, callsToday, activityFeed;
  let callCount = 0;

  /* ── INIT AFTER DOM LOAD ───────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    iframe = document.getElementById("genesysIframe");
    iframeOverlay = document.getElementById("iframeOverlay");
    statusDot = document.getElementById("statusDot");
    statusText = document.getElementById("statusText");
    softphoneBadge = document.getElementById("softphoneBadge");
    callsToday = document.getElementById("callsToday");
    activityFeed = document.getElementById("activityFeed");

    setStatus("loading", "Initializing…");
    setTimeout(loadGenesysSDK, 400);

    setupUIListeners();

    console.log(
      `[CloudCRM] Genesys Integration Booting\nClient ID: ${CLIENT_ID}\nRegion: ${REGION}`
    );
  });

  /* ── SDK Loader ────────────────────────────────────────── */
  function loadGenesysSDK() {
    const sdkUrl = "https://sdk-cdn.mypurecloud.com/client-apps/2/purecloud-client-app-sdk.js";
    const script = document.createElement("script");

    script.src = sdkUrl;
    script.async = true;

    script.onload = initClientApp;
    script.onerror = () => {
      console.warn("[CRM] SDK failed → fallback to iframe");
      loadSoftphoneIframe();
    };

    document.head.appendChild(script);
  }

  /* ── INIT SDK ──────────────────────────────────────────── */
  function initClientApp() {
    if (!window.purecloud?.apps?.ClientApp) {
      console.warn("[CRM] SDK not found → fallback iframe");
      loadSoftphoneIframe();
      return;
    }

    try {
      const ClientApp = window.purecloud.apps.ClientApp;

      const myApp = new ClientApp({
        pcEnvironment: REGION
      });

      myApp.lifecycle.addBootstrapListener(() => {
        setStatus("online", "Connected");
        loadSoftphoneIframe();
      });

      myApp.users.addUserActionListener(({ action }) => {
        handleAgentState(action);
      });

      setStatus("loading", "Authenticating…");
    } catch (err) {
      console.error("[CRM] SDK init error:", err);
      loadSoftphoneIframe();
    }
  }

  /* ── LOAD IFRAME ───────────────────────────────────────── */
  function loadSoftphoneIframe() {
    if (!iframe) return;

    const url = new URL(IFRAME_URL);
    url.searchParams.set("clientId", CLIENT_ID);
    url.searchParams.set("pcEnvironment", REGION);

    iframe.src = url.toString();

    iframe.onload = onIframeLoad;
    iframe.onerror = onIframeError;
  }

  function onIframeLoad() {
    if (iframeOverlay) iframeOverlay.classList.add("hidden");
    setStatus("online", "Connected");
    showToast("Softphone loaded", "success");
  }

  function onIframeError() {
    setStatus("error", "Load failed");
    showToast("Softphone failed", "error");
  }

  /* ── MESSAGE LISTENER ─────────────────────────────────── */
  window.addEventListener("message", (event) => {
    if (!event.origin.includes("pure.cloud")) return;

    const msg = event.data;
    if (!msg || typeof msg !== "object") return;

    switch (msg.type || msg.action) {
      case "call.incoming":
        handleIncomingCall(msg);
        break;

      case "call.ended":
        handleCallEnded();
        break;

      case "agentStateChanged":
        handleAgentState(msg.state);
        break;
    }
  });

  /* ── CALL FEATURES ────────────────────────────────────── */
  function initiateCall(phoneNumber) {
    if (!iframe?.contentWindow) return;

    iframe.contentWindow.postMessage(
      { type: "dial", phoneNumber },
      `https://apps.${REGION}`
    );

    showToast("Dialling " + phoneNumber, "success");
  }

  function handleIncomingCall(msg) {
    const caller = msg.ani || "Unknown";
    callCount++;

    if (callsToday) callsToday.textContent = callCount;
    addActivity("📞", "blue", `Incoming call from <strong>${caller}</strong>`);
  }

  function handleCallEnded() {
    addActivity("✅", "green", "Call ended");
  }

  function handleAgentState(state) {
    const text = typeof state === "string" ? state : state?.name || "Unknown";
    setStatus("online", "Agent: " + text);
  }

  /* ── UI HELPERS ───────────────────────────────────────── */
  function setStatus(type, text) {
    if (statusDot) statusDot.className = "status-dot " + type;
    if (statusText) statusText.textContent = text;

    if (softphoneBadge) {
      softphoneBadge.textContent = text;
      softphoneBadge.className = "softphone-badge " + type;
    }
  }

  function addActivity(icon, color, html) {
    if (!activityFeed) return;

    const li = document.createElement("li");
    li.innerHTML = `
      <div class="activity-icon ${color}">${icon}</div>
      <div>${html}</div>
    `;
    activityFeed.prepend(li);
  }

  /* ── TOAST ────────────────────────────────────────────── */
  function showToast(message, type = "") {
    let container = document.getElementById("toastContainer");

    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast " + type;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
  }

  /* ── UI EVENTS ────────────────────────────────────────── */
  function setupUIListeners() {
    document.querySelectorAll(".call-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const phone = btn.dataset.phone;
        if (phone) initiateCall(phone);
      });
    });
  }

})();
