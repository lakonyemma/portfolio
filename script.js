/* Lakony Emmanuel — deliberately framework-free. Works when index.html is opened directly. */
'use strict';

// PERSONALIZE BEFORE PUBLISHING:
// Enter the email address you explicitly want to make public, or leave empty.
// When blank, the contact form copies the inquiry instead of sending it anywhere.
const CONTACT_EMAIL = '';

const PROJECTS = [
  {
    id: 'taskly', number: '01', name: 'Taskly',
    subtitle: 'A smarter way to get work done',
    category: ['web', 'systems'], label: 'FULL-STACK WEB APP', year: '2026',
    description: 'A task and team management platform designed around the realities of getting things done: projects, people, deadlines and the details in between. Built to support both individual focus and collaborative workflows.',
    highlights: ['Task and workspace management', 'Team collaboration and roles', 'Reminders and notifications', 'Offline-first productivity tools'],
    stack: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Prisma'],
    repo: 'https://github.com/lakonyemma/TaskManager', isPrivate: false
  },
  {
    id: 'workwise', number: '02', name: 'Workwise',
    subtitle: 'Intelligent task & workload management',
    category: ['web', 'systems'], label: 'TEAM SYSTEM', year: '2026',
    description: 'An intelligent task allocation and workload management system for coordinating team responsibilities, tracking employee progress, and helping supervisors understand how work is distributed.',
    highlights: ['Supervisor and employee workflows', 'Task allocation and progress tracking', 'Workload insights and reporting', 'Role-based operational interfaces'],
    stack: ['HTML', 'CSS', 'JavaScript', 'ASP.NET MVC 5', 'MySQL'],
    repo: null, isPrivate: true
  },
  {
    id: 'shevault', number: '03', name: 'SheVault',
    subtitle: 'Organizing member contributions',
    category: ['web'], label: 'WEB PLATFORM', year: '2026',
    description: 'A web platform for managing group membership, recurring contributions, meetings and payment-related workflows in one clear, organized place.',
    highlights: ['Member management', 'Contribution workflows', 'Meetings and notifications', 'Customizable interface themes'],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    repo: 'https://github.com/lakonyemma/shevault-frontend', isPrivate: false
  },
  {
    id: 'campushub', number: '04', name: 'Campus Hub',
    subtitle: 'An academic companion for students',
    category: ['mobile'], label: 'MOBILE APP', year: '2026',
    description: 'An Android-first student companion focused on coursework organization, timetables, study materials and assignment progress. A contextual study assistant is part of its planned development roadmap.',
    highlights: ['Academic dashboard', 'Timetable and assignment tracking', 'Study workspace', 'Planned PDF-based study assistant'],
    stack: ['React Native', 'Expo', 'JavaScript', 'Android'],
    repo: 'https://github.com/lakonyemma/Campus-Hub', isPrivate: false
  }
];

const PAGE_ORDER = ['home', 'work', 'about', 'contact'];
const PAGE_NAMES = {home: 'HOME', work: 'SELECTED WORK', about: 'ABOUT', contact: 'CONTACT'};
const COMMANDS = [
  {id: 'home', mark: '01', label: 'Home', hint: 'Introduction', type: 'route'},
  {id: 'work', mark: '02', label: 'Selected work', hint: 'Projects', type: 'route'},
  {id: 'about', mark: '03', label: 'About me', hint: 'Background & skills', type: 'route'},
  {id: 'contact', mark: '04', label: 'Contact', hint: 'Say hello', type: 'route'},
  {id: 'theme', mark: '◐', label: 'Switch color theme', hint: 'Light / dark', type: 'action'}
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
let currentPage = 'home';
let currentFilter = 'all';
let lastFocusedElement = null;
let toastTimeout;
let commandSelected = 0;
let commandMatches = [];

function initTheme() {
  try {
    const saved = localStorage.getItem('le-theme');
    if (saved === 'dark' || saved === 'light') document.body.dataset.theme = saved;
  } catch (_) { /* Private browsing may restrict storage. */ }
  updateThemeButton();
}
function updateThemeButton() {
  const theme = document.body.dataset.theme;
  $('#theme-toggle').setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  $('#theme-toggle').setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  $('#theme-toggle').innerHTML = theme === 'dark'
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 15.8A8.5 8.5 0 0 1 8.2 4a8.5 8.5 0 1 0 11.8 11.8Z"/></svg>';
}
function toggleTheme() {
  document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('le-theme', document.body.dataset.theme); } catch (_) {}
  updateThemeButton();
  toast(`${document.body.dataset.theme === 'dark' ? 'Dark' : 'Light'} mode enabled`);
}

function navigate(page, saveHistory = true) {
  if (!PAGE_ORDER.includes(page)) page = 'home';
  closeCommand();
  closeModal();
  currentPage = page;
  $$('.screen').forEach(screen => {
    const active = screen.dataset.screen === page;
    screen.hidden = !active;
    screen.classList.toggle('is-active', active);
    if (active) screen.scrollTop = 0;
  });
  $$('.nav-item').forEach(button => {
    const active = button.dataset.route === page;
    button.classList.toggle('is-active', active);
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  $('#page-progress').textContent = String(PAGE_ORDER.indexOf(page) + 1).padStart(2, '0');
  $('#topbar-descriptor').textContent = `PORTFOLIO / ${PAGE_NAMES[page]}`;
  document.title = `${PAGE_NAMES[page]} · Lakony Emmanuel`;
  if (saveHistory && window.location.hash !== `#${page}`) {
    // Some browsers restrict history.pushState on local file:// documents.
    // A hash update still works offline and preserves back/forward navigation.
    try {
      history.pushState({page}, '', `#${page}`);
    } catch (_) {
      window.location.hash = page;
    }
  }
}

function sceneMarkup(project) {
  const inner = {
    taskly: '<h4>Today’s overview</h4><div class="tiny-row"><div class="tiny-card"><b></b><i></i></div><div class="tiny-card"><b></b><i></i></div><div class="tiny-card"><b></b><i></i></div></div>',
    workwise: '<h4>Team workload</h4><div class="graph-bars"><i></i><i></i><i></i><i></i><i></i><i></i></div>',
    shevault: '<h4>Group overview</h4><div class="vault-balance">TOTAL CONTRIBUTIONS <b>···</b></div><div class="vault-pills"><i></i><i></i><i></i></div>',
    campushub: '<h4>Your study space</h4><div class="campus-timetable"><i></i><i></i><i></i></div>'
  };
  return `<div class="project-scene ${project.id}" aria-hidden="true"><div class="scene-window ${project.id}"><div class="scene-top"><i></i><i></i><i></i><strong>${project.name.toUpperCase()}</strong></div><div class="scene-ui">${inner[project.id]}</div></div><span class="scene-sticker">${project.label}</span></div>`;
}

function renderProjects() {
  const shown = PROJECTS.filter(project => currentFilter === 'all' || project.category.includes(currentFilter));
  $('#projects-grid').innerHTML = shown.map(project => `
    <button class="project-card" type="button" data-project="${project.id}" aria-label="Explore ${project.name} project details">
      ${sceneMarkup(project)}
      <div class="project-info"><div><h3>${project.name}</h3><p>${project.subtitle}</p></div><span class="project-arrow" aria-hidden="true">↗</span></div>
    </button>`).join('');
  $$('.filter-pill').forEach(pill => {
    const active = pill.dataset.filter === currentFilter;
    pill.classList.toggle('is-selected', active);
    pill.setAttribute('aria-pressed', String(active));
  });
}

function openModal(id) {
  const project = PROJECTS.find(item => item.id === id);
  if (!project) return;
  lastFocusedElement = document.activeElement;
  $('#modal-content').innerHTML = `
    <div class="modal-scene">${sceneMarkup(project)}</div>
    <div class="modal-main"><div class="modal-meta"><span>PROJECT ${project.number} / 04</span><span>${project.year} · ${project.label}</span></div>
      <h2 id="modal-title">${project.name}<span style="color:var(--accent)">.</span></h2><p>${project.description}</p>
      <h3>WHAT IT COVERS</h3><div class="modal-points">${project.highlights.map(item => `<span>${item}</span>`).join('')}</div>
      <h3>TOOLS & TECHNOLOGIES</h3><div class="modal-tags">${project.stack.map(item => `<span>${item}</span>`).join('')}</div>
      ${project.repo ? `<a class="button button-primary modal-link" href="${project.repo}" target="_blank" rel="noopener noreferrer">Explore on GitHub <span aria-hidden="true">↗</span></a>` : '<div class="button modal-link" aria-disabled="true">Private project — repository not public <span aria-hidden="true">↗</span></div>'}
    </div>`;
  $('#project-modal').hidden = false;
  document.body.style.overflow = 'hidden';
  $('#modal-close').focus();
}
function closeModal() {
  const layer = $('#project-modal');
  if (layer.hidden) return;
  layer.hidden = true;
  document.body.style.overflow = '';
  if (lastFocusedElement?.isConnected) lastFocusedElement.focus();
}

function renderCommands(filter = '') {
  const needle = filter.trim().toLowerCase();
  commandMatches = COMMANDS.filter(item => `${item.label} ${item.hint}`.toLowerCase().includes(needle));
  commandSelected = 0;
  const root = $('#command-results');
  if (!commandMatches.length) {
    root.innerHTML = '<div class="command-result-empty">No matches. Try “projects”, “contact”, or “theme”.</div>';
    return;
  }
  root.innerHTML = commandMatches.map((item, index) => `<button type="button" class="command-result ${index === commandSelected ? 'is-highlighted' : ''}" data-command="${item.id}" data-command-index="${index}" role="option" aria-selected="${index === commandSelected}"><span class="command-result-mark">${item.mark}</span><span class="command-result-text">${item.label}</span><span class="command-result-help">${item.hint}</span></button>`).join('');
}
function updateCommandSelection() {
  $$('.command-result').forEach((button, index) => {
    const active = index === commandSelected;
    button.classList.toggle('is-highlighted', active);
    button.setAttribute('aria-selected', String(active));
    if (active) button.scrollIntoView({block: 'nearest'});
  });
}
function openCommand() {
  closeModal();
  lastFocusedElement = document.activeElement;
  $('#command-layer').hidden = false;
  $('#command-input').value = '';
  renderCommands();
  $('#command-input').focus();
}
function closeCommand() {
  const layer = $('#command-layer');
  if (layer.hidden) return;
  layer.hidden = true;
  if (lastFocusedElement?.isConnected) lastFocusedElement.focus();
}
function runCommand(id) {
  closeCommand();
  if (id === 'theme') toggleTheme();
  else navigate(id);
}
function toast(message) {
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('is-shown');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => element.classList.remove('is-shown'), 3100);
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const helper = document.createElement('textarea');
  helper.value = text;
  helper.style.position = 'fixed';
  helper.style.opacity = '0';
  document.body.appendChild(helper);
  helper.focus();
  helper.select();
  const copied = document.execCommand('copy');
  helper.remove();
  if (!copied) throw new Error('Clipboard unavailable');
}
async function handleContactForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const name = $('#sender-name').value.trim();
  const email = $('#sender-email').value.trim();
  const message = $('#sender-message').value.trim();
  if (!name || !email || !message) {
    toast('Please complete all fields first.');
    return;
  }
  const subject = `Portfolio inquiry from ${name}`;
  const body = `Hello Emmanuel,\n\n${message}\n\nFrom: ${name}\nEmail: ${email}`;
  if (CONTACT_EMAIL.trim()) {
    window.location.href = `mailto:${CONTACT_EMAIL.trim()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    $('#form-feedback').textContent = 'An email draft has been opened. Send it from your email app to finish.';
    toast('Email draft ready to send');
  } else {
    try {
      await copyText(`To: Lakony Emmanuel\nSubject: ${subject}\n\n${body}`);
      $('#form-feedback').textContent = 'Inquiry copied! You can paste it into a message. No data was sent.';
      toast('Your inquiry has been copied');
    } catch (_) {
      $('#form-feedback').textContent = 'Copying was blocked by your browser. Select and copy your message manually.';
      toast('Your browser blocked clipboard access');
    }
  }
}

function updateClock() {
  try {
    $('#local-time').textContent = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Kampala', hour: '2-digit', minute: '2-digit', hour12: false
    }).format(new Date()) + ' EAT';
  } catch (_) {
    $('#local-time').textContent = 'EAT';
  }
}
function setupEventHandlers() {
  document.addEventListener('click', event => {
    const route = event.target.closest('[data-route]');
    if (route) {
      event.preventDefault();
      navigate(route.dataset.route);
      return;
    }
    const project = event.target.closest('[data-project]');
    if (project) { openModal(project.dataset.project); return; }
    const filter = event.target.closest('[data-filter]');
    if (filter) { currentFilter = filter.dataset.filter; renderProjects(); return; }
    if (event.target.closest('[data-close-modal]') || event.target.closest('#modal-close')) closeModal();
    if (event.target.closest('[data-close-command]')) closeCommand();
    const command = event.target.closest('[data-command]');
    if (command) runCommand(command.dataset.command);
  });
  $('#theme-toggle').addEventListener('click', toggleTheme);
  $('#command-trigger').addEventListener('click', openCommand);
  $('#command-input').addEventListener('input', event => renderCommands(event.target.value));
  $('#contact-form').addEventListener('submit', handleContactForm);
  window.addEventListener('popstate', () => navigate(window.location.hash.slice(1), false));
  window.addEventListener('hashchange', () => navigate(window.location.hash.slice(1), false));
  document.addEventListener('keydown', event => {
    const commandOpen = !$('#command-layer').hidden;
    const modalOpen = !$('#project-modal').hidden;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      commandOpen ? closeCommand() : openCommand();
      return;
    }
    if (event.key === 'Escape') { if (commandOpen) closeCommand(); else if (modalOpen) closeModal(); return; }
    if (commandOpen) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        if (commandMatches.length) commandSelected = (commandSelected + (event.key === 'ArrowDown' ? 1 : -1) + commandMatches.length) % commandMatches.length;
        updateCommandSelection();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (commandMatches[commandSelected]) runCommand(commandMatches[commandSelected].id);
      } else if (event.key === 'Tab') {
        event.preventDefault();
        $('#command-input').focus();
      }
      return;
    }
    if (modalOpen) {
      if (event.key === 'Tab') {
        const focusables = $$('button:not([disabled]),a[href]', $('#project-modal'));
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
      return;
    }
    // Alt + arrow keys switch sections, without hijacking normal text input behavior.
    if (event.altKey && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
      event.preventDefault();
      const step = event.key === 'ArrowRight' ? 1 : -1;
      navigate(PAGE_ORDER[(PAGE_ORDER.indexOf(currentPage) + step + PAGE_ORDER.length) % PAGE_ORDER.length]);
    }
  });
}

function init() {
  initTheme();
  renderProjects();
  setupEventHandlers();
  navigate(window.location.hash.slice(1) || 'home', false);
  updateClock();
  setInterval(updateClock, 60 * 1000);
  $('#copyright-year').textContent = new Date().getFullYear();
  if (CONTACT_EMAIL.trim()) {
    $('#send-label').textContent = 'Open email draft';
    $('#form-feedback').textContent = 'Your message opens in your email app; review it before sending.';
  }
}

// External deferred scripts and embedded single-file copies can run at different times.
// Initialize only after the DOM is fully available, including when opened with file://.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
