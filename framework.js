// Genesys Config
const clientId = document.querySelector('meta[name="client-id"]').content;
const region = document.querySelector('meta[name="region"]').content;

// Iframe URL (given)
const iframeUrl = "https://apps.usw2.pure.cloud/crm/index.html?crm=framework-local-secure";

// Login simulation
function login() {
  alert("Login successful ✅");

  console.log("Client ID:", clientId);
  console.log("Region:", region);

  // Load softphone automatically after login
  loadSoftphone();
}

// Toggle panel
function toggleSoftphone() {
  const container = document.getElementById("softphone-container");

  if (container.classList.contains("hidden")) {
    container.classList.remove("hidden");
    loadSoftphone();
  } else {
    container.classList.add("hidden");
  }
}

// Load iframe
function loadSoftphone() {
  const frame = document.getElementById("softphone-frame");

  if (!frame.src) {
    frame.src = iframeUrl;
  }
}
``
