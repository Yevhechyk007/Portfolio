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
const posterIds = ['inner-noise'];

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
  const id = window.location.hash.replace('#', '');

  if (posterIds.includes(id)) {
    showPoster(id, false);
    return;
  }

  if (categoryIds.includes(id)) {
    showCategory(id, false);
    return;
  }

  showMain(id === 'projects');
});

window.addEventListener('DOMContentLoaded', () => {
  const id = window.location.hash.replace('#', '');

  if (posterIds.includes(id)) {
    history.replaceState({ category: 'posters' }, '', window.location.pathname + window.location.search + '#posters');
    history.pushState({ poster: id }, '', '#' + id);
    showPoster(id, false);
    return;
  }

  if (categoryIds.includes(id)) {
    history.replaceState({ main: true }, '', window.location.pathname + window.location.search + '#projects');
    history.pushState({ category: id }, '', '#' + id);
    showCategory(id, false);
    return;
  }

  history.replaceState({ main: true }, '', window.location.href);
});
