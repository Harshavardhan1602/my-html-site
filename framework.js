(function () {
  'use strict';

  // ─── 1. CONFIG ─────────────────────────────────────────────
  const GENESYS_CONFIG = {
    clientIds: {
      'usw2.pure.cloud': '226182a8-bb53-435b-bc3c-2140f077768f'
    },
    environment: 'usw2.pure.cloud',
    redirectUri: window.location.origin + window.location.pathname
  };

  // ─── 2. LOAD CXBUS ─────────────────────────────────────────
  function loadCXBus() {
    return new Promise((resolve, reject) => {

      if (document.getElementById('genesys-cxbus')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'genesys-cxbus';
      script.src = 'https://apps.usw2.pure.cloud/widgets/9.0/cxbus.min.js';
      script.async = true;

      script.onload = () => resolve();
      script.onerror = () => reject(new Error('CXBus failed'));

      document.head.appendChild(script);
    });
  }

  // ─── 3. CONFIGURE CXBUS ────────────────────────────────────
  function configureCXBus() {
    if (!window.CXBus) {
      console.warn('[NexaConnect] CXBus not available → iframe mode only.');
      return;
    }

    CXBus.configure({
      debug: false,
      pluginsPath: 'https://apps.usw2.pure.cloud/widgets/9.0/plugins/'
    });

    CXBus.loadPlugin('widgets-core').done(() => {

      console.log('[NexaConnect] widgets-core loaded');

      CXBus.loadPlugin('purecloud-v2-softphone').done(() => {

        console.log('[NexaConnect] softphone plugin loaded');

        // ✅ FIX: correct command for plugin config
        CXBus.command('PureCloudSoftphone.configure', {
          clientId: GENESYS_CONFIG.clientIds[GENESYS_CONFIG.environment],
          environment: GENESYS_CONFIG.environment,
          redirectUri: GENESYS_CONFIG.redirectUri
        });

      }).fail(err => console.warn('Softphone plugin failed:', err));

      subscribeToCallEvents();

    }).fail(err => console.warn('widgets-core failed:', err));
  }

  // ─── 4. EVENTS ─────────────────────────────────────────────
  function subscribeToCallEvents() {
    if (!window.CXBus) return;

    CXBus.subscribe('InteractionService.interactionAdded', event => {
      const ani = event?.data?.ani || 'Unknown';
      showToast('📞 Incoming call — ' + ani, 'info');
    });

    CXBus.subscribe('InteractionService.interactionConnected', () => {
      showToast('✅ Call connected', 'success');
      startCallTimer();
    });

    CXBus.subscribe('InteractionService.interactionDisconnected', () => {
      showToast('📵 Call ended', 'warning');
      stopCallTimer();
    });

    CXBus.subscribe('UserService.userLoggedIn', () => {
      showToast('🔑 Logged in to Genesys', 'success');
    });
  }

  // ─── 5. IFRAME INTEGRATION ─────────────────────────────────
  let iframeReady = false;
  const queue = [];

  function postToSoftphone(data) {
    const iframe = document.getElementById('softphone');
    if (!iframe || !iframe.contentWindow) return;

    if (!iframeReady) {
      queue.push(data);
      return;
    }

    iframe.contentWindow.postMessage(data, '*');
  }

  function flushQueue() {
    const iframe = document.getElementById('softphone');
    if (!iframe || !iframe.contentWindow) return;

    while (queue.length > 0) {
      iframe.contentWindow.postMessage(queue.shift(), '*');
    }
  }

  window.addEventListener('message', event => {

    const trusted = [
      'https://apps.usw2.pure.cloud',
      'https://login.usw2.pure.cloud'
    ];

    if (!trusted.includes(event.origin)) return;

    const msg = event.data;
    if (!msg?.type) return;

    console.log('[NexaConnect]', msg.type);

    switch (msg.type) {

      case 'purecloud-auth-ready':
        iframeReady = true;

        postToSoftphone({
          type: 'purecloud-auth-config',
          clientId: GENESYS_CONFIG.clientIds[GENESYS_CONFIG.environment],
          environment: GENESYS_CONFIG.environment,
          redirectUri: GENESYS_CONFIG.redirectUri
        });

        flushQueue();
        break;

      case 'purecloud-ready':
        iframeReady = true;
        flushQueue();
        showToast('☎ Softphone initialized', 'success');
        break;

      case 'purecloud-call-started':
        startCallTimer();
        break;

      case 'purecloud-call-ended':
        stopCallTimer();
        break;
    }
  });

  // ─── 6. TOAST UI ───────────────────────────────────────────
  function showToast(message, type = 'info') {

    let container = document.getElementById('toast-container');

    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = `
        position:fixed;bottom:20px;right:20px;z-index:9999;
        display:flex;flex-direction:column;gap:10px;
      `;
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `
      background:#111;color:#fff;padding:10px 15px;
      border-radius:8px;font-size:13px;
      box-shadow:0 5px 15px rgba(0,0,0,0.3);
      opacity:0;transform:translateX(20px);
      transition:0.3s;
    `;

    toast.innerText = message;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ─── 7. CALL TIMER ─────────────────────────────────────────
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

  // ─── 8. CLOCK ──────────────────────────────────────────────
  function startClock() {
    const el = document.getElementById('clock');
    if (!el) return;

    setInterval(() => {
      el.textContent = new Date().toLocaleTimeString();
    }, 1000);
  }

  // ─── 9. INIT ───────────────────────────────────────────────
  async function init() {
    startClock();

    try {
      await loadCXBus();
      configureCXBus();
    } catch (e) {
      console.warn('CXBus skipped → iframe mode active');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
``
