(function () {

  window.addEventListener("message", function (event) {

    if (!event.origin.includes("pure.cloud")) return;

    console.log("📩 Genesys Event:", event.data);

    if (event.data.type === "purecloud-ready") {
      console.log("✅ Softphone Loaded Successfully");
    }

  });

})();
