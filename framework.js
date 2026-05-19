/* ============================================================
   NexaConnect — Genesys Cloud Softphone Integration
   ============================================================ */

(function () {
  'use strict';

  // ─── 1. CONFIG ────────────────────────────────
  const GENESYS_CONFIG = {
    clientIds: {
      'usw2.pure.cloud': '226182a8-bb53-435b-bc3c-2140f077768f'
    },
    pureCloudEnvironment: 'usw2.pure.cloud',
    usePopupAuth: true,
    dedicatedLoginWindow: true
  };

  // ─── 2. LOAD CXBUS ───────────────────────────
  function loadCXBus() {
    return new Promise((resolve, reject) => {
      const existingScript = document.getElementById('genesys-cxbus');
      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'genesys-cxbus';
      script.src = 'https://apps.usw2.pure.cloud/widgets/9.0/cxbus.min.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load CXBus'));
      document.head.appendChild(script);
    });
  }

  // ─── 3. CONFIGURE CXBUS ──────────────────────
  function configureCXBus() {
    if (typeof window.CXBus === 'undefined') {
      console.warn('[NexaConnect] CXBus not available.');
      return;
    }

    window.CXBus.configure({
      debug: false,
      pluginsPath: 'https://apps.usw2.pure.cloud/widgets/9.0/plugins/'
    });

    window.CXBus.loadPlugin('widgets-core')
      .done(function () {
        console.info('[NexaConnect] widgets-core loaded');

        // ❌ removed invalid plugin load (cxbus.min)

        subscribeToCallEvents();
      })
      .fail(function (err) {
        console.warn('[NexaConnect] widgets-core failed:', err);
      });
  }

  // ─── 4. CALL EVENTS ──────────────────────────
  function subscribeToCallEvents() {
    if (typeof window.CXBus === 'undefined') return;

    window.CXBus.subscribe('InteractionService.interactionAdded', (event) => {
      showToast('📞 Incoming call — ' + (event.data?.ani || 'Unknown'));
    });

    window.CXBus.subscribe('InteractionService.interactionConnected', () => {
      showToast('✅ Call connected', 'success');
      startCallTimer();
    });

    window.CXBus.subscribe('InteractionService.interactionDisconnected', () => {
      showToast('📵 Call ended', 'warning');
      stopCallTimer();
    });

    window.CXBus.subscribe('UserService.userLoggedIn', () => {
      showToast('🔑 Logged in', 'success');
    });
  }

  // ─── 5. IFRAME MESSAGES ──────────────────────
  window.addEventListener('message', function (event) {
    const allowedOrigins = [
      'https://apps.usw2.pure.cloud',
      'https://login.usw2.pure.cloud',
      'https://api.usw2.pure.cloud'
    ];

    if (!allowedOrigins.includes(event.origin)) return;

    const msg = event.data;
    if (!msg || !msg.type) return;

    switch (msg.type) {
      case 'purecloud-auth-ready':
        postToSoftphone({
          type: 'purecloud-auth-config',
          clientId: GENESYS_CONFIG.clientIds[GENESYS_CONFIG.pureCloudEnvironment],
          environment: GENESYS_CONFIG.pureCloudEnvironment
        });
        break;

      case 'purecloud-ready':
        showToast('☎ Softphone ready', 'success');
        break;

      case 'purecloud-call-started':
        showToast('📞 Call in progress');
        break;

      case 'purecloud-call-ended':
        showToast('📵 Call ended', 'warning');
        break;
    }
  });

  function postToSoftphone(data) {
    const iframe = document.getElementById('softphone');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        data,
        'https://apps.usw2.pure.cloud'
      );
    }
  }

  // ─── 6. TOAST ────────────────────────────────
  function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');

    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText =
        'position:fixed;bottom:56px;right:20px;display:flex;flex-direction:column;gap:8px;z-index:9999;';
      document.body.appendChild(container);
    }

    const colors = {
      success: '#22c55e',
      warning: '#f59e0b',
      info: '#00d4b8',
      error: '#ef4444'
    };

    const toast = document.createElement('div');
    toast.style.cssText = `
      background:#0d1120;
      border-left:3px solid ${colors[type] || colors.info};
      color:#e8edf5;
      padding:10px 16px;
      border-radius:8px;
      font-size:13px;
      opacity:0;
      transform:translateX(20px);
      transition:0.3s;
    `;
    toast.textContent = message;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ─── 7. CLOCK ────────────────────────────────
  function updateClock() {
    const el = document.getElementById('clock');
    if (!el) return;

    el.textContent = new Date().toLocaleTimeString('en-IN');
  }

  // ─── 8. TIMER ────────────────────────────────
  let timer = null;
  let seconds = 0;

  function startCallTimer() {
    clearInterval(timer);
    seconds = 0;

    timer = setInterval(() => {
      seconds++;
      const m = String(Math.floor(seconds / 60)).padStart(2, '0');
      const s = String(seconds % 60).padStart(2, '0');

      const badge = document.querySelector('.badge-live');
      if (badge) badge.textContent = `● ${m}:${s}`;
    }, 1000);
  }

  function stopCallTimer() {
    clearInterval(timer);
    const badge = document.querySelector('.badge-live');
    if (badge) badge.textContent = '● Live';
  }

  // ─── 9. UI EVENTS ─────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        showToast(btn.textContent + ' clicked');
      });
    });

    document.querySelectorAll('.quick-dial li').forEach(item => {
      item.addEventListener('click', () => {
        showToast('📞 Dialing ' + item.textContent);
      });
    });
  });

  // ─── 10. INIT ────────────────────────────────
  async function init() {
    updateClock();
    setInterval(updateClock, 1000);

    try {
      await loadCXBus();
      configureCXBus();
    } catch (err) {
      console.warn('CXBus load failed:', err.message);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
