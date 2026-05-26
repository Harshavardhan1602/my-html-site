(function () {

  const CONFIG = {
    clientId: "226182a8-bb53-435b-bc3c-2140f077768f",
    environment: "usw2.pure.cloud",
    redirectUri:https://apps.usw2.pure.cloud/crm/index.html
  };

  const iframe = document.getElementById("softphone");

  window.addEventListener("message", function (event) {

    if (event.origin !== "https://apps.usw2.pure.cloud") return;

    const msg = event.data;

    console.log("Genesys Event:", msg);

    // ✅ When Genesys asks for auth config
    if (msg.type === "purecloud-auth-ready") {

      iframe.contentWindow.postMessage({
        type: "purecloud-auth-config",
        clientId: CONFIG.clientId,
        environment: CONFIG.environment,
        redirectUri: CONFIG.redirectUri
      }, event.origin);
    }

    // ✅ Softphone ready
    if (msg.type === "purecloud-ready") {
      console.log("✅ Softphone connected successfully");
    }

  });

})();
``
