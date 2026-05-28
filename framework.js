/* ============================================================
   Cognizant CRM — script.js
   ============================================================ */

'use strict';

/* ── DATA ── */
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
    { id:'k5',  title:'DataBridge API Layer v2',    client:'DataBridge Corp',  priority:'high',   due:'Jul 28', assignees:['AP','MK'] },
    { id:'k6',  title:'HealthPulse Patient Portal', client:'HealthPulse IT',   priority:'high',   due:'Aug 05', assignees:['AB','PS'] },
    { id:'k7',  title:'CloudSync Integration',      client:'TechNova Inc.',    priority:'medium', due:'Aug 18', assignees:['RM'] },
    { id:'k8',  title:'Fraud Detection ML Model',   client:'Orbis Finance',    priority:'high',   due:'Aug 22', assignees:['DI','KR','VK'] },
    { id:'k9',  title:'Compliance Dashboard',       client:'Meridian Group',   priority:'medium', due:'Sep 08', assignees:['AB'] }
  ],
  testing: [
    { id:'k10', title:'Security Patch Suite v4',  client:'SecureAxis',     priority:'high',   due:'Jul 25', assignees:['PS'] },
    { id:'k11', title:'NexGen Web Platform',      client:'NexGen Digital', priority:'medium', due:'Jul 30', assignees:['MK','RM'] },
    { id:'k12', title:'Project Apex Analytics',   client:'Stratogen Corp', priority:'medium', due:'Aug 04', assignees:['AB','DI'] },
    { id:'k13', title:'Mobile CRM App',           client:'TechNova Inc.',  priority:'low',    due:'Aug 12', assignees:['KR'] }
  ],
  delivered: [
    { id:'k14', title:'SAP S/4HANA Upgrade',       client:'FusionSAP',         priority:'high',   due:'Jun 30', assignees:['DI'] },
    { id:'k15', title:'Zero Trust Architecture',   client:'Meridian Group',    priority:'high',   due:'Jun 25', assignees:['VK','PS'] },
    { id:'k16', title:'Predictive Analytics PoC',  client:'DataBridge Corp',   priority:'low',    due:'Jun 15', assignees:['AP'] },
    { id:'k17', title:'Multi-Cloud Strategy Plan', client:'CloudNine Systems', priority:'medium', due:'Jun 10', assignees:['RM','KR'] },
    { id:'k18', title:'Digital Onboarding Suite',  client:'NexGen Digital',    priority:'medium', due:'May 28', assignees:['AB'] }
  ]
};

/* ── UTILITIES ── */
function getInitials(first, last) {
  return ((first?.[0] || '') + (last?.[0] || '')).toUpperCase();
}
function getAvatarStyle(str) {
  let hash = 0;
  for (const c of str) hash = ((hash << 5) - hash) + c.charCodeAt(0);
  const [bg, color] = AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  return 'background:' + bg + ';color:' + color;
}
function formatDate(isoStr) {
  return new Date(isoStr).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}
function escapeHtml(str) {
  const map = { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' };
  return String(str).replace(/[&<>"']/g, m => map[m]);
}

/* ── DATE IN TOPBAR ── */
(function() {
  const el = document.getElementById('currentDate');
  if (el) el.textContent = new Date().toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'long', year:'numeric' });
})();

/* ── SIDEBAR ── */
const sidebar       = document.getElementById('sidebar');
const mainContent   = document.getElementById('mainContent');
const sidebarToggle = document.getElementById('sidebarToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');

function isMobile() { return window.innerWidth < 769; }

sidebarToggle.addEventListener('click', function() {
  if (isMobile()) return;
  sidebar.classList.toggle('collapsed');
  document.body.classList.toggle('sidebar-collapsed');
});
mobileMenuBtn.addEventListener('click', function() {
  document.body.classList.toggle('mobile-open');
});
document.addEventListener('click', function(e) {
  if (isMobile() && document.body.classList.contains('mobile-open')) {
    if (!sidebar.contains(e.target) && e.target !== mobileMenuBtn) {
      document.body.classList.remove('mobile-open');
    }
  }
});

/* ── SECTION NAVIGATION ── */
const navItems       = document.querySelectorAll('.nav-item[data-section]');
const sections       = document.querySelectorAll('.content-section');
const breadcrumbText = document.getElementById('breadcrumbText');

const SECTION_LABELS = {
  dashboard:'Dashboard', clients:'Clients', projects:'Projects',
  tickets:'Support Tickets', analytics:'Analytics', settings:'Settings'
};

function switchSection(sectionId) {
  sections.forEach(function(s) { s.classList.remove('active'); });
  navItems.forEach(function(n) { n.classList.remove('active'); });
  var target = document.getElementById('section-' + sectionId);
  if (target) target.classList.add('active');
  var navItem = document.querySelector('.nav-item[data-section="' + sectionId + '"]');
  if (navItem) navItem.classList.add('active');
  if (breadcrumbText) breadcrumbText.textContent = SECTION_LABELS[sectionId] || sectionId;
  if (sectionId === 'clients')  renderClientTable();
  if (sectionId === 'projects') renderKanban();
  if (isMobile()) document.body.classList.remove('mobile-open');
  mainContent.scrollTo({ top:0, behavior:'smooth' });
}

navItems.forEach(function(item) {
  item.addEventListener('click', function() { switchSection(item.dataset.section); });
});

document.getElementById('goToProjects').addEventListener('click', function() { switchSection('projects'); });

document.querySelectorAll('.chart-tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.chart-tab').forEach(function(t) { t.classList.remove('active'); });
    tab.classList.add('active');
  });
});

/* ── CLIENT TABLE ── */
var filteredClients = clientData.slice();
var searchTerm  = '';
var filterStatus = '';

function renderClientTable() {
  var tbody   = document.getElementById('clientTableBody');
  var countEl = document.getElementById('tableCount');
  if (!tbody) return;
  filteredClients = clientData.filter(function(c) {
    var fullName = (c.firstName + ' ' + c.lastName).toLowerCase();
    var matchSearch = !searchTerm || fullName.includes(searchTerm) ||
      c.company.toLowerCase().includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm) ||
      c.sector.toLowerCase().includes(searchTerm);
    return matchSearch && (!filterStatus || c.status === filterStatus);
  });
  tbody.innerHTML = filteredClients.length === 0
    ? '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-muted);font-size:14px;">No clients found.</td></tr>'
    : filteredClients.map(buildClientRow).join('');
  if (countEl) countEl.textContent = 'Showing ' + filteredClients.length + ' of ' + clientData.length + ' clients';
  tbody.querySelectorAll('.action-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) { e.stopPropagation(); handleClientAction(Number(btn.dataset.id)); });
  });
}

function buildClientRow(c) {
  var initials    = getInitials(c.firstName, c.lastName);
  var avatarStyle = getAvatarStyle(c.company);
  var statusLabel = c.status.charAt(0).toUpperCase() + c.status.slice(1);
  return '<tr data-client-id="' + c.id + '">' +
    '<td class="th-check"><input type="checkbox"/></td>' +
    '<td><div class="client-name-cell"><div class="client-avatar-sm" style="' + avatarStyle + '">' + escapeHtml(initials) + '</div>' +
    '<div><div class="client-full-name">' + escapeHtml(c.firstName) + ' ' + escapeHtml(c.lastName) + '</div>' +
    '<div class="client-email">' + escapeHtml(c.email) + '</div></div></div></td>' +
    '<td>' + escapeHtml(c.company) + '</td>' +
    '<td style="color:var(--text-secondary);font-size:13px">' + escapeHtml(c.sector) + '</td>' +
    '<td><span class="status-badge ' + escapeHtml(c.status) + '">' + escapeHtml(statusLabel) + '</span></td>' +
    '<td style="font-size:13px;color:var(--text-secondary)">' + formatDate(c.joined) + '</td>' +
    '<td><button class="action-btn" data-id="' + c.id + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>View</button></td>' +
    '</tr>';
}

function handleClientAction(id) {
  var c = clientData.find(function(x) { return x.id === id; });
  if (c) showToast('Viewing ' + c.firstName + ' ' + c.lastName + ' — ' + c.company);
}

document.getElementById('clientSearch').addEventListener('input', function(e) {
  searchTerm = e.target.value.trim().toLowerCase(); renderClientTable();
});
document.getElementById('statusFilter').addEventListener('change', function(e) {
  filterStatus = e.target.value; renderClientTable();
});

/* ── KANBAN ── */
var STAGE_LABELS = { discovery:'Discovery', development:'Development', testing:'Testing', delivered:'Delivered' };

function renderKanban() {
  var board = document.getElementById('kanbanBoard');
  if (!board || board.dataset.rendered === 'true') return;
  board.innerHTML = Object.entries(KANBAN_DATA).map(function(entry) {
    var stage = entry[0], cards = entry[1];
    return '<div class="kanban-col" data-stage="' + stage + '">' +
      '<div class="kanban-col-header"><span class="kanban-col-title">' + STAGE_LABELS[stage] + '</span>' +
      '<span class="kanban-count">' + cards.length + '</span></div>' +
      '<div class="kanban-cards">' + cards.map(buildKanbanCard).join('') + '</div></div>';
  }).join('');
  board.dataset.rendered = 'true';
  board.querySelectorAll('.kanban-card').forEach(function(card) {
    card.addEventListener('click', function() {
      var title  = card.querySelector('.kanban-card-title') ? card.querySelector('.kanban-card-title').textContent : '';
      var client = card.querySelector('.kanban-card-client') ? card.querySelector('.kanban-card-client').textContent : '';
      showToast('Opened: ' + title + ' (' + client.replace('Client: ', '') + ')');
    });
  });
}

function buildKanbanCard(card) {
  var priorityLabel = card.priority.charAt(0).toUpperCase() + card.priority.slice(1);
  var avatarsHtml   = card.assignees.slice(0,3).map(function(a) {
    return '<div class="kanban-assignee" style="' + getAvatarStyle(a) + '" title="' + a + '">' + escapeHtml(a) + '</div>';
  }).join('');
  return '<article class="kanban-card" tabindex="0" role="button">' +
    '<div class="kanban-card-title">' + escapeHtml(card.title) + '</div>' +
    '<div class="kanban-card-client">Client: ' + escapeHtml(card.client) + '</div>' +
    '<div class="kanban-card-meta">' +
    '<span class="kanban-priority priority-' + card.priority + '">' + escapeHtml(priorityLabel) + '</span>' +
    '<span class="kanban-due"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' + escapeHtml(card.due) + '</span>' +
    '<div class="kanban-assignees">' + avatarsHtml + '</div></div></article>';
}

document.getElementById('kanbanBoard').addEventListener('keydown', function(e) {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('kanban-card')) {
    e.preventDefault(); e.target.click();
  }
});

/* ── ADD CLIENT MODAL ── */
var modalOverlay  = document.getElementById('modalOverlay');
var addClientForm = document.getElementById('addClientForm');
var openAddClient = document.getElementById('openAddClient');
var modalClose    = document.getElementById('modalClose');
var cancelModal   = document.getElementById('cancelModal');

function openModal() {
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(function() { var f = addClientForm.querySelector('input,select,textarea'); if(f) f.focus(); }, 80);
}
function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
  addClientForm.reset();
  addClientForm.querySelectorAll('.error').forEach(function(el) { el.classList.remove('error'); });
  addClientForm.querySelectorAll('.field-error').forEach(function(el) { el.textContent = ''; });
}

openAddClient.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);
cancelModal.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', function(e) { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal(); });

/* ── FORM VALIDATION ── */
var VALIDATORS = {
  firstName:    { el:function(){return document.getElementById('firstName');},    err:function(){return document.getElementById('firstNameError');},    validate:function(v){ if(!v.trim()) return 'First name is required.'; if(v.trim().length<2) return 'At least 2 characters.'; return null; } },
  lastName:     { el:function(){return document.getElementById('lastName');},     err:function(){return document.getElementById('lastNameError');},     validate:function(v){ if(!v.trim()) return 'Last name is required.'; if(v.trim().length<2) return 'At least 2 characters.'; return null; } },
  companyName:  { el:function(){return document.getElementById('companyName');},  err:function(){return document.getElementById('companyNameError');},  validate:function(v){ if(!v.trim()) return 'Company is required.'; return null; } },
  email:        { el:function(){return document.getElementById('email');},        err:function(){return document.getElementById('emailError');},        validate:function(v){ if(!v.trim()) return 'Email is required.'; if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Enter a valid email.'; return null; } },
  sector:       { el:function(){return document.getElementById('sector');},       err:function(){return document.getElementById('sectorError');},       validate:function(v){ if(!v) return 'Select a sector.'; return null; } },
  clientStatus: { el:function(){return document.getElementById('clientStatus');}, err:function(){return document.getElementById('clientStatusError');}, validate:function(v){ if(!v) return 'Select a status.'; return null; } }
};

function validateField(key) {
  var def = VALIDATORS[key], input = def.el(), errEl = def.err(), error = def.validate(input.value);
  if (error) { input.classList.add('error'); errEl.textContent = error; return false; }
  input.classList.remove('error'); errEl.textContent = ''; return true;
}

Object.keys(VALIDATORS).forEach(function(key) {
  var input = VALIDATORS[key].el();
  if (input) {
    input.addEventListener('blur', function() { validateField(key); });
    input.addEventListener('input', function() { if (input.classList.contains('error')) validateField(key); });
  }
});

addClientForm.addEventListener('submit', function(e) {
  e.preventDefault();
  var isValid = true;
  Object.keys(VALIDATORS).forEach(function(k) { if (!validateField(k)) isValid = false; });
  if (!isValid) return;
  var newClient = {
    id: nextClientId++,
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
  var row = document.querySelector('tr[data-client-id="' + newClient.id + '"]');
  if (row) {
    row.style.background  = 'var(--accent-light)';
    row.style.transition  = 'background 1.2s ease';
    requestAnimationFrame(function() { requestAnimationFrame(function() { row.style.background = ''; }); });
  }
  var metEl = document.getElementById('metricClients');
  if (metEl) {
    metEl.textContent     = clientData.length;
    metEl.style.transform = 'scale(1.15)';
    metEl.style.transition = 'transform 0.3s';
    setTimeout(function() { metEl.style.transform = 'scale(1)'; }, 320);
  }
  closeModal();
  showToast(newClient.firstName + ' ' + newClient.lastName + ' added successfully!');
});

/* ── TOAST ── */
var toastTimer = null;
function showToast(message, duration) {
  duration = duration || 3200;
  var toast    = document.getElementById('toast');
  var toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;
  toastMsg.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() { toast.classList.remove('show'); }, duration);
}

/* ── PIPELINE BAR ANIMATION ── */
function animatePipelineBars() {
  var fills = document.querySelectorAll('.pipeline-fill');
  if (!fills.length) return;
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target, w = el.style.width;
        el.style.width = '0%';
        requestAnimationFrame(function() { requestAnimationFrame(function() { el.style.width = w; }); });
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.2 });
  fills.forEach(function(f) { observer.observe(f); });
}

/* ── METRIC COUNTER ANIMATION ── */
function animateCounters() {
  document.querySelectorAll('.metric-value').forEach(function(el) {
    var raw    = el.textContent.trim();
    var prefix = (raw.match(/^[^\d]*/) || [''])[0];
    var suffix = (raw.match(/[^\d.]+$/) || [''])[0];
    var numStr = raw.replace(prefix,'').replace(suffix,'');
    if (!numStr || isNaN(numStr)) return;
    var target = parseFloat(numStr), isDec = numStr.includes('.');
    var step   = 0;
    var iv = setInterval(function() {
      step++;
      var ease = 1 - Math.pow(1 - step/40, 3);
      el.textContent = prefix + (isDec ? (target*ease).toFixed(1) : Math.round(target*ease)) + suffix;
      if (step >= 40) { clearInterval(iv); el.textContent = raw; }
    }, 25);
  });
}

/* ── INIT ── */
(function init() {
  animatePipelineBars();
  animateCounters();

  var _origSwitch = switchSection;
  window.switchSection = function(id) {
    _origSwitch(id);
    if (id === 'dashboard') setTimeout(animatePipelineBars, 100);
  };

  var hash = window.location.hash.replace('#','');
  if (hash && SECTION_LABELS[hash]) switchSection(hash);
})();

/* ════════════════════════════════════════════════════════════
   GENESYS CLOUD SOFTPHONE — EMBEDDED IN DASHBOARD
   
   The iframe (id="spDashIframe") lives in the dashboard right
   column. Its src is set here with the TWO required params:
     ?clientId=...  &gcHostOrigin=...
   Without these Genesys returns 403 host_not_allowed.

   Prerequisites in Genesys Admin (must be done once):
   1. Admin → Account Settings → Org Settings → Settings tab
      → Security & Compliance → Allow Embeddable Domain(s)
      → Add: https://harshavardhan1602.github.io
   2. Admin → Integrations → OAuth → Client 226182a8...
      → Authorized Redirect URIs → Add the same URL
   ════════════════════════════════════════════════════════════ */
(function initGenesys() {

  var CLIENT_ID = '226182a8-bb53-435b-bc3c-2140f077768f';
  var GC_ENV    = 'usw2.pure.cloud';

  /* Use the runtime origin so it works on any host
     (GitHub Pages, local dev, etc.) */
  var HOST_ORIGIN = (window.location.origin && window.location.origin !== 'null')
                  ? window.location.origin
                  : 'https://harshavardhan1602.github.io';

  /* Build the correct Genesys URL — both params required */
  var GENESYS_URL = 'https://apps.' + GC_ENV + '/crm/embeddableFramework.html'
                  + '?clientId='     + CLIENT_ID
                  + '&gcHostOrigin=' + encodeURIComponent(HOST_ORIGIN);

  var iframe = document.getElementById('spDashIframe');
  var dot    = document.getElementById('spDashDot');

  if (!iframe) return; /* safety check */

  /* Set dot helper */
  function setDot(state) {
    if (!dot) return;
    dot.className = 'sp-status-dot' + (state ? ' ' + state : '');
  }

  /* ── Step 1: inject correct URL immediately on page load ──
     iframe src="" in HTML prevents premature load of wrong URL */
  setDot('connecting');
  iframe.src = GENESYS_URL;

  /* ── Step 2: hide connecting state after first real load ── */
  var loadCount = 0;
  iframe.addEventListener('load', function() {
    loadCount++;
    if (loadCount === 1) {
      /* First load: Genesys main page. May redirect to OAuth next. */
      setDot('connecting');
    } else {
      /* Subsequent: post-OAuth redirect back — nearly ready */
      setDot('connecting');
    }
    /* Send config message so Genesys knows our clientId */
    try {
      iframe.contentWindow.postMessage(
        { type: 'purecloud-cti-config', clientId: CLIENT_ID, region: GC_ENV },
        'https://apps.' + GC_ENV
      );
    } catch(e) { /* cross-origin — expected, Genesys handles auth itself */ }
  });

  /* ── Step 3: listen for status events from Genesys iframe ── */
  window.addEventListener('message', function(ev) {
    /* Only trust messages from Genesys domains */
    if (!ev.origin) return;
    if (ev.origin.indexOf('pure.cloud')      === -1 &&
        ev.origin.indexOf('mypurecloud.com') === -1) return;

    var data = ev.data || {};
    var type = (typeof data === 'string'
               ? data
               : (data.type || data.action || data.name || '')).toLowerCase();

    /* Connected / authenticated */
    if (type.indexOf('ready')         !== -1 ||
        type.indexOf('authenticated') !== -1 ||
        type.indexOf('connected')     !== -1) {
      setDot('connected');

    /* Incoming / active call */
    } else if (type.indexOf('ringing')    !== -1 ||
               type.indexOf('alerting')   !== -1 ||
               type.indexOf('call.start') !== -1 ||
               type.indexOf('incoming')   !== -1) {
      setDot('connected');
      showToast('📞 Incoming call — Genesys Cloud');

    /* Call ended */
    } else if (type.indexOf('call.end')     !== -1 ||
               type.indexOf('disconnected') !== -1) {
      setDot('connected');
      showToast('Call ended');

    /* Logged out / error */
    } else if (type.indexOf('logout') !== -1 ||
               type.indexOf('error')  !== -1) {
      setDot('');
    }
  });

})();
