// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 70);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

// Navigation
function setMenuState(isOpen) {
  const navLinks = document.getElementById('navLinks');
  const menuBtn = document.getElementById('menuBtn');

  navLinks.classList.toggle('open', isOpen);
  menuBtn.classList.toggle('active', isOpen);
  menuBtn.setAttribute('aria-expanded', String(isOpen));
}

function toggleMenu() {
  setMenuState(!document.getElementById('navLinks').classList.contains('open'));
}

function closeMenu() {
  setMenuState(false);
}

// Category pages
const categoryIds = ['mobile', 'landings'];
const caseIds = ['mobile-v1'];

function showCategory(id, shouldScroll = true) {
  document.getElementById('mainContent').style.display = 'none';
  document.querySelector('nav').classList.add('nav-hidden');
  document.querySelectorAll('.category-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.poster-detail-page').forEach(p => p.classList.remove('active'));
  document.getElementById('cat-' + id)?.classList.add('active');

  if (shouldScroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function openCategory(id) {
  showCategory(id);
  history.pushState({ category: id }, '', '#' + id);
}

function openCategoryFromKeyboard(event, id) {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  openCategory(id);
}

function showCase(id, shouldScroll = true) {
  document.getElementById('mainContent').style.display = 'none';
  document.querySelector('nav').classList.add('nav-hidden');
  document.querySelectorAll('.category-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.poster-detail-page').forEach(p => p.classList.remove('active'));
  document.getElementById('case-' + id)?.classList.add('active');
  if (shouldScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openCase(id) {
  showCase(id);
  history.pushState({ case: id }, '', '#case-' + id);
}

function openCaseFromKeyboard(event, id) {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  openCase(id);
}

function closeCase() {
  showCategory('mobile');
}

function closeCategory() {
  if (history.state?.category) {
    history.replaceState({ main: true }, '', window.location.pathname + window.location.search + '#projects');
  }
  showMain(true);
}

function showMain(scrollToProjects = false) {
  document.querySelectorAll('.category-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.poster-detail-page').forEach(p => p.classList.remove('active'));
  document.getElementById('mainContent').style.display = 'block';
  document.querySelector('nav').classList.remove('nav-hidden');

  if (scrollToProjects) {
    setTimeout(() => {
      document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }
}

window.addEventListener('popstate', () => {
  const hash = window.location.hash.replace('#', '');

  if (hash.startsWith('case-')) {
    const id = hash.replace('case-', '');
    if (caseIds.includes(id)) { showCase(id, false); return; }
  }

  if (categoryIds.includes(hash)) {
    showCategory(hash, false);
    return;
  }

  showMain(hash === 'projects');
});

window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.replace('#', '');

  if (hash.startsWith('case-')) {
    const id = hash.replace('case-', '');
    if (caseIds.includes(id)) {
      history.replaceState({ category: 'mobile' }, '', window.location.pathname + '#mobile');
      history.pushState({ case: id }, '', '#case-' + id);
      showCase(id, false);
      return;
    }
  }

  if (categoryIds.includes(hash)) {
    history.replaceState({ main: true }, '', window.location.pathname + window.location.search + '#projects');
    history.pushState({ category: hash }, '', '#' + hash);
    showCategory(hash, false);
    return;
  }

  history.replaceState({ main: true }, '', window.location.href);
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && contactModal.classList.contains('open')) {
    closeContactModal();
  }
});

// ── Contact Modal ─────────────────────────────────────────────────────────────

const contactModal = document.getElementById('contactModal');
const contactCard  = contactModal.querySelector('.modal-card');

const FOCUSABLE_SEL = [
  'a[href]', 'button:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ');

let modalTrigger = null;

function openContactModal(triggerEl) {
  modalTrigger = triggerEl || null;
  contactModal.setAttribute('aria-hidden', 'false');
  contactModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    const first = contactCard.querySelector(FOCUSABLE_SEL);
    if (first) first.focus();
  });
}

function closeContactModal() {
  contactModal.classList.remove('open');
  contactModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (modalTrigger) { modalTrigger.focus(); modalTrigger = null; }
}

// Backdrop click → close
contactModal.addEventListener('click', (e) => {
  if (e.target === contactModal) closeContactModal();
});

// Close button
contactModal.querySelector('.modal-close').addEventListener('click', closeContactModal);

// Messenger links — close modal on click
contactModal.querySelectorAll('.modal-contact-link').forEach(link => {
  link.addEventListener('click', () => closeContactModal());
});

// Focus trap
contactModal.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const focusable = [...contactCard.querySelectorAll(FOCUSABLE_SEL)];
  if (!focusable.length) return;
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];
  if (e.shiftKey) {
    if (document.activeElement === first) { e.preventDefault(); last.focus(); }
  } else {
    if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
  }
});


