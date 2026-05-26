const genesysConfig = {
    clientId: "226182a8-bb53-435b-bc3c-2140f077768f",
    environment: "usw2.pure.cloud"
};

document.addEventListener("DOMContentLoaded", () => {

    console.log("✅ Cognizant CRM Dashboard Loaded");

    const iframe = document.getElementById("softphone");

    iframe.addEventListener("load", () => {
        console.log("📞 Softphone Loaded");

        iframe.contentWindow.postMessage(
            {
                type: "genesys:init",
                clientId: genesysConfig.clientId,
                environment: genesysConfig.environment
            },
            "https://apps.usw2.pure.cloud"
        );
    });
});
