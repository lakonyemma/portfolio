/* Lakony Emmanuel, framework free. Works when index.html is opened directly. */
'use strict';

// PERSONALIZE BEFORE PUBLISHING:
// Enter the email address you explicitly want to make public, or leave empty.
// When blank, the contact form copies the inquiry instead of sending it anywhere.
const CONTACT_EMAIL = '';

const PROJECTS = [
  {
    id: 'taskly', name: 'Taskly',
    subtitle: 'A smarter way to get work done',
    category: ['web', 'systems'], label: 'FULL-STACK WEB APP', year: '2026',
    description: 'A task and team management platform for organizing projects, people, deadlines and everyday work. It brings together collaborative workspaces, task tracking, notifications and productivity reporting.',
    highlights: ['Task and workspace management', 'Team collaboration and roles', 'Reminders and notifications', 'Offline-first productivity tools'],
    stack: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Prisma'],
    repositories: [{label:'Taskly source code',url:'https://github.com/lakonyemma/TaskManager'}],
    preview: '<h4>Today’s overview</h4><div class="tiny-row"><div class="tiny-card"><b></b><i></i></div><div class="tiny-card"><b></b><i></i></div><div class="tiny-card"><b></b><i></i></div></div>'
  },
  {
    id: 'workwise', name: 'Workwise',
    subtitle: 'Intelligent task and workload management',
    category: ['web', 'systems'], label: 'TEAM MANAGEMENT SYSTEM', year: '2026',
    description: 'A role-based task allocation and workload management system for Khan Associates. It is being developed across separate frontend and backend repositories, with a public ASP.NET Core implementation and additional private coursework components.',
    highlights: ['Admin, supervisor and employee workflows', 'Task creation, allocation and progress tracking', 'Workload dashboards and reporting', 'Separate frontend and backend architecture'],
    stack: ['ASP.NET Core MVC', 'C#', 'Entity Framework Core', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
    repositories: [
      {label:'Public Workwise implementation',url:'https://github.com/lakonyemma/New'},
      {label:'Workwise frontend',private:true},
      {label:'Workwise backend',private:true}
    ],
    preview: '<h4>Team workload</h4><div class="graph-bars"><i></i><i></i><i></i><i></i><i></i><i></i></div>'
  },

  {
    id: 'shevault', name: 'SheVault',
    subtitle: 'A digital workspace for group savings',
    category: ['web', 'systems'], label: 'FULL-STACK WEB PLATFORM', year: '2026',
    description: 'A savings-group management platform covering members, recurring contribution cycles, meetings, notifications and mobile-money collection workflows. The frontend and REST API are maintained in separate repositories.',
    highlights: ['Member and group management', 'Weekly contribution ledger and reports', 'Meetings, attendance and notifications', 'Mobile Money collection integration layer and audit trail'],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Django', 'Django REST Framework', 'PostgreSQL', 'Redis'],
    repositories: [
      {label:'SheVault frontend',url:'https://github.com/lakonyemma/shevault-frontend'},
      {label:'SheVault backend API',url:'https://github.com/lakonyemma/shevault-backend'}
    ],
    preview: '<h4>Group overview</h4><div class="vault-balance">TOTAL CONTRIBUTIONS <b>···</b></div><div class="vault-pills"><i></i><i></i><i></i></div>'
  },
  {
    id: 'campushub', name: 'Campus Hub',
    subtitle: 'An academic companion for students',
    category: ['mobile'], label: 'ANDROID APP', year: '2026',
    description: 'An Android-first student companion focused on academic organization, timetables, assignment progress and study materials. Its roadmap includes a contextual assistant that can work with selected course PDFs.',
    highlights: ['Academic dashboard and timetable', 'Assignment progress tracking', 'Study workspace and PDF selection', 'Contextual study assistant roadmap'],
    stack: ['React Native', 'Expo', 'JavaScript', 'Android'],
    repositories: [{label:'Campus Hub source code',url:'https://github.com/lakonyemma/Campus-Hub'}],
    preview: '<h4>Your study space</h4><div class="campus-timetable"><i></i><i></i><i></i></div>'
  },
  {
    id: 'commandcenter', name: 'Lakony Command Center',
    subtitle: 'An Android workspace for everyday operations',
    category: ['mobile', 'systems'], label: 'ANDROID PRODUCTIVITY APP', year: '2026',
    description: 'A custom Android command center that brings together a dashboard, local tasks, notifications and dedicated spaces for calendar, inbox, developer tools, devices and finance planning. External services remain integration surfaces until authorized connections are configured.',
    highlights: ['Unified dashboard and Control Center', 'Offline-first tasks and notifications', 'Calendar, inbox and developer workspaces', 'Finance planning and integration surfaces'],
    stack: ['Kotlin', 'Jetpack Compose', 'Android', 'Gradle'],
    repositories: [{label:'Command Center source code',url:'https://github.com/lakonyemma/Command-center'}],
    preview: '<h4>CONTROL CENTER</h4><div class="tiny-row"><div class="tiny-card"><b></b><i></i></div><div class="tiny-card"><b></b><i></i></div><div class="tiny-card"><b></b><i></i></div></div>'
  },
  {
    id: 'mpkminingsarl', name: 'MPK Mining SARL',
    subtitle: 'A corporate website for a mining company',
    category: ['web'], label: 'CORPORATE WEBSITE', year: '2026',
    description: 'A responsive corporate website for MPK Mining SARL, presenting its company profile, mining and mineral-processing focus, and buyer enquiry information through a gold-led visual identity.',
    highlights: ['Responsive corporate website', 'Company and service information', 'Seven-language interface', 'Buyer enquiry email flow'],
    stack: ['HTML', 'CSS', 'JavaScript', 'Responsive Web Design'],
    repositories: [{label:'MPK Mining SARL website',url:'https://github.com/lakonyemma/mpkminingsarl'}],
    preview: '<h4>MPK MINING SARL</h4><div class="mine-dashboard"><span>GOLD · MINING · TRADE</span><b>Built on value.</b><i></i><i></i><i></i></div>'
  },







];

const PAGE_ORDER = ['home', 'work', 'about', 'contact'];
const PAGE_NAMES = {home: 'HOME', work: 'SELECTED WORK', about: 'ABOUT', contact: 'CONTACT'};
const COMMANDS = [
  {id: 'home', label: 'Home', hint: 'Introduction', type: 'route'},
  {id: 'work', label: 'Selected work', hint: 'Projects', type: 'route'},
  {id: 'about', label: 'About me', hint: 'Background & skills', type: 'route'},
  {id: 'contact', label: 'Contact', hint: 'Say hello', type: 'route'},
  {id: 'theme', label: 'Switch color theme', hint: 'Light / dark', type: 'action'}
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

function setActivePage(page) {
  if (!PAGE_ORDER.includes(page)) return;
  currentPage = page;
  $$('.nav-item').forEach(link => {
    const active = link.dataset.route === page;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  $('#topbar-descriptor').textContent = PAGE_NAMES[page];
  document.title = `${PAGE_NAMES[page]} · Lakony Emmanuel`;
}

function navigate(page, saveHistory = true) {
  if (!PAGE_ORDER.includes(page)) page = 'home';
  closeCommand();
  closeModal();
  setActivePage(page);
  const target = document.getElementById(page);
  if (target) target.scrollIntoView({behavior: saveHistory ? 'smooth' : 'auto', block: 'start'});
  if (saveHistory && window.location.hash !== `#${page}`) {
    try {
      history.pushState({page}, '', `#${page}`);
    } catch (_) {
      window.location.hash = page;
    }
  }
}

function observeSections() {
  const sections = $$('.screen');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActivePage(visible.target.id);
    }, {root: null, rootMargin: '-18% 0px -58% 0px', threshold: [0, .15, .35, .6]});
    sections.forEach(section => observer.observe(section));
  } else {
    window.addEventListener('scroll', () => {
      const current = sections.filter(section => section.getBoundingClientRect().top < innerHeight * .45)
        .sort((a, b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top)[0];
      if (current) setActivePage(current.id);
    }, {passive: true});
  }
  const backHome = $('.back-home');
  const updateBackHome = () => backHome?.classList.toggle('is-visible', window.scrollY > 360);
  window.addEventListener('scroll', updateBackHome, {passive: true});
  updateBackHome();
}

function sceneMarkup(project) {
  const inner = {
    taskly: '<h4>Today’s overview</h4><div class="tiny-row"><div class="tiny-card"><b></b><i></i></div><div class="tiny-card"><b></b><i></i></div><div class="tiny-card"><b></b><i></i></div></div>',
    workwise: '<h4>Team workload</h4><div class="graph-bars"><i></i><i></i><i></i><i></i><i></i><i></i></div>',
    shevault: '<h4>Group overview</h4><div class="vault-balance">TOTAL CONTRIBUTIONS <b>···</b></div><div class="vault-pills"><i></i><i></i><i></i></div>',
    campushub: '<h4>Your study space</h4><div class="campus-timetable"><i></i><i></i><i></i></div>',
    mpkminingsarl: '<h4>MPK MINING SARL</h4><div class="mine-dashboard"><span>GOLD · MINING · TRADE</span><b>Built on value.</b><i></i><i></i><i></i></div>'
  };
  const preview = project.preview || inner[project.id] || '<h4>PROJECT PREVIEW</h4><div class="tiny-row"><div class="tiny-card"><b></b><i></i></div><div class="tiny-card"><b></b><i></i></div></div>';
  return `<div class="project-scene ${project.id}" aria-hidden="true"><div class="scene-window ${project.id}"><div class="scene-top"><i></i><i></i><i></i><strong>${project.name.toUpperCase()}</strong></div><div class="scene-ui">${preview}</div></div><span class="scene-sticker">${project.label}</span></div>`;
}

function renderProjects() {
  const shown = PROJECTS.filter(project => currentFilter === 'all' || project.category.includes(currentFilter));
  $('#projects-grid').innerHTML = shown.map(project => `
    <a class="project-card" href="#work" data-project="${project.id}" aria-label="Explore ${project.name} project details">
      ${sceneMarkup(project)}
      <div class="project-info"><div><h3>${project.name}</h3><p>${project.subtitle}</p></div><span class="project-arrow" aria-hidden="true">↗</span></div>
    </a>`).join('');
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
  const repositories = project.repositories || (project.repo ? [{label:'Source repository',url:project.repo}] : []);
  const repositoryMarkup = repositories.length
    ? `<h3>PROJECT REPOSITORIES</h3><div class="modal-repositories">${repositories.map(repository => repository.private
      ? `<span class="modal-repository-private">${repository.label} · Private source</span>`
      : `<a class="modal-repository-link" href="${repository.url}" target="_blank" rel="noopener noreferrer">${repository.label} <span aria-hidden="true">↗</span></a>`).join('')}</div>`
    : '<p class="modal-private-note">Source repository is not publicly available.</p>';
  $('#modal-content').innerHTML = `
    <div class="modal-scene">${sceneMarkup(project)}</div>
    <div class="modal-main"><div class="modal-meta"><span>PROJECT DETAILS</span><span>${project.year} · ${project.label}</span></div>
      <h2 id="modal-title">${project.name}<span style="color:var(--accent)">.</span></h2><p>${project.description}</p>
      <h3>WHAT IT COVERS</h3><div class="modal-points">${project.highlights.map(item => `<span>${item}</span>`).join('')}</div>
      <h3>TOOLS & TECHNOLOGIES</h3><div class="modal-tags">${project.stack.map(item => `<span>${item}</span>`).join('')}</div>
      ${repositoryMarkup}
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
  root.innerHTML = commandMatches.map((item, index) => `<button type="button" class="command-result ${index === commandSelected ? 'is-highlighted' : ''}" data-command="${item.id}" data-command-index="${index}" role="option" aria-selected="${index === commandSelected}"><span class="command-result-mark" aria-hidden="true">↗</span><span class="command-result-text">${item.label}</span><span class="command-result-help">${item.hint}</span></button>`).join('');
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
    if (project) { event.preventDefault(); openModal(project.dataset.project); return; }
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
    if (!event.altKey && !event.ctrlKey && !event.metaKey && ['ArrowRight','ArrowLeft'].includes(event.key) && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
      event.preventDefault();
      const step = event.key === 'ArrowRight' ? 1 : -1;
      navigate(PAGE_ORDER[(PAGE_ORDER.indexOf(currentPage) + step + PAGE_ORDER.length) % PAGE_ORDER.length]);
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
  observeSections();
  navigate(window.location.hash.slice(1) || 'home', false);
  updateClock();
  setInterval(updateClock, 60 * 1000);
  $('#copyright-year').textContent = new Date().getFullYear();
  document.documentElement.classList.add('is-ready');
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
