/**
 * SynxEx — Modal System
 * Handles all modals: command palette, deposit/withdraw/transfer/trade
 */

let activeModal = null;

export function initModals() {
  // Global keyboard shortcut for command palette
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const palette = document.getElementById('commandPalette');
      if (palette) toggleModal(palette);
    }
    if (e.key === 'Escape' && activeModal) {
      closeModal(activeModal);
    }
  });

  // Close on overlay click
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      closeModal(e.target);
    }
  });
}

export function openModal(modalEl) {
  if (!modalEl) return;
  if (activeModal) closeModal(activeModal);

  modalEl.hidden = false;
  activeModal = modalEl;
  document.body.style.overflow = 'hidden';

  // Focus first input or button
  requestAnimationFrame(() => {
    const focusTarget = modalEl.querySelector('input, button, [tabindex="0"]');
    if (focusTarget) focusTarget.focus();
  });
}

export function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.hidden = true;
  activeModal = null;
  document.body.style.overflow = '';
}

export function toggleModal(modalEl) {
  if (modalEl.hidden) {
    openModal(modalEl);
  } else {
    closeModal(modalEl);
  }
}
