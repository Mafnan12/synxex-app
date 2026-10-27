/**
 * SynxEx — Theme Manager
 * Handles light/dark mode toggle with localStorage persistence
 */

const STORAGE_KEY = 'synxex-theme';

export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);

  // Default to dark theme across the entire application to match marketing aesthetic
  if (saved === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }
}

export function toggleTheme() {
  const root = document.documentElement;
  root.classList.add('theme-changing');
  root.classList.toggle('dark');
  const isDark = root.classList.contains('dark');
  localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');

  // Immediately remove theme-changing on next animation frames so hover states work
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      root.classList.remove('theme-changing');
    });
  });
}

export function isDarkMode() {
  return document.documentElement.classList.contains('dark');
}
