/**
 * SynxEx — Dropdown Manager
 * Handles all dropdown menus (notifications, user menu, etc.)
 */

const activeDropdowns = new Set();

export function initDropdowns() {
  document.addEventListener('click', (e) => {
    // Close all dropdowns when clicking outside
    activeDropdowns.forEach((dropdown) => {
      const trigger = dropdown.previousElementSibling || document.querySelector(`[data-dropdown="${dropdown.id}"]`);
      if (!dropdown.contains(e.target) && (!trigger || !trigger.contains(e.target))) {
        closeDropdown(dropdown);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      activeDropdowns.forEach(closeDropdown);
    }
  });
}

export function toggleDropdown(dropdownEl) {
  if (!dropdownEl) return;
  const isHidden = dropdownEl.hidden;

  // Close all other dropdowns first
  activeDropdowns.forEach(closeDropdown);

  if (isHidden) {
    openDropdown(dropdownEl);
  }
}

function openDropdown(el) {
  el.hidden = false;
  activeDropdowns.add(el);
  // Focus first interactive element
  const firstFocusable = el.querySelector('a, button, input');
  if (firstFocusable) firstFocusable.focus();
}

function closeDropdown(el) {
  el.hidden = true;
  activeDropdowns.delete(el);
}
