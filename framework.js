/* ════════════════════════════════════════
   GENESYS CONFIG
════════════════════════════════════════ */
const GS = {
  clientId : "226182a8-bb53-435b-bc3c-2140f077768f",
  region   : "usw2.pure.cloud",
  iframeUrl: "https://apps.usw2.pure.cloud/crm/embeddableFramework.html"
};

/* ════════════════════════════════════════
   ORBIT NODES
════════════════════════════════════════ */
const NODES = [
  { label:"Sales",     cls:"sales",    angle:0,
    svg:'<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>' },
  { label:"Service",   cls:"service",  angle:45,
    svg:'<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' },
  { label:"Marketing", cls:"mkt",      angle:90,
    svg:'<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>' },
  { label:"Commerce",  cls:"commerce", angle:135,
    svg:'<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>' },
  { label:"Tableau",   cls:"tableau",  angle:180,
    svg:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>' },
  { label:"MuleSoft",  cls:"mule",     angle:225,
    svg:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>' },
  { label:"Platform",  cls:"platform", angle:270,
    svg:'<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>' },
  { label:"Slack",     cls:"slack",    angle:315,
    svg:'<path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"/><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"/><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"/><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"/><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"/>' },
  { label:"Success",   cls:"success",  angle:337,
    svg:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
  { label:"Partners",  cls:"partners", angle:23,
    svg:'<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>' },
  { label:"Net Zero",  cls:"netzero",  angle:203,
    svg:'<polygon points="3 11 22 2 13 21 11 13 3 11"/>' },
  { label:"Industries",cls:"industry", angle:248,
    svg:'<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>' },
];

function buildOrbit(){
  const wrap = document.getElementById('orbitWrap');
  const R = 155; // orbit radius in px, relative to center of wrap (215px)
  const cx = 215, cy = 215; // center of wrap

  NODES.forEach(n => {
    const rad = (n.angle - 90) * Math.PI / 180;
    const nx = cx + R * Math.cos(rad);
    const ny = cy + R * Math.sin(rad);

    const div = document.createElement('div');
    div.className = 'o-node';
    div.style.setProperty('--nx', nx + 'px');
    div.style.setProperty('--ny', ny + 'px');
    div.innerHTML = `
      <div class="o-icon ${n.cls}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
             stroke-linecap="round" stroke-linejoin="round">${n.svg}</svg>
      </div>
      <span>${n.label}</span>`;
    wrap.appendChild(div);
  });
}
buildOrbit();

/* ════════════════════════════════════════
   SOFTPHONE PANEL LOGIC
════════════════════════════════════════ */
const panel   = document.getElementById('gsPanel');
const fab     = document.getElementById('phoneFab');
const closeB  = document.getElementById('gsClose');
const iframe  = document.getElementById('gsIframe');
const toast   = document.getElementById('toast');
let open = false;

function openPanel(){
  panel.classList.remove('hide');
  open = true;
  if(!iframe.src || iframe.src === 'about:blank' || iframe.src === window.location.href){
    iframe.src = GS.iframeUrl;
  }
  fab.setAttribute('aria-expanded','true');
}
function closePanel(){
  panel.classList.add('hide');
  open = false;
  fab.setAttribute('aria-expanded','false');
}
function togglePanel(){ open ? closePanel() : openPanel(); }

fab.addEventListener('click', togglePanel);
closeB.addEventListener('click', function(e){ e.stopPropagation(); closePanel(); });

/* Toast */
function showToast(msg, dur){
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=>{ toast.style.opacity = '0'; }, dur || 3500);
}

/* PostMessage from Genesys */
window.addEventListener('message', function(e){
  const ok = 'https://apps.' + GS.region;
  if(!e.origin.startsWith(ok)) return;
  const m = e.data;
  if(!m || typeof m !== 'object') return;
  const act = m.action || m.type || '';
  if(act === 'INTERACTION_STARTED'){ openPanel(); showToast('📞 Incoming call – Softphone open'); }
  if(act === 'INTERACTION_ENDED')  { showToast('Call ended'); }
  if(act === 'AUTHENTICATED')      { showToast('Genesys: Signed in ✓'); }
});

/* Keyboard shortcut Alt+P */
document.addEventListener('keydown', function(e){
  if(e.altKey && e.key.toLowerCase() === 'p'){ e.preventDefault(); togglePanel(); }
});

/* Expose API */
window.CognizantCRM = { softphone:{ open:openPanel, close:closePanel, toggle:togglePanel, config:GS } };

console.log('%c[Cognizant CRM] Genesys Softphone ready','color:#1565C0;font-weight:bold',
  '\nClient ID:', GS.clientId, '\nRegion:', GS.region);
