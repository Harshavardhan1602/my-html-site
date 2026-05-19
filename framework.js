(function () {
  'use strict';

  // ✅ GENESYS CONFIG
  const GENESYS_CONFIG = {
    clientIds: {
      'usw2.pure.cloud': '226182a8-bb53-435b-bc3c-2140f077768f'
    },
    environment: 'usw2.pure.cloud'
  };

  // ✅ Post config to iframe
  function sendConfigToSoftphone() {
    const iframe = document.getElementById('softphone');

    if (!iframe || !iframe.contentWindow) return;

    iframe.contentWindow.postMessage({
      type: 'purecloud-auth-config',
      clientId: GENESYS_CONFIG.clientIds[GENESYS_CONFIG.environment],
      environment: GENESYS_CONFIG.environment,

      // ✅ ADD THESE NEW FIELDS
      redirectUri: window.location.origin + window.location.pathname,
      usePopupAuth: true
    }, 'https://apps.usw2.pure.cloud');
}

  // ✅ Listen for events from softphone
  window.addEventListener('message', function (event) {

    if (!event.origin.includes('pure.cloud')) return;

    const data = event.data;

    if (!data || !data.type) return;

    console.log("Softphone Event:", data.type);

    if (data.type === 'purecloud-auth-ready') {
      sendConfigToSoftphone();
    }

    if (data.type === 'purecloud-ready') {
      console.log("✅ Softphone ready");
    }

  });

})();
