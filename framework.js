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
  { id: 1,  firstName: 'Priya',    lastName: 'Nair',       company: 'TechNova Inc.',     sector: 'Cloud Services',        status: 'active',   joined: '2022-03-14', email: 'p.nair@technova.io' },
  { id: 2,  firstName: 'Rajan',    lastName: 'Mehta',      company: 'Orbis Finance',     sector: 'FinTech',               status: 'active',   joined: '2021-11-02', email: 'r.mehta@orbis.com' },
  { id: 3,  firstName: 'Sunita',   lastName: 'Kapoor',     company: 'Stratogen Corp',    sector: 'AI & Analytics',        status: 'active',   joined: '2023-01-18', email: 's.kapoor@stratogen.ai' },
  { id: 4,  firstName: 'Vikram',   lastName: 'Sharma',     company: 'Meridian Group',    sector: 'Cybersecurity',         status: 'lead',     joined: '2024-05-07', email: 'v.sharma@meridian.co' },
  { id: 5,  firstName: 'Ananya',   lastName: 'Bose',       company: 'HealthPulse IT',    sector: 'Healthcare IT',         status: 'active',   joined: '2022-09-30', email: 'a.bose@healthpulse.in' },
  { id: 6,  firstName: 'Deepak',   lastName: 'Iyer',       company: 'FusionSAP',         sector: 'ERP & SAP',             status: 'inactive', joined: '2020-06-25', email: 'd.iyer@fusionsap.net' },
  { id: 7,  firstName: 'Kavitha',  lastName: 'Reddy',      company: 'CloudNine Systems', sector: 'Cloud Services',        status: 'lead',     joined: '2024-07-11', email: 'k.reddy@cloudnine.io' },
  { id: 8,  firstName: 'Arjun',    lastName: 'Pillai',     company: 'DataBridge Corp',   sector: 'AI & Analytics',        status: 'active',   joined: '2023-04-22', email: 'a.pillai@databridge.com' },
  { id: 9,  firstName: 'Meena',    lastName: 'Krishnan',   company: 'SecureAxis',        sector: 'Cybersecurity',         status: 'inactive', joined: '2019-12-10', email: 'm.krishnan@secureaxis.io' },
  { id: 10, firstName: 'Rohit',    lastName: 'Gupta',      company: 'NexGen Digital',    sector: 'Digital Transformation',status: 'lead',     joined: '2024-09-01', email: 'r.gupta@nexgen.io' }
];

let nextClientId = clientData.length + 1;

const KANBAN_DATA = {
  discovery: [
    { id: 'k1',  title: 'ERP Migration Assessment',    client: 'FusionSAP',          priority: 'high',   due: 'Aug 10', assignees: ['PS','KR'] },
    { id: 'k2',  title: 'AI Readiness Audit',          client: 'Stratogen Corp',     priority: 'medium', due: 'Aug 20', assignees: ['AB'] },
    { id: 'k3',  title: 'Network Architecture Review', client: 'SecureAxis',         priority: 'low',    due: 'Sep 01', assignees: ['DI','VK'] },
    { id: 'k4',  title: 'Cloud Cost Optimisation',     client: 'CloudNine Systems',  priority: 'medium', due: 'Sep 15', assignees: ['KR'] }
  ],
  development: [
    { id: 'k5',  title: 'DataBridge API Layer v2',     client: 'DataBridge Corp',    priority: 'high',   due: 'Jul 28', assignees: ['AP','MK'] },
    { id: 'k6',  title: 'HealthPulse Patient Portal',  client: 'HealthPulse IT',     priority: 'high',   due: 'Aug 05', assignees: ['AB','PS'] },
    { id: 'k7',  title: 'CloudSync Integration',       client: 'TechNova Inc.',      priority: 'medium', due: 'Aug 18', assignees: ['RM'] },
    { id: 'k8',  title: 'Fraud Detection ML Model',    client: 'Orbis Finance',      priority: 'high',   due: 'Aug 22', assignees: ['DI','KR','VK'] },
    { id: 'k9',  title: 'Compliance Dashboard',        client: 'Meridian Group',     priority: 'medium', due: 'Sep 08', assignees: ['AB'] }
  ],
  testing: [
    { id: 'k10', title: 'Security Patch Suite v4',     client: 'SecureAxis',         priority: 'high',   due: 'Jul 25', assignees: ['PS'] },
    { id: 'k11', title: 'NexGen Web Platform',         client: 'NexGen Digital',     priority: 'medium', due: 'Jul 30', assignees: ['MK','RM'] },
    { id: 'k12', title: 'Project Apex Analytics',      client: 'Stratogen Corp',     priority: 'medium', due: 'Aug 04', assignees: ['AB','DI'] },
    { id: 'k13', title: 'Mobile CRM App',              client: 'TechNova Inc.',      priority: 'low',    due: 'Aug 12', assignees: ['KR'] }
  ],
  delivered: [
    { id: 'k14', title: 'SAP S/4HANA Upgrade',         client: 'FusionSAP',         priority: 'high',   due: 'Jun 30', assignees: ['DI'] },
    { id: 'k15', title: 'Zero Trust Architecture',     client: 'Meridian Group',     priority: 'high',   due: 'Jun 25', assignees: ['VK','PS'] },
    { id: 'k16', title: 'Predictive Analytics PoC',    client: 'DataBridge Corp',    priority: 'low',    due: 'Jun 15', assignees: ['AP'] },
    { id: 'k17', title: 'Multi-Cloud Strategy Plan',   client: 'CloudNine Systems',  priority: 'medium', due: 'Jun 10', assignees: ['RM','KR'] },
    { id: 'k18', title: 'Digital Onboarding Suite',    client: 'NexGen Digital',     priority: 'medium', due: 'May 28', assignees: ['AB'] }
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
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(str).replace(/[&<>"']/g, m => map[m]);
}

/* ─────────────────────────────────────────────
   DATE IN TOPBAR
───────────────────────────────────────────── */
(function setCurrentDate() {
  const el = document.getElementById('currentDate');
  if (!el) return;
  el.textContent = new Date().toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'
  });
})();

/* ─────────────────────────────────────────────
   SIDEBAR TOGGLE
───────────────────────────────────────────── */
const sidebar        = document.getElementById('sidebar');
const mainContent    = document.getElementById('mainContent');
const sidebarToggle  = document.getElementById('sidebarToggle');
const mobileMenuBtn  = document.getElementById('mobileMenuBtn');

function isMobile() { return window.innerWidth < 769; }

sidebarToggle.addEventListener('click', () => {
  if (isMobile()) return;
  sidebar.classList.toggle('collapsed');
  document.body.classList.toggle('sidebar-collapsed');
});

mobileMenuBtn.addEventListener('click', () => {
  document.body.classList.toggle('mobile-open');
});

// Close mobile sidebar on overlay click
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
const navItems        = document.querySelectorAll('.nav-item[data-section]');
const sections        = document.querySelectorAll('.content-section');
const breadcrumbText  = document.getElementById('breadcrumbText');

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
  // Hide all sections
  sections.forEach(s => s.classList.remove('active'));
  navItems.forEach(n => n.classList.remove('active'));

  // Show target
  const target = document.getElementById(`section-${sectionId}`);
  if (target) target.classList.add('active');

  // Highlight nav
  const navItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
  if (navItem) navItem.classList.add('active');

  // Breadcrumb
  if (breadcrumbText) {
    breadcrumbText.textContent = SECTION_LABELS[sectionId] || sectionId;
  }

  // Lazy-render
  if (sectionId === 'clients') renderClientTable();
  if (sectionId === 'projects') renderKanban();

  // Close mobile sidebar
  if (isMobile()) document.body.classList.remove('mobile-open');

  // Scroll to top
  mainContent.scrollTo({ top: 0, behavior: 'smooth' });
}

navItems.forEach(item => {
  item.addEventListener('click', () => {
    switchSection(item.dataset.section);
  });
});

// Dashboard "See Kanban" link
document.getElementById('goToProjects').addEventListener('click', () => {
  switchSection('projects');
});

// Chart tabs (cosmetic)
document.querySelectorAll('.chart-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

/* ─────────────────────────────────────────────
   CLIENT TABLE
───────────────────────────────────────────── */
let filteredClients  = [...clientData];
let searchTerm       = '';
let filterStatus     = '';

function renderClientTable() {
  const tbody = document.getElementById('clientTableBody');
  const countEl = document.getElementById('tableCount');
  if (!tbody) return;

  // Apply filters
  filteredClients = clientData.filter(c => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    const matchSearch =
      !searchTerm ||
      fullName.includes(searchTerm) ||
      c.company.toLowerCase().includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm) ||
      c.sector.toLowerCase().includes(searchTerm);
    const matchStatus = !filterStatus || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Render rows
  if (filteredClients.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;padding:40px;color:var(--text-muted);font-size:14px;">
          No clients found matching your criteria.
        </td>
      </tr>`;
  } else {
    tbody.innerHTML = filteredClients.map(c => buildClientRow(c)).join('');
  }

  // Count
  if (countEl) {
    countEl.textContent = `Showing ${filteredClients.length} of ${clientData.length} client${clientData.length !== 1 ? 's' : ''}`;
  }

  // Attach row action buttons
  tbody.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = Number(btn.dataset.id);
      handleClientAction(id, btn);
    });
  });
}

function buildClientRow(c) {
  const initials  = getInitials(c.firstName, c.lastName);
  const avatarStyle = getAvatarStyle(c.company);
  const statusClass = escapeHtml(c.status);
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
      <td><span class="status-badge ${statusClass}">${escapeHtml(statusLabel)}</span></td>
      <td style="font-size:13px;color:var(--text-secondary)">${formatDate(c.joined)}</td>
      <td>
        <button class="action-btn" data-id="${c.id}" aria-label="View ${escapeHtml(c.firstName)} ${escapeHtml(c.lastName)}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          View
        </button>
      </td>
    </tr>`;
}

function handleClientAction(id, btn) {
  const client = clientData.find(c => c.id === id);
  if (!client) return;
  showToast(`Viewing ${client.firstName} ${client.lastName} — ${client.company}`);
}

// Filtering
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
const STAGE_LABELS = {
  discovery:   'Discovery',
  development: 'Development',
  testing:     'Testing',
  delivered:   'Delivered'
};

function renderKanban() {
  const board = document.getElementById('kanbanBoard');
  if (!board || board.dataset.rendered === 'true') return;

  board.innerHTML = Object.entries(KANBAN_DATA).map(([stage, cards]) => `
    <div class="kanban-col" data-stage="${stage}">
      <div class="kanban-col-header">
        <span class="kanban-col-title">${STAGE_LABELS[stage]}</span>
        <span class="kanban-count">${cards.length}</span>
      </div>
      <div class="kanban-cards">
        ${cards.map(card => buildKanbanCard(card)).join('')}
      </div>
    </div>
  `).join('');

  board.dataset.rendered = 'true';

  // Card click handler
  board.querySelectorAll('.kanban-card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.kanban-card-title')?.textContent;
      const client = card.querySelector('.kanban-card-client')?.textContent;
      showToast(`Opened: ${title} (${client?.replace('Client: ', '')})`);
    });
  });
}

function buildKanbanCard(card) {
  const priorityClass = `priority-${card.priority}`;
  const priorityLabel = card.priority.charAt(0).toUpperCase() + card.priority.slice(1);
  const avatarsHtml = card.assignees.slice(0, 3).map((a, i) => {
    const style = getAvatarStyle(a);
    return `<div class="kanban-assignee" style="${style}" title="${a}">${escapeHtml(a)}</div>`;
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

// Allow keyboard activation on kanban cards
document.getElementById('kanbanBoard').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    if (e.target.classList.contains('kanban-card')) {
      e.preventDefault();
      e.target.click();
    }
  }
});

/* ─────────────────────────────────────────────
   ADD CLIENT MODAL
───────────────────────────────────────────── */
const modalOverlay   = document.getElementById('modalOverlay');
const addClientForm  = document.getElementById('addClientForm');
const openAddClient  = document.getElementById('openAddClient');
const modalClose     = document.getElementById('modalClose');
const cancelModal    = document.getElementById('cancelModal');

function openModal() {
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Focus first input
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
  // Clear all error states
  addClientForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  addClientForm.querySelectorAll('.field-error').forEach(el => (el.textContent = ''));
}

openAddClient.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);
cancelModal.addEventListener('click', closeModal);

// Close on overlay click
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
});

/* ─────────────────────────────────────────────
   FORM VALIDATION & SUBMISSION
───────────────────────────────────────────── */
const VALIDATORS = {
  firstName: {
    el: () => document.getElementById('firstName'),
    errEl: () => document.getElementById('firstNameError'),
    validate(val) {
      if (!val.trim()) return 'First name is required.';
      if (val.trim().length < 2) return 'Must be at least 2 characters.';
      return null;
    }
  },
  lastName: {
    el: () => document.getElementById('lastName'),
    errEl: () => document.getElementById('lastNameError'),
    validate(val) {
      if (!val.trim()) return 'Last name is required.';
      if (val.trim().length < 2) return 'Must be at least 2 characters.';
      return null;
    }
  },
  companyName: {
    el: () => document.getElementById('companyName'),
    errEl: () => document.getElementById('companyNameError'),
    validate(val) {
      if (!val.trim()) return 'Company name is required.';
      if (val.trim().length < 2) return 'Must be at least 2 characters.';
      return null;
    }
  },
  email: {
    el: () => document.getElementById('email'),
    errEl: () => document.getElementById('emailError'),
    validate(val) {
      if (!val.trim()) return 'Email address is required.';
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(val.trim())) return 'Enter a valid email address.';
      return null;
    }
  },
  sector: {
    el: () => document.getElementById('sector'),
    errEl: () => document.getElementById('sectorError'),
    validate(val) {
      if (!val) return 'Please select a sector.';
      return null;
    }
  },
  clientStatus: {
    el: () => document.getElementById('clientStatus'),
    errEl: () => document.getElementById('clientStatusError'),
    validate(val) {
      if (!val) return 'Please select a status.';
      return null;
    }
  }
};

function validateField(key) {
  const def   = VALIDATORS[key];
  const input = def.el();
  const errEl = def.errEl();
  const error = def.validate(input.value);

  if (error) {
    input.classList.add('error');
    errEl.textContent = error;
    return false;
  } else {
    input.classList.remove('error');
    errEl.textContent = '';
    return true;
  }
}

// Live validation (on blur for each field)
Object.keys(VALIDATORS).forEach(key => {
  const input = VALIDATORS[key].el();
  if (input) {
    input.addEventListener('blur', () => validateField(key));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(key);
    });
  }
});

addClientForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Validate all fields
  let isValid = true;
  Object.keys(VALIDATORS).forEach(key => {
    if (!validateField(key)) isValid = false;
  });

  if (!isValid) return;

  // Build new client object
  const today = new Date().toISOString().split('T')[0];
  const newClient = {
    id:        nextClientId++,
    firstName: document.getElementById('firstName').value.trim(),
    lastName:  document.getElementById('lastName').value.trim(),
    company:   document.getElementById('companyName').value.trim(),
    email:     document.getElementById('email').value.trim().toLowerCase(),
    sector:    document.getElementById('sector').value,
    status:    document.getElementById('clientStatus').value,
    joined:    today
  };

  // Prepend to data array
  clientData.unshift(newClient);

  // Animate new row into table
  renderClientTable();
  highlightNewRow(newClient.id);

  // Update metric card count
  updateMetricCount('metricClients', clientData.length);

  // Close modal and notify
  closeModal();
  showToast(`${newClient.firstName} ${newClient.lastName} added successfully!`);
});

function highlightNewRow(id) {
  const row = document.querySelector(`tr[data-client-id="${id}"]`);
  if (!row) return;
  row.style.animation = 'none';
  row.style.background = 'var(--accent-light)';
  row.style.transition = 'background 1.2s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      row.style.background = '';
    });
  });
}

function updateMetricCount(elId, count) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = count;
  el.style.transform = 'scale(1.15)';
  el.style.transition = 'transform 0.3s cubic-bezier(0.4,0,0.2,1)';
  setTimeout(() => { el.style.transform = 'scale(1)'; }, 320);
}

/* ─────────────────────────────────────────────
   TOAST NOTIFICATION
───────────────────────────────────────────── */
let toastTimer = null;

function showToast(message, duration = 3200) {
  const toast   = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/* ─────────────────────────────────────────────
   PIPELINE BAR ANIMATION (intersection observer)
───────────────────────────────────────────── */
function animatePipelineBars() {
  const fills = document.querySelectorAll('.pipeline-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const width = el.style.width;
        el.style.width = '0%';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.width = width;
          });
        });
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  fills.forEach(f => observer.observe(f));
}

/* ─────────────────────────────────────────────
   METRIC CARD COUNTER ANIMATION
───────────────────────────────────────────── */
function animateCounters() {
  const metricValues = document.querySelectorAll('.metric-value');

  metricValues.forEach(el => {
    const rawText = el.textContent.trim();
    const prefix  = rawText.match(/^[^\d]*/)?.[0] || '';
    const suffix  = rawText.match(/[^\d.]+$/)?.[0] || '';
    const numStr  = rawText.replace(prefix, '').replace(suffix, '');

    if (!numStr || isNaN(numStr)) return;

    const target   = parseFloat(numStr);
    const isDecimal = numStr.includes('.');
    const duration = 1000;
    const steps    = 40;
    const stepTime = duration / steps;
    let current    = 0;
    let step       = 0;

    const interval = setInterval(() => {
      step++;
      // ease out cubic
      const t = step / steps;
      const ease = 1 - Math.pow(1 - t, 3);
      current = target * ease;

      if (isDecimal) {
        el.textContent = prefix + current.toFixed(1) + suffix;
      } else {
        el.textContent = prefix + Math.round(current) + suffix;
      }

      if (step >= steps) {
        clearInterval(interval);
        el.textContent = rawText; // ensure exact
      }
    }, stepTime);
  });
}

/* ─────────────────────────────────────────────
   INITIALISE
───────────────────────────────────────────── */
(function init() {
  animatePipelineBars();
  animateCounters();

  // Trigger pipeline bars on section switch
  const origSwitch = switchSection;
  window.switchSection = function(id) {
    origSwitch(id);
    if (id === 'dashboard') {
      setTimeout(animatePipelineBars, 100);
    }
  };

  // Navigate via URL hash if present
  const hash = window.location.hash.replace('#', '');
  if (hash && SECTION_LABELS[hash]) {
    switchSection(hash);
  }
})();

/* ─────────────────────────────────────────────
   GENESYS CLOUD SOFTPHONE INIT
───────────────────────────────────────────── */
(function initGenesys() {
  var GENESYS_CONFIG = {
    clientIds: {
      'usw2.pure.cloud': '226182a8-bb53-435b-bc3c-2140f077768f'
    },
    region: 'usw2.pure.cloud',
    iframeUrl: 'https://apps.usw2.pure.cloud/crm/embeddableFramework.html'
  };

  var spDot        = document.getElementById('spDot');
  var spStatusText = document.getElementById('spStatusText');
  var spBanner     = document.getElementById('spStatusBanner');
  var iframe       = document.getElementById('softphone');

  function setStatus(state, msg) {
    if (!spDot || !spStatusText) return;
    spDot.className = 'softphone-status-dot ' + state;
    spStatusText.textContent = msg;
    if (spBanner) {
      spBanner.style.background = state === 'connected'
        ? 'var(--green-light)'   : state === 'connecting'
        ? 'var(--gold-light)'    : 'var(--accent-light)';
      spBanner.style.color = state === 'connected'
        ? 'var(--green)'         : state === 'connecting'
        ? 'var(--gold)'          : 'var(--accent)';
      spBanner.style.borderColor = state === 'connected'
        ? 'rgba(22,163,74,0.25)' : state === 'connecting'
        ? 'rgba(217,119,6,0.25)' : 'rgba(0,102,204,0.2)';
    }
  }

  // Listen for postMessage events from the Genesys iframe
  window.addEventListener('message', function(event) {
    if (!event.origin || !event.origin.includes('pure.cloud')) return;

    var data = event.data || {};
    var type = typeof data === 'string' ? data : (data.type || data.action || '');

    if (type === 'purecloud-cti-ready' || type === 'ready' || type === 'authenticated') {
      setStatus('connected', 'Genesys Cloud connected — Ready to take calls');
    } else if (type === 'call-started' || type === 'call.start') {
      setStatus('connected', 'Active call in progress…');
      showToast('Incoming/outgoing call started');
    } else if (type === 'call-ended' || type === 'call.end') {
      setStatus('connected', 'Call ended — Genesys Cloud ready');
      showToast('Call ended');
    } else if (type === 'error' || type === 'auth-error') {
      setStatus('', 'Authentication required — please sign in to Genesys Cloud');
    }
  });

  // Set connecting state when softphone section is opened
  var origSwitch = window.switchSection || function(){};
  window.switchSection = function(sectionId) {
    origSwitch(sectionId);
    if (sectionId === 'softphone') {
      setStatus('connecting', 'Loading Genesys Cloud softphone…');
      setTimeout(function() {
        if (spDot && spDot.classList.contains('connecting')) {
          setStatus('connecting', 'Waiting for Genesys login — sign in inside the softphone panel');
        }
      }, 5000);
    }
  };

  // Iframe load event
  if (iframe) {
    iframe.addEventListener('load', function() {
      setStatus('connecting', 'Softphone loaded — please sign in with your Genesys credentials');
      try {
        iframe.contentWindow.postMessage({
          type: 'purecloud-cti-config',
          clientId: GENESYS_CONFIG.clientIds[GENESYS_CONFIG.region],
          region: GENESYS_CONFIG.region
        }, 'https://apps.usw2.pure.cloud');
      } catch(e) {
        // Cross-origin; iframe manages its own auth flow
      }
    });
  }
})();
