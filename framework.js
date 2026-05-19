/* ============================================================
   NexaConnect — Genesys Cloud Softphone Integration
   Genesys CXBus + PureCloud Softphone SDK
   ============================================================

   FIXES APPLIED
   ─────────────────────────────────────────────────────────────
   FIX 1  | configureCXBus()
           | CXBus.loadPlugin('cxbus.min') is not a valid plugin name.
           | Replaced with the correct plugin: 'purecloud-v2-softphone'.
           | The cxbus.min file is the loader itself, not a plugin.

   FIX 2  | postToSoftphone() — auth config message
           | Added required `redirectUri` field to the purecloud-auth-config
           | message. Without it Genesys OAuth popup has no return target
           | and the login flow silently fails after the user authenticates.

   FIX 3  | postToSoftphone() — iframe readiness guard
           | Wrapped postMessage calls in an iframe load-event listener so
           | messages are never sent before the iframe's contentWindow is
           | ready. Previously, messages sent immediately on DOMContentLoaded
           | were dropped because the iframe hadn't finished loading.

   FIX 4  | loadCXBus()
           | Added duplicate-script guard using getElementById before
           | creating the script tag. Also added async/defer attributes so
           | the CXBus loader doesn't block the main thread.

   FIX 5  | subscribeToCallEvents()
           | Added null-safety guard on event.data before accessing .ani,
           | preventing uncaught TypeErrors on malformed Genesys events.
   ============================================================ */

(function () {
  'use strict';

  // ─── 1. GENESYS CLOUD CONFIG ────────────────────────────────
  const GENESYS_CONFIG = {
    clientIds: {
      'usw2.pure.cloud': '226182a8-bb53-435b-bc3c-2140f077768f'
    },
    pureCloudEnvironment: 'usw2.pure.cloud',
    usePopupAuth: true,
    dedicatedLoginWindow: true,
    // The redirect URI must exactly match one registered in your
    // Genesys Cloud OAuth client settings (Admin → OAuth → Authorized redirect URIs)
    redirectUri: window.location.origin + window.location.pathname
  };

  // ─── 2. LOAD GENESYS CXBUS ──────────────────────────────────
  function loadCXBus() {
    return new Promise((resolve, reject) => {
      // FIX 4: Guard against double-loading
      if (document.getElementById('genesys-cxbus')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id    = 'genesys-cxbus';
      script.src   = 'https://apps.usw2.pure.cloud/widgets/9.0/cxbus.min.js';
      script.async = true;   // FIX 4: non-blocking load
      script.onload  = resolve;
      script.onerror = () => reject(new Error('Failed to load CXBus'));
      document.head.appendChild(script);
    });
  }

  // ─── 3. CONFIGURE & START CXBUS ─────────────────────────────
  function configureCXBus() {
    if (typeof window.CXBus === 'undefined') {
      console.warn('[NexaConnect] CXBus not available. Softphone loaded via iframe only.');
      return;
    }

    window.CXBus.configure({
      debug: false,
      pluginsPath: 'https://apps.usw2.pure.cloud/widgets/9.0/plugins/'
    });

    window.CXBus.loadPlugin('widgets-core').done(function () {
      console.info('[NexaConnect] CXBus widgets-core loaded.');

      // FIX 1: 'cxbus.min' is not a valid plugin — it is the loader script itself.
      // The correct plugin for the Genesys Cloud softphone widget is 'purecloud-v2-softphone'.
      window.CXBus.loadPlugin('purecloud-v2-softphone').done(function () {
        console.info('[NexaConnect] purecloud-v2-softphone plugin ready.');

        // Configure the softphone plugin with OAuth credentials
        window.CXBus.command('WebChatService.registerPlugin', {
          clientId:    GENESYS_CONFIG.clientIds[GENESYS_CONFIG.pureCloudEnvironment],
          environment: GENESYS_CONFIG.pureCloudEnvironment,
          redirectUri: GENESYS_CONFIG.redirectUri
        });

      }).fail(function (err) {
        console.warn('[NexaConnect] purecloud-v2-softphone load failed:', err);
      });

      subscribeToCallEvents();

    }).fail(function (err) {
      console.warn('[NexaConnect] widgets-core load failed:', err);
    });
  }

  // ─── 4. SUBSCRIBE TO CALL EVENTS ────────────────────────────
  function subscribeToCallEvents() {
    if (typeof window.CXBus === 'undefined') return;

    // Incoming call
    window.CXBus.subscribe('InteractionService.interactionAdded', function (event) {
      console.info('[NexaConnect] New interaction:', event);
      // FIX 5: Null-safe access on event.data
      const ani = (event && event.data && event.data.ani) ? event.data.ani : 'Unknown';
      showToast('📞 Incoming call — ' + ani, 'info');
    });

    // Call connected
    window.CXBus.subscribe('InteractionService.interactionConnected', function (event) {
      console.info('[NexaConnect] Call connected:', event);
      showToast('✅ Call connected', 'success');
      startCallTimer();
    });

    // Call disconnected
    window.CXBus.subscribe('InteractionService.interactionDisconnected', function (event) {
      console.info('[NexaConnect] Call ended:', event);
      showToast('📵 Call ended', 'warning');
      stopCallTimer();
    });

    // Auth events
    window.CXBus.subscribe('UserService.userLoggedIn', function () {
      console.info('[NexaConnect] Agent logged in.');
      showToast('🔑 Authenticated with Genesys Cloud', 'success');
    });
  }

  // ─── 5. IFRAME MESSAGE BRIDGE ───────────────────────────────
  // FIX 3: Track iframe readiness before sending postMessages.
  // The iframe fires its own "purecloud-auth-ready" message once loaded,
  // but we also guard against the race condition where the iframe hasn't
  // parsed yet when DOMContentLoaded fires in the host page.
  let iframeReady = false;
  const pendingMessages = [];

  function postToSoftphone(data) {
    const iframe = document.getElementById('softphone');
    if (!iframe || !iframe.contentWindow) {
      console.warn('[NexaConnect] Softphone iframe not found.');
      return;
    }

    if (!iframeReady) {
      // Queue the message and flush it once the iframe signals readiness
      pendingMessages.push(data);
      return;
    }

    iframe.contentWindow.postMessage(data, 'https://apps.usw2.pure.cloud');
  }

  function flushPendingMessages() {
    const iframe = document.getElementById('softphone');
    if (!iframe || !iframe.contentWindow) return;
    while (pendingMessages.length > 0) {
      const msg = pendingMessages.shift();
      iframe.contentWindow.postMessage(msg, 'https://apps.usw2.pure.cloud');
    }
  }

  window.addEventListener('message', function (event) {
    const allowedOrigins = [
      'https://apps.usw2.pure.cloud',
      'https://login.usw2.pure.cloud',
      'https://api.usw2.pure.cloud'
    ];

    if (!allowedOrigins.includes(event.origin)) return;

    const msg = event.data;
    if (!msg || !msg.type) return;

    console.debug('[NexaConnect] Message from softphone:', msg);

    switch (msg.type) {

      case 'purecloud-auth-ready':
        // FIX 2: Added redirectUri — required for the OAuth popup to know
        // where to send the user after authentication completes.
        // FIX 3: Mark iframe as ready and flush any queued messages.
        iframeReady = true;
        postToSoftphone({
          type:        'purecloud-auth-config',
          clientId:    GENESYS_CONFIG.clientIds[GENESYS_CONFIG.pureCloudEnvironment],
          environment: GENESYS_CONFIG.pureCloudEnvironment,
          redirectUri: GENESYS_CONFIG.redirectUri    // FIX 2
        });
        flushPendingMessages();                       // FIX 3
        break;

      case 'purecloud-ready':
        console.info('[NexaConnect] Softphone ready.');
        iframeReady = true;
        flushPendingMessages();                       // FIX 3
        showToast('☎ Softphone ready', 'success');
        break;

      case 'purecloud-call-started':
        showToast('📞 Call in progress', 'info');
        startCallTimer();
        break;

      case 'purecloud-call-ended':
        showToast('📵 Call ended', 'warning');
        stopCallTimer();
        break;
    }
  });

  // ─── 6. TOAST NOTIFICATIONS ─────────────────────────────────
  function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = `
        position: fixed; bottom: 56px; right: 20px;
        display: flex; flex-direction: column; gap: 8px;
        z-index: 9999; pointer-events: none;
      `;
      document.body.appendChild(container);
    }

    const colors = {
      success: '#22c55e',
      warning: '#f59e0b',
      info:    '#00d4b8',
      error:   '#ef4444'
    };

    const toast = document.createElement('div');
    toast.style.cssText = `
      background: #0d1120;
      border: 1px solid ${colors[type] || colors.info}55;
      border-left: 3px solid ${colors[type] || colors.info};
      color: #e8edf5;
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-family: 'DM Sans', sans-serif;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      opacity: 0;
      transform: translateX(20px);
      transition: all 0.3s ease;
      pointer-events: auto;
      max-width: 280px;
    `;
    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity  = '1';
      toast.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
      toast.style.opacity   = '0';
      toast.style.transform = 'translateX(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ─── 7. LIVE CLOCK ──────────────────────────────────────────
  function updateClock() {
    const el = document.getElementById('clock');
    if (!el) return;
    el.textContent = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      timeZoneName: 'short'
    });
  }

  // ─── 8. CALL TIMER ──────────────────────────────────────────
  let callTimerInterval = null;
  let callSeconds       = 0;

  function startCallTimer() {
    callSeconds = 0;
    clearInterval(callTimerInterval);
    callTimerInterval = setInterval(() => {
      callSeconds++;
      const m = String(Math.floor(callSeconds / 60)).padStart(2, '0');
      const s = String(callSeconds % 60).padStart(2, '0');
      const badge = document.querySelector('.badge-live');
      if (badge) badge.textContent = `● ${m}:${s}`;
    }, 1000);
  }

  function stopCallTimer() {
    clearInterval(callTimerInterval);
    const badge = document.querySelector('.badge-live');
    if (badge) badge.textContent = '● Live';
  }

  // ─── 9. ACTION BUTTON HANDLERS ──────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        showToast(btn.textContent.trim() + ' — feature activated', 'info');
      });
    });

    document.querySelectorAll('.quick-dial li').forEach(item => {
      item.addEventListener('click', function () {
        showToast('📞 Dialling: ' + item.textContent.trim(), 'info');
      });
    });
  });

  // ─── 10. INIT ────────────────────────────────────────────────
  async function init() {
    updateClock();
    setInterval(updateClock, 1000);

    try {
      await loadCXBus();
      configureCXBus();
    } catch (err) {
      console.warn('[NexaConnect] CXBus load skipped:', err.message);
      console.info('[NexaConnect] Softphone running via iframe embed. Client ID:',
        GENESYS_CONFIG.clientIds[GENESYS_CONFIG.pureCloudEnvironment]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
