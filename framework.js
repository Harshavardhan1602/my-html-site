// Load Genesys Framework
(function () {
  const script = document.createElement("script");
  script.src = "https://apps.usw2.pure.cloud/crm/embeddableFramework.js";
  script.async = true;
  document.head.appendChild(script);
})();

// Toggle Softphone Widget
function toggleSoftphone() {
  const widget = document.getElementById("softphoneWidget");

  if (widget.style.display === "flex") {
    widget.style.display = "none";
  } else {
    widget.style.display = "flex";
  }
}
