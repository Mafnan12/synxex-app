/**
 * SynxEx — Main Application Entry
 * Bootstraps all modules and page-specific logic
 */

import '../css/app.css';
import { initTheme } from './theme.js';
import { initDropdowns } from './dropdown.js';
import { initModals } from './modal.js';
import { initTabs } from './tabs.js';
import { initScrollAnimations } from './scroll.js';
import { initSidebar } from './components/sidebar.js';
import { initHeader } from './components/header.js';
import { initDashboard } from './dashboard.js';
import { initRemittance } from './remittance.js';

// Initialize theme first (prevents flash)
initTheme();

// DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Detect active page from data attribute
  const activePage = document.body.dataset.page || 'dashboard';

  // Initialize shared components
  initSidebar(activePage);
  initHeader();
  initDropdowns();
  initModals();
  initTabs();

  // Initialize page-specific logic
  if (activePage === 'dashboard') {
    initDashboard();
  } else if (activePage === 'remittance') {
    initRemittance();
  }

  // Scroll animations (delayed to let layout settle)
  requestAnimationFrame(() => {
    initScrollAnimations();
  });
});
