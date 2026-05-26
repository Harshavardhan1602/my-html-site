document.addEventListener("DOMContentLoaded", function () {
    
    // ====================================================================
    // CONFIGURATION BLOCK: UPDATED WITH YOUR GENESYS CLOUD DETAILS
    // ====================================================================
    const CONFIG = {
        clientId: '226182a8-bb53-435b-bc3c-2140f077768f',
        region: 'usw2.pure.cloud',
        iframeBaseUrl: 'https://apps.usw2.pure.cloud/crm/embeddableFramework.html'
    };
    // ====================================================================
 
    /**
     * Initializes and constructs the Genesys Cloud Framework Embedded client configuration.
     */
    function initSoftphone() {
        const iframeElement = document.getElementById('genesys-softphone');
        
        if (!iframeElement) {
            console.error("Softphone iframe container element was not detected in the DOM.");
            return;
        }
 
        // Standard operational query parameter payload required by Genesys Cloud
        const queryParams = new URLSearchParams({
            pcOrigin: window.location.origin,
            clientId: CONFIG.clientId,
            environment: CONFIG.region
        });
 
        // Assemble the full uniform resource locator string securely
        const finalIframeUrl = `${CONFIG.iframeBaseUrl}?${queryParams.toString()}`;
        
        // Apply target destination source safely to the markup frame
        iframeElement.src = finalIframeUrl;
        console.log("Genesys Cloud softphone integrated cleanly. Target endpoint:", finalIframeUrl);
    }
 
    // Initialize integration
    initSoftphone();
});
