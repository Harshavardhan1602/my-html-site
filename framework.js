// Genesys Config
const genesysConfig = {
    clientId: "226182a8-bb53-435b-bc3c-2140f077768f",
    environment: "usw2.pure.cloud"
};

// Section Navigation
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');

    sections.forEach(section => {
        section.classList.remove('active');
    });

    document.getElementById(sectionId).classList.add('active');
}

// Initial Load
document.addEventListener("DOMContentLoaded", () => {
    console.log("CRM Loaded");
    console.log("Genesys Config:", genesysConfig);
});
