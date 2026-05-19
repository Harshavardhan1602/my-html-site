/* ============================================================
   NexaConnect — Genesys Cloud Softphone Integration
   Genesys CXBus + PureCloud Softphone SDK
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
    dedicatedLoginWindow: true
  };

  // ─── 2. LOAD GENESYS CXBUS ──────────────────────────────────
  function loadCXBus() {
    return new Promise((resolve, reject) => {
      const existingScript = document.getElementById('genesys-cxbus');
      if (existingScript) { resolve(); return; }

      const script = document.createElement('script');
      script.id  = 'genesys-cxbus';
      script.src = 'https://apps.usw2.pure.cloud/widgets/9.0/cxbus.min.js';
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

      window.CXBus.loadPlugin('cxbus.min').done(function () {
        console.info('[NexaConnect] Softphone plugin ready.');
      }).fail(function (err) {
        console.warn('[NexaConnect] Plugin load failed:', err);
      });

      // Subscribe to call events
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
      showToast('📞 Incoming call — ' + (event.data?.ani || 'Unknown'), 'info');
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
  window.addEventListener('message', function (event) {
    // Accept messages from Genesys Cloud domains
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
        postToSoftphone({
          type: 'purecloud-auth-config',
          clientId: GENESYS_CONFIG.clientIds[GENESYS_CONFIG.pureCloudEnvironment],
          environment: GENESYS_CONFIG.pureCloudEnvironment
        });
        break;

      case 'purecloud-ready':
        console.info('[NexaConnect] Softphone ready.');
        showToast('☎ Softphone ready', 'success');
        break;

      case 'purecloud-call-started':
        showToast('📞 Call in progress', 'info');
        break;

      case 'purecloud-call-ended':
        showToast('📵 Call ended', 'warning');
        break;
    }
  });

  function postToSoftphone(data) {
    const iframe = document.getElementById('softphone');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(data, 'https://apps.usw2.pure.cloud');
    }
  }

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

    // Animate in
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    });

    // Remove after 3.5s
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ─── 7. LIVE CLOCK ──────────────────────────────────────────
  function updateClock() {
    const el = document.getElementById('clock');
    if (!el) return;
    const now = new Date();
    el.textContent = now.toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      timeZoneName: 'short'
    });
  }

  // ─── 8. CALL TIMER ──────────────────────────────────────────
  let callTimerInterval = null;
  let callSeconds = 0;

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
    const buttons = document.querySelectorAll('.action-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', function () {
        showToast(btn.textContent.trim() + ' — feature activated', 'info');
      });
    });

    const quickDials = document.querySelectorAll('.quick-dial li');
    quickDials.forEach(item => {
      item.addEventListener('click', function () {
        showToast('📞 Dialling: ' + item.textContent.trim(), 'info');
      });
    });
  });

  // ─── 10. INIT ────────────────────────────────────────────────
  async function init() {
    // Start clock
    updateClock();
    setInterval(updateClock, 1000);

    // Load CXBus
    try {
      await loadCXBus();
      configureCXBus();
    } catch (err) {
      console.warn('[NexaConnect] CXBus load skipped:', err.message);
      console.info('[NexaConnect] Softphone running via iframe embed. Client ID:', 
        GENESYS_CONFIG.clientIds[GENESYS_CONFIG.pureCloudEnvironment]);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
