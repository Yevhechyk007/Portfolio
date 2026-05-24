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
function openCategory(id) {
  document.getElementById('mainContent').style.display = 'none';
  document.querySelectorAll('.category-page').forEach(p => p.classList.remove('active'));
  document.getElementById('cat-' + id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openCategoryFromKeyboard(event, id) {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  openCategory(id);
}

function closeCategory() {
  document.querySelectorAll('.category-page').forEach(p => p.classList.remove('active'));
  document.getElementById('mainContent').style.display = 'block';
  setTimeout(() => {
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
  }, 50);
}

function showMain() {
  document.querySelectorAll('.category-page').forEach(p => p.classList.remove('active'));
  document.getElementById('mainContent').style.display = 'block';
}
