const clientId = "226182a8-bb53-435b-bc3c-2140f077768f";
const region = "usw2.pure.cloud";

const genesysUrl = "https://apps.usw2.pure.cloud/crm/index.html?crm=framework-local-secure";

// Load iframe
function loadSoftphone() {
    const frame = document.getElementById("genesysFrame");

    // Prevent reload loop
    if (!frame.src) {
        frame.src = genesysUrl;
    }

    console.log("✅ Softphone iframe loaded");
}

// Auto-load
window.addEventListener("load", () => {
    loadSoftphone();
});
