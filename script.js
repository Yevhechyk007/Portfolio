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
const categoryIds = ['mobile', 'landings', 'posters', 'templates'];
const posterIds = ['inner-noise', 'city-of-tomorrow', 'rebuild-yourself', 'matcha-focus'];
const caseIds = ['mobile-v1'];

function showCategory(id, shouldScroll = true) {
  document.getElementById('mainContent').style.display = 'none';
  document.querySelectorAll('.category-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.poster-detail-page').forEach(p => p.classList.remove('active'));
  document.getElementById('cat-' + id)?.classList.add('active');

  if (shouldScroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function showPoster(id, shouldScroll = true) {
  document.getElementById('mainContent').style.display = 'none';
  document.querySelectorAll('.category-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.poster-detail-page').forEach(p => p.classList.remove('active'));
  document.getElementById('poster-' + id)?.classList.add('active');

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

function openPoster(id) {
  showPoster(id);
  history.pushState({ poster: id }, '', '#' + id);
}

function openPosterFromKeyboard(event, id) {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  openPoster(id);
}

function closePoster() {
  if (history.state?.poster) {
    history.replaceState({ category: 'posters' }, '', window.location.pathname + window.location.search + '#posters');
  }
  showCategory('posters');
}

function showCase(id, shouldScroll = true) {
  document.getElementById('mainContent').style.display = 'none';
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

function openImageModal(src, alt) {
  const modal = document.getElementById('imageModal');
  const image = document.getElementById('imageModalImg');

  image.src = src;
  image.alt = alt;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeImageModal() {
  const modal = document.getElementById('imageModal');
  const image = document.getElementById('imageModalImg');

  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  image.src = '';
  image.alt = '';
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

  if (posterIds.includes(hash)) {
    showPoster(hash, false);
    return;
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

  if (posterIds.includes(hash)) {
    history.replaceState({ category: 'posters' }, '', window.location.pathname + window.location.search + '#posters');
    history.pushState({ poster: hash }, '', '#' + hash);
    showPoster(hash, false);
    return;
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
  if (event.key === 'Escape') {
    if (contactModal.classList.contains('open')) {
      closeContactModal();
    } else {
      closeImageModal();
    }
  }
});

// ── Contact Modal ─────────────────────────────────────────────────────────────

const contactModal   = document.getElementById('contactModal');
const contactCard    = contactModal.querySelector('.modal-card');
const contactForm    = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');

const FOCUSABLE_SEL = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])',
  'textarea:not([disabled])', 'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ');

let modalTrigger = null;

function openContactModal(triggerEl) {
  modalTrigger = triggerEl || null;
  resetModal();
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
  if (modalTrigger) {
    modalTrigger.focus();
    modalTrigger = null;
  }
}

function resetModal() {
  // Go back to first tab
  switchTab('connect');
  // Clear form
  if (contactForm) {
    contactForm.reset();
    contactForm.classList.remove('modal-panel--hidden');
    contactForm.querySelectorAll('.field-invalid').forEach(el => el.classList.remove('field-invalid'));
    contactForm.querySelectorAll('.field-error-msg').forEach(el => el.remove());
    const btn = contactForm.querySelector('.modal-submit');
    if (btn) { btn.disabled = false; btn.textContent = 'Send message'; btn.appendChild(createArrowSvg()); }
  }
  // Hide success
  if (contactSuccess) contactSuccess.classList.add('modal-panel--hidden');
}

function createArrowSvg() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('width', '14');
  svg.setAttribute('height', '14');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M7 17L17 7M17 7H7M17 7V17');
  svg.appendChild(path);
  return svg;
}

function switchTab(tabId) {
  contactModal.querySelectorAll('.modal-tab').forEach(t => {
    const active = t.dataset.tab === tabId;
    t.classList.toggle('active', active);
    t.setAttribute('aria-selected', String(active));
  });
  contactModal.querySelectorAll('.modal-panel').forEach(p => {
    p.classList.toggle('modal-panel--hidden', p.id !== 'tab-' + tabId);
  });
}

// Backdrop click → close
contactModal.addEventListener('click', (e) => {
  if (e.target === contactModal) closeContactModal();
});

// Close button
contactModal.querySelector('.modal-close').addEventListener('click', closeContactModal);

// Tab switching
contactModal.querySelectorAll('.modal-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    switchTab(tab.dataset.tab);
    const panel = document.getElementById('tab-' + tab.dataset.tab);
    const first = panel?.querySelector(FOCUSABLE_SEL);
    if (first) first.focus();
  });
});

// Messenger links — close modal when clicked
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

// Form submission — Netlify Forms
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    contactForm.querySelectorAll('.field-invalid').forEach(el => el.classList.remove('field-invalid'));
    contactForm.querySelectorAll('.field-error-msg').forEach(el => el.remove());

    // Validate
    let valid = true;
    contactForm.querySelectorAll('[required]').forEach(field => {
      let msg = '';
      if (!field.value.trim()) {
        msg = 'This field is required.';
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
        msg = 'Please enter a valid email address.';
      }
      if (msg) {
        valid = false;
        field.classList.add('field-invalid');
        const err = document.createElement('span');
        err.className = 'field-error-msg';
        err.textContent = msg;
        field.after(err);
      }
    });
    if (!valid) return;

    // Submit
    const submitBtn = contactForm.querySelector('.modal-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const body = new URLSearchParams(new FormData(contactForm)).toString();
      console.log('[contact form] submitting:', body);
      const res  = await fetch('/', {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      console.log('[contact form] response status:', res.status);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      contactForm.classList.add('modal-panel--hidden');
      contactSuccess.classList.remove('modal-panel--hidden');
    } catch (err) {
      console.error('[contact form] submission failed:', err);
      submitBtn.disabled = false;
      submitBtn.textContent = '';
      submitBtn.appendChild(document.createTextNode('Send message'));
      submitBtn.appendChild(createArrowSvg());
      const errEl = document.createElement('p');
      errEl.className = 'field-error-msg';
      errEl.style.marginTop = '10px';
      errEl.textContent = 'Something went wrong — try emailing me directly.';
      submitBtn.after(errEl);
    }
  });
}


