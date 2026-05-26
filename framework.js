// ============================================================
//  Cognizant CRM Solutions — Genesys Softphone Configuration
// ============================================================

// ✅ GENESYS IFRAME URL — Update here if region changes
var GENESYS_CONFIG = {
  iframeUrl: "https://apps.usw2.pure.cloud/crm/embeddableFramework.html",
  clientId:  "226182a8-bb53-435b-bc3c-2140f077768f",
  region:    "usw2.pure.cloud"
};

// -------------------------------------------------------
// Inject iframe src from config (single source of truth)
// -------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  var iframe = document.getElementById("genesysIframe");
  if (iframe) {
    iframe.src = GENESYS_CONFIG.iframeUrl;
  }
});

// -------------------------------------------------------
// Softphone Panel Toggle
// -------------------------------------------------------
var softphoneOpen = false;

function toggleSoftphone() {
  var panel   = document.getElementById("softphonePanel");
  var overlay = document.getElementById("softphoneOverlay");
  var btn     = document.getElementById("toggleSoftphone");

  softphoneOpen = !softphoneOpen;

  if (softphoneOpen) {
    panel.classList.add("open");
    overlay.classList.add("active");
    if (btn) btn.classList.add("active");
  } else {
    panel.classList.remove("open");
    overlay.classList.remove("active");
    if (btn) btn.classList.remove("active");
  }
}

// Close on Escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && softphoneOpen) {
    toggleSoftphone();
  }
});

// -------------------------------------------------------
// Sidebar active link
// -------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  var items = document.querySelectorAll(".sidebar-item");
  items.forEach(function (item) {
    item.addEventListener("click", function () {
      items.forEach(function (i) { i.classList.remove("active"); });
      this.classList.add("active");
    });
  });
});

// -------------------------------------------------------
// Nav active link
// -------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  var links = document.querySelectorAll(".nav-link");
  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      links.forEach(function (l) { l.classList.remove("active"); });
      this.classList.add("active");
    });
  });
});
