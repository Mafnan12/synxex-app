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
import { initAdmin } from './admin.js';
import { initBankingCards } from './cards.js';
import { initMarkets } from './markets.js';
import { initAgents } from './agents.js';
import { initWallet } from './wallet.js';

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
  } else if (activePage === 'banking') {
    initBankingCards();
  } else if (activePage === 'markets') {
    initMarkets();
  } else if (activePage === 'agents') {
    initAgents();
  } else if (activePage === 'wallet') {
    initWallet();
  } else if (activePage === 'remittance') {
    initRemittance();
  } else if (activePage.startsWith('admin-')) {
    initAdmin(activePage);
  }

  // Scroll animations (delayed to let layout settle)
  requestAnimationFrame(() => {
    initScrollAnimations();
  });
});
