<script>
// ── Genesys Config ──────────────────────────────────────
const genesysConfig = {
  clientId: "226182a8-bb53-435b-bc3c-2140f077768f",
  environment: "usw2.pure.cloud"
};

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Cognizant CRM Loaded");
  console.log("⚙️ Genesys Config:", genesysConfig);

  // ── Tabs ──
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // ── Softphone iframe ──
  const iframe = document.getElementById("softphone");
  if (iframe) {
    iframe.addEventListener("load", () => {
      console.log("📞 Softphone loaded");
      try {
        iframe.contentWindow.postMessage(
          { type: "genesys:init", clientId: genesysConfig.clientId, environment: genesysConfig.environment },
          "https://apps." + genesysConfig.environment
        );
      } catch(e) {
        console.info("ℹ️ Cross-origin (expected):", e.message);
      }
    });
    window.addEventListener("message", e => {
      if (e.origin.includes("pure.cloud")) console.log("📨 Genesys:", e.data);
    });
  }

  // ── Search ──
  const searchInput = document.getElementById("searchInput");
  const searchBtn   = document.getElementById("searchBtn");
  const doSearch = () => {
    const q = searchInput.value.trim();
    if (q) console.log("🔍 Search:", q);
  };
  searchBtn.addEventListener("click", doSearch);
  searchInput.addEventListener("keydown", e => { if(e.key==="Enter") doSearch(); });

  // ── Buttons ──
  document.getElementById("learnMoreBtn").addEventListener("click", () => console.log("▶ Learn More"));
  document.getElementById("demoBtn").addEventListener("click", () => console.log("▶ View Demo"));
});
</script>

</body>
</html>
