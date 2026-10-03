/**
 * SynxEx — Theme Manager
 * Handles light/dark mode toggle with localStorage persistence
 */

const STORAGE_KEY = 'synxex-theme';

export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (saved === 'light') {
    document.documentElement.classList.remove('dark');
  } else if (saved === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    // Follow system preference
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}

export function toggleTheme() {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
}

export function isDarkMode() {
  return document.documentElement.classList.contains('dark');
}
