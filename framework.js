(function () {

  const CLIENT_ID = "226182a8-bb53-435b-bc3c-2140f077768f";
  const ENV = "usw2.pure.cloud";

  const iframe = document.getElementById("softphone");

  // ✅ Listen to Genesys messages
  window.addEventListener("message", function (event) {

    // ✅ allow only Genesys domains
    if (!event.origin.includes("pure.cloud")) return;

    console.log("📩 Message from Genesys:", event.data);

    const data = event.data;

    // ✅ IMPORTANT HANDSHAKE
    if (data && data.type === "purecloud-auth-ready") {

      console.log("✅ Sending auth config...");

      iframe.contentWindow.postMessage({
        type: "purecloud-auth-config",
        clientId: CLIENT_ID,
        environment: ENV,
        redirectUri: window.location.href,
        usePopupAuth: true
      }, "https://apps.usw2.pure.cloud");
    }

    if (data && data.type === "purecloud-ready") {
      console.log("✅ Softphone READY ✅");
    }

  });

})();
