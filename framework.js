// Genesys Embeddable Framework Loader
(function () {
  const script = document.createElement("script");
  script.src = "https://apps.usw2.pure.cloud/crm/embeddableFramework.js";
  script.async = true;

  script.onload = function () {
    console.log("Genesys Embeddable Framework Loaded");
  };

  document.head.appendChild(script);
})();
``
