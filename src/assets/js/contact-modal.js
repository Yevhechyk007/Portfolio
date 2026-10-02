const contactModal = document.getElementById('contactModal');
if (contactModal) {
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
    if (!contactModal.classList.contains('open')) return;
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


document.querySelectorAll("[data-contact-open]").forEach(button => button.addEventListener("click", () => openContactModal(button)));
document.addEventListener("keydown", event => { if (event.key === "Escape" && contactModal.classList.contains("open")) closeContactModal(); });
}
