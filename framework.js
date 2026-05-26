// Genesys configuration
const genesysConfig = {
    clientId: "226182a8-bb53-435b-bc3c-2140f077768f",
    environment: "usw2.pure.cloud"
};

document.addEventListener("DOMContentLoaded", () => {
    console.log("Cognizant CRM Loaded ✅");
    console.log("Genesys Config:", genesysConfig);

    // Tab switching
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
        });
    });

    // Softphone iframe — inject client ID via postMessage once loaded
    const softphoneFrame = document.getElementById("softphone");
    if (softphoneFrame) {
        softphoneFrame.addEventListener("load", () => {
            try {
                softphoneFrame.contentWindow.postMessage(
                    { type: "genesys:config", config: genesysConfig },
                    `https://apps.${genesysConfig.environment}`
                );
                console.log("Genesys config posted to softphone iframe ✅");
            } catch (e) {
                console.warn("Could not post message to softphone (cross-origin):", e.message);
            }
        });
    }

    // CTA button
    const ctaBtn = document.querySelector(".cta-btn");
    if (ctaBtn) {
        ctaBtn.addEventListener("click", () => {
            console.log("Learn More clicked");
            // Add navigation logic here
        });
    }
});
