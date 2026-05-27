/* ============================================================
   Cognizant CRM — script.js
   Vanilla JS — No dependencies
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const AVATAR_COLORS = [
  ['#e8f1fb','#0066cc'], ['#e0f7f6','#0d9488'], ['#fef3c7','#d97706'],
  ['#fee2e2','#dc2626'], ['#ede9fe','#7c3aed'], ['#dcfce7','#16a34a'],
  ['#fce7f3','#db2777'], ['#fff7ed','#ea580c']
];

let clientData = [
  { id:1,  firstName:'Priya',   lastName:'Nair',     company:'TechNova Inc.',     sector:'Cloud Services',         status:'active',   joined:'2022-03-14', email:'p.nair@technova.io' },
  { id:2,  firstName:'Rajan',   lastName:'Mehta',    company:'Orbis Finance',     sector:'FinTech',                status:'active',   joined:'2021-11-02', email:'r.mehta@orbis.com' },
  { id:3,  firstName:'Sunita',  lastName:'Kapoor',   company:'Stratogen Corp',    sector:'AI & Analytics',         status:'active',   joined:'2023-01-18', email:'s.kapoor@stratogen.ai' },
  { id:4,  firstName:'Vikram',  lastName:'Sharma',   company:'Meridian Group',    sector:'Cybersecurity',          status:'lead',     joined:'2024-05-07', email:'v.sharma@meridian.co' },
  { id:5,  firstName:'Ananya',  lastName:'Bose',     company:'HealthPulse IT',    sector:'Healthcare IT',          status:'active',   joined:'2022-09-30', email:'a.bose@healthpulse.in' },
  { id:6,  firstName:'Deepak',  lastName:'Iyer',     company:'FusionSAP',         sector:'ERP & SAP',              status:'inactive', joined:'2020-06-25', email:'d.iyer@fusionsap.net' },
  { id:7,  firstName:'Kavitha', lastName:'Reddy',    company:'CloudNine Systems', sector:'Cloud Services',         status:'lead',     joined:'2024-07-11', email:'k.reddy@cloudnine.io' },
  { id:8,  firstName:'Arjun',   lastName:'Pillai',   company:'DataBridge Corp',   sector:'AI & Analytics',         status:'active',   joined:'2023-04-22', email:'a.pillai@databridge.com' },
  { id:9,  firstName:'Meena',   lastName:'Krishnan', company:'SecureAxis',        sector:'Cybersecurity',          status:'inactive', joined:'2019-12-10', email:'m.krishnan@secureaxis.io' },
  { id:10, firstName:'Rohit',   lastName:'Gupta',    company:'NexGen Digital',    sector:'Digital Transformation', status:'lead',     joined:'2024-09-01', email:'r.gupta@nexgen.io' }
];
let nextClientId = clientData.length + 1;

const KANBAN_DATA = {
  discovery: [
    { id:'k1',  title:'ERP Migration Assessment',    client:'FusionSAP',         priority:'high',   due:'Aug 10', assignees:['PS','KR'] },
    { id:'k2',  title:'AI Readiness Audit',          client:'Stratogen Corp',    priority:'medium', due:'Aug 20', assignees:['AB'] },
    { id:'k3',  title:'Network Architecture Review', client:'SecureAxis',        priority:'low',    due:'Sep 01', assignees:['DI','VK'] },
    { id:'k4',  title:'Cloud Cost Optimisation',     client:'CloudNine Systems', priority:'medium', due:'Sep 15', assignees:['KR'] }
  ],
  development: [
    { id:'k5',  title:'DataBridge API Layer v2',     client:'DataBridge Corp',   priority:'high',   due:'Jul 28', assignees:['AP','MK'] },
    { id:'k6',  title:'HealthPulse Patient Portal',  client:'HealthPulse IT',    priority:'high',   due:'Aug 05', assignees:['AB','PS'] },
    { id:'k7',  title:'CloudSync Integration',       client:'TechNova Inc.',     priority:'medium', due:'Aug 18', assignees:['RM'] },
    { id:'k8',  title:'Fraud Detection ML Model',    client:'Orbis Finance',     priority:'high',   due:'Aug 22', assignees:['DI','KR','VK'] },
    { id:'k9',  title:'Compliance Dashboard',        client:'Meridian Group',    priority:'medium', due:'Sep 08', assignees:['AB'] }
  ],
  testing: [
    { id:'k10', title:'Security Patch Suite v4',     client:'SecureAxis',        priority:'high',   due:'Jul 25', assignees:['PS'] },
    { id:'k11', title:'NexGen Web Platform',         client:'NexGen Digital',    priority:'medium', due:'Jul 30', assignees:['MK','RM'] },
    { id:'k12', title:'Project Apex Analytics',      client:'Stratogen Corp',    priority:'medium', due:'Aug 04', assignees:['AB','DI'] },
    { id:'k13', title:'Mobile CRM App',              client:'TechNova Inc.',     priority:'low',    due:'Aug 12', assignees:['KR'] }
  ],
  delivered: [
    { id:'k14', title:'SAP S/4HANA Upgrade',         client:'FusionSAP',        priority:'high',   due:'Jun 30', assignees:['DI'] },
    { id:'k15', title:'Zero Trust Architecture',     client:'Meridian Group',    priority:'high',   due:'Jun 25', assignees:['VK','PS'] },
    { id:'k16', title:'Predictive Analytics PoC',    client:'DataBridge Corp',   priority:'low',    due:'Jun 15', assignees:['AP'] },
    { id:'k17', title:'Multi-Cloud Strategy Plan',   client:'CloudNine Systems', priority:'medium', due:'Jun 10', assignees:['RM','KR'] },
    { id:'k18', title:'Digital Onboarding Suite',    client:'NexGen Digital',    priority:'medium', due:'May 28', assignees:['AB'] }
  ]
};

/* ─────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────── */
function getInitials(first, last) {
  return ((first?.[0] || '') + (last?.[0] || '')).toUpperCase();
}
function getAvatarStyle(str) {
  let hash = 0;
  for (const c of str) hash = ((hash << 5) - hash) + c.charCodeAt(0);
  const [bg, color] = AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  return `background:${bg};color:${color}`;
}
function formatDate(isoStr) {
  return new Date(isoStr).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}
function escapeHtml(str) {
  const map = { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' };
  return String(str).replace(/[&<>"']/g, m => map[m]);
}

/* ─────────────────────────────────────────────
   DATE IN TOPBAR
───────────────────────────────────────────── */
(function setCurrentDate() {
  const el = document.getElementById('currentDate');
  if (!el) return;
  el.textContent = new Date().toLocaleDateString('en-IN', {
    weekday:'short', day:'numeric', month:'long', year:'numeric'
  });
})();

/* ─────────────────────────────────────────────
   SIDEBAR TOGGLE
───────────────────────────────────────────── */
const sidebar       = document.getElementById('sidebar');
const mainContent   = document.getElementById('mainContent');
const sidebarToggle = document.getElementById('sidebarToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');

function isMobile() { return window.innerWidth < 769; }

sidebarToggle.addEventListener('click', () => {
  if (isMobile()) return;
  sidebar.classList.toggle('collapsed');
  document.body.classList.toggle('sidebar-collapsed');
});

mobileMenuBtn.addEventListener('click', () => {
  document.body.classList.toggle('mobile-open');
});

document.addEventListener('click', (e) => {
  if (isMobile() && document.body.classList.contains('mobile-open')) {
    if (!sidebar.contains(e.target) && e.target !== mobileMenuBtn) {
      document.body.classList.remove('mobile-open');
    }
  }
});

/* ─────────────────────────────────────────────
   SECTION NAVIGATION
───────────────────────────────────────────── */
const navItems       = document.querySelectorAll('.nav-item[data-section]');
const sections       = document.querySelectorAll('.content-section');
const breadcrumbText = document.getElementById('breadcrumbText');

const SECTION_LABELS = {
  dashboard: 'Dashboard',
  clients:   'Clients',
  projects:  'Projects',
  tickets:   'Support Tickets',
  analytics: 'Analytics',
  settings:  'Settings',
  softphone: 'Genesys Softphone'
};

function switchSection(sectionId) {
  sections.forEach(s => s.classList.remove('active'));
  navItems.forEach(n => n.classList.remove('active'));

  const target = document.getElementById(`section-${sectionId}`);
  if (target) target.classList.add('active');

  const navItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
  if (navItem) navItem.classList.add('active');

  if (breadcrumbText) breadcrumbText.textContent = SECTION_LABELS[sectionId] || sectionId;

  if (sectionId === 'clients')  renderClientTable();
  if (sectionId === 'projects') renderKanban();
  if (sectionId === 'dashboard') setTimeout(animatePipelineBars, 100);

  if (isMobile()) document.body.classList.remove('mobile-open');
  mainContent.scrollTo({ top: 0, behavior: 'smooth' });
}

navItems.forEach(item => {
  item.addEventListener('click', () => switchSection(item.dataset.section));
});

document.getElementById('goToProjects').addEventListener('click', () => switchSection('projects'));

document.querySelectorAll('.chart-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

/* ─────────────────────────────────────────────
   CLIENT TABLE
───────────────────────────────────────────── */
let filteredClients = [...clientData];
let searchTerm      = '';
let filterStatus    = '';

function renderClientTable() {
  const tbody   = document.getElementById('clientTableBody');
  const countEl = document.getElementById('tableCount');
  if (!tbody) return;

  filteredClients = clientData.filter(c => {
    const fullName   = `${c.firstName} ${c.lastName}`.toLowerCase();
    const matchSearch = !searchTerm ||
      fullName.includes(searchTerm) ||
      c.company.toLowerCase().includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm) ||
      c.sector.toLowerCase().includes(searchTerm);
    const matchStatus = !filterStatus || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (filteredClients.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-muted);font-size:14px;">No clients found matching your criteria.</td></tr>`;
  } else {
    tbody.innerHTML = filteredClients.map(c => buildClientRow(c)).join('');
  }

  if (countEl) countEl.textContent = `Showing ${filteredClients.length} of ${clientData.length} client${clientData.length !== 1 ? 's' : ''}`;

  tbody.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleClientAction(Number(btn.dataset.id));
    });
  });
}

function buildClientRow(c) {
  const initials    = getInitials(c.firstName, c.lastName);
  const avatarStyle = getAvatarStyle(c.company);
  const statusLabel = c.status.charAt(0).toUpperCase() + c.status.slice(1);
  return `
    <tr data-client-id="${c.id}">
      <td class="th-check"><input type="checkbox" aria-label="Select ${escapeHtml(c.firstName)}"/></td>
      <td>
        <div class="client-name-cell">
          <div class="client-avatar-sm" style="${avatarStyle}">${escapeHtml(initials)}</div>
          <div>
            <div class="client-full-name">${escapeHtml(c.firstName)} ${escapeHtml(c.lastName)}</div>
            <div class="client-email">${escapeHtml(c.email)}</div>
          </div>
        </div>
      </td>
      <td>${escapeHtml(c.company)}</td>
      <td style="color:var(--text-secondary);font-size:13px">${escapeHtml(c.sector)}</td>
      <td><span class="status-badge ${escapeHtml(c.status)}">${escapeHtml(statusLabel)}</span></td>
      <td style="font-size:13px;color:var(--text-secondary)">${formatDate(c.joined)}</td>
      <td><button class="action-btn" data-id="${c.id}" aria-label="View ${escapeHtml(c.firstName)} ${escapeHtml(c.lastName)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>View</button></td>
    </tr>`;
}

function handleClientAction(id) {
  const client = clientData.find(c => c.id === id);
  if (client) showToast(`Viewing ${client.firstName} ${client.lastName} — ${client.company}`);
}

document.getElementById('clientSearch').addEventListener('input', (e) => {
  searchTerm = e.target.value.trim().toLowerCase();
  renderClientTable();
});
document.getElementById('statusFilter').addEventListener('change', (e) => {
  filterStatus = e.target.value;
  renderClientTable();
});

/* ─────────────────────────────────────────────
   KANBAN BOARD
───────────────────────────────────────────── */
const STAGE_LABELS = { discovery:'Discovery', development:'Development', testing:'Testing', delivered:'Delivered' };

function renderKanban() {
  const board = document.getElementById('kanbanBoard');
  if (!board || board.dataset.rendered === 'true') return;

  board.innerHTML = Object.entries(KANBAN_DATA).map(([stage, cards]) => `
    <div class="kanban-col" data-stage="${stage}">
      <div class="kanban-col-header">
        <span class="kanban-col-title">${STAGE_LABELS[stage]}</span>
        <span class="kanban-count">${cards.length}</span>
      </div>
      <div class="kanban-cards">${cards.map(buildKanbanCard).join('')}</div>
    </div>
  `).join('');

  board.dataset.rendered = 'true';

  board.querySelectorAll('.kanban-card').forEach(card => {
    card.addEventListener('click', () => {
      const title  = card.querySelector('.kanban-card-title')?.textContent;
      const client = card.querySelector('.kanban-card-client')?.textContent;
      showToast(`Opened: ${title} (${client?.replace('Client: ', '')})`);
    });
  });
}

function buildKanbanCard(card) {
  const priorityClass = `priority-${card.priority}`;
  const priorityLabel = card.priority.charAt(0).toUpperCase() + card.priority.slice(1);
  const avatarsHtml   = card.assignees.slice(0, 3).map(a => {
    return `<div class="kanban-assignee" style="${getAvatarStyle(a)}" title="${a}">${escapeHtml(a)}</div>`;
  }).join('');
  return `
    <article class="kanban-card" tabindex="0" role="button" aria-label="${escapeHtml(card.title)}">
      <div class="kanban-card-title">${escapeHtml(card.title)}</div>
      <div class="kanban-card-client">Client: ${escapeHtml(card.client)}</div>
      <div class="kanban-card-meta">
        <span class="kanban-priority ${priorityClass}">${escapeHtml(priorityLabel)}</span>
        <span class="kanban-due">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          ${escapeHtml(card.due)}
        </span>
        <div class="kanban-assignees">${avatarsHtml}</div>
      </div>
    </article>`;
}

document.getElementById('kanbanBoard').addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('kanban-card')) {
    e.preventDefault();
    e.target.click();
  }
});

/* ─────────────────────────────────────────────
   ADD CLIENT MODAL
───────────────────────────────────────────── */
const modalOverlay  = document.getElementById('modalOverlay');
const addClientForm = document.getElementById('addClientForm');
const openAddClient = document.getElementById('openAddClient');
const modalClose    = document.getElementById('modalClose');
const cancelModal   = document.getElementById('cancelModal');

function openModal() {
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const firstInput = addClientForm.querySelector('input, select, textarea');
    if (firstInput) firstInput.focus();
  }, 80);
}
function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
  resetForm();
}
function resetForm() {
  addClientForm.reset();
  addClientForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  addClientForm.querySelectorAll('.field-error').forEach(el => (el.textContent = ''));
}

openAddClient.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);
cancelModal.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal(); });

/* ─────────────────────────────────────────────
   FORM VALIDATION
───────────────────────────────────────────── */
const VALIDATORS = {
  firstName:    { el:()=>document.getElementById('firstName'),    errEl:()=>document.getElementById('firstNameError'),    validate(v){ if(!v.trim()) return 'First name is required.'; if(v.trim().length<2) return 'Must be at least 2 characters.'; return null; } },
  lastName:     { el:()=>document.getElementById('lastName'),     errEl:()=>document.getElementById('lastNameError'),     validate(v){ if(!v.trim()) return 'Last name is required.'; if(v.trim().length<2) return 'Must be at least 2 characters.'; return null; } },
  companyName:  { el:()=>document.getElementById('companyName'),  errEl:()=>document.getElementById('companyNameError'),  validate(v){ if(!v.trim()) return 'Company name is required.'; if(v.trim().length<2) return 'Must be at least 2 characters.'; return null; } },
  email:        { el:()=>document.getElementById('email'),        errEl:()=>document.getElementById('emailError'),        validate(v){ if(!v.trim()) return 'Email address is required.'; if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Enter a valid email address.'; return null; } },
  sector:       { el:()=>document.getElementById('sector'),       errEl:()=>document.getElementById('sectorError'),       validate(v){ if(!v) return 'Please select a sector.'; return null; } },
  clientStatus: { el:()=>document.getElementById('clientStatus'), errEl:()=>document.getElementById('clientStatusError'), validate(v){ if(!v) return 'Please select a status.'; return null; } }
};

function validateField(key) {
  const def = VALIDATORS[key];
  const input = def.el(); const errEl = def.errEl();
  const error = def.validate(input.value);
  if (error) { input.classList.add('error'); errEl.textContent = error; return false; }
  input.classList.remove('error'); errEl.textContent = ''; return true;
}

Object.keys(VALIDATORS).forEach(key => {
  const input = VALIDATORS[key].el();
  if (input) {
    input.addEventListener('blur', () => validateField(key));
    input.addEventListener('input', () => { if (input.classList.contains('error')) validateField(key); });
  }
});

addClientForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let isValid = true;
  Object.keys(VALIDATORS).forEach(key => { if (!validateField(key)) isValid = false; });
  if (!isValid) return;

  const newClient = {
    id:        nextClientId++,
    firstName: document.getElementById('firstName').value.trim(),
    lastName:  document.getElementById('lastName').value.trim(),
    company:   document.getElementById('companyName').value.trim(),
    email:     document.getElementById('email').value.trim().toLowerCase(),
    sector:    document.getElementById('sector').value,
    status:    document.getElementById('clientStatus').value,
    joined:    new Date().toISOString().split('T')[0]
  };

  clientData.unshift(newClient);
  renderClientTable();

  const row = document.querySelector(`tr[data-client-id="${newClient.id}"]`);
  if (row) {
    row.style.background = 'var(--accent-light)';
    row.style.transition = 'background 1.2s ease';
    requestAnimationFrame(() => requestAnimationFrame(() => { row.style.background = ''; }));
  }

  const metEl = document.getElementById('metricClients');
  if (metEl) {
    metEl.textContent = clientData.length;
    metEl.style.transform = 'scale(1.15)'; metEl.style.transition = 'transform 0.3s';
    setTimeout(() => { metEl.style.transform = 'scale(1)'; }, 320);
  }

  closeModal();
  showToast(`${newClient.firstName} ${newClient.lastName} added successfully!`);
});

/* ─────────────────────────────────────────────
   TOAST
───────────────────────────────────────────── */
let toastTimer = null;
function showToast(message, duration = 3200) {
  const toast    = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;
  toastMsg.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

/* ─────────────────────────────────────────────
   PIPELINE BAR ANIMATION
───────────────────────────────────────────── */
function animatePipelineBars() {
  const fills = document.querySelectorAll('.pipeline-fill');
  if (!fills.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target, w = el.style.width;
        el.style.width = '0%';
        requestAnimationFrame(() => requestAnimationFrame(() => { el.style.width = w; }));
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.2 });
  fills.forEach(f => observer.observe(f));
}

/* ─────────────────────────────────────────────
   METRIC COUNTER ANIMATION
───────────────────────────────────────────── */
function animateCounters() {
  document.querySelectorAll('.metric-value').forEach(el => {
    const raw    = el.textContent.trim();
    const prefix = raw.match(/^[^\d]*/)?.[0] || '';
    const suffix = raw.match(/[^\d.]+$/)?.[0] || '';
    const numStr = raw.replace(prefix, '').replace(suffix, '');
    if (!numStr || isNaN(numStr)) return;
    const target = parseFloat(numStr), isDec = numStr.includes('.');
    const steps = 40, stepTime = 1000 / steps;
    let step = 0;
    const iv = setInterval(() => {
      step++;
      const ease = 1 - Math.pow(1 - step / steps, 3);
      el.textContent = prefix + (isDec ? (target * ease).toFixed(1) : Math.round(target * ease)) + suffix;
      if (step >= steps) { clearInterval(iv); el.textContent = raw; }
    }, stepTime);
  });
}

/* ─────────────────────────────────────────────
   INITIALISE CORE
───────────────────────────────────────────── */
(function init() {
  animatePipelineBars();
  animateCounters();

  const hash = window.location.hash.replace('#', '');
  if (hash && SECTION_LABELS[hash]) switchSection(hash);
})();


/* ═══════════════════════════════════════════════════════════════
   GENESYS CLOUD SOFTPHONE — INLINE DASHBOARD PANEL

   ROOT CAUSE OF "ALWAYS LOADING":
   1. The loader div had opacity:0 but was still covering the iframe
      (display:none must be set, not just opacity)
   2. Genesys embeddableFramework needs the EXACT origin registered
      in Admin → Integrations → Embeddable Framework → Allowed Origins
      If that's not set up, the framework loops silently.

   SOLUTION:
   - Remove loader completely after a short delay (display:none)
   - Use the correct URL — embeddableFramework with clientId
   - The iframe src is set on DOMContentLoaded (not inline)
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CLIENT_ID = '226182a8-bb53-435b-bc3c-2140f077768f';
  var GC_ENV    = 'usw2.pure.cloud';

  /* Use the EXACT origin that must match what's registered in
     Genesys Admin → Integrations → Embeddable Framework        */
  var HOST_ORIGIN = 'https://harshavardhan1602.github.io';

  /* If running on a different origin (local dev etc.), use actual origin */
  if (window.location.origin &&
      window.location.origin !== 'null' &&
      window.location.origin !== 'file://') {
    HOST_ORIGIN = window.location.origin;
  }

  var IFRAME_URL = 'https://apps.' + GC_ENV + '/crm/embeddableFramework.html'
                 + '?clientId='     + CLIENT_ID
                 + '&gcHostOrigin=' + encodeURIComponent(HOST_ORIGIN);

  var iframe = document.getElementById('dashSoftphone');
  var loader = document.getElementById('dashSpLoader');
  var dot    = document.getElementById('dashSpDot');

  if (!iframe) return;

  /* ── Set iframe src ── */
  iframe.src = IFRAME_URL;

  /* ── Completely remove the loader after 2.5s ──
     We use display:none (not just opacity) so the loader
     cannot block clicks or hover on the Genesys UI below. */
  function hideLoader() {
    if (!loader) return;
    loader.style.opacity = '0';
    setTimeout(function () {
      loader.style.display = 'none';
    }, 500);
  }

  /* Hide after 2.5s — enough for Genesys to render its login UI */
  setTimeout(hideLoader, 2500);

  /* Also hide immediately on first load event */
  iframe.addEventListener('load', function onFirstLoad() {
    iframe.removeEventListener('load', onFirstLoad);
    setTimeout(hideLoader, 800);
  });

  /* ── Status dot via postMessage ── */
  window.addEventListener('message', function (ev) {
    if (!ev.origin) return;
    if (ev.origin.indexOf('pure.cloud')      === -1 &&
        ev.origin.indexOf('mypurecloud.com') === -1) return;

    hideLoader(); /* hide loader the moment Genesys talks to us */

    var data = ev.data || {};
    var type = (typeof data === 'string'
               ? data
               : (data.type || data.action || data.name || '')).toLowerCase();

    if (!dot) return;

    if (type.indexOf('ready')         !== -1 ||
        type.indexOf('authenticated') !== -1 ||
        type.indexOf('connected')     !== -1) {
      dot.className = 'dash-sp-dot connected';

    } else if (type.indexOf('ringing')    !== -1 ||
               type.indexOf('alerting')   !== -1 ||
               type.indexOf('call.start') !== -1 ||
               type.indexOf('incoming')   !== -1) {
      dot.className = 'dash-sp-dot connected';
      showToast('📞 Incoming call — Genesys Cloud');

    } else if (type.indexOf('call.end')     !== -1 ||
               type.indexOf('disconnected') !== -1) {
      dot.className = 'dash-sp-dot connected';
      showToast('Call ended');

    } else if (type.indexOf('logout') !== -1) {
      dot.className = 'dash-sp-dot';
    }
  });

}());



