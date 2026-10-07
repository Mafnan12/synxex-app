/**
 * SynxEx — Header Component
 * Renders the top navigation bar with search, theme toggle, notifications, user menu
 */

import { toggleTheme } from '../theme.js';
import { toggleDropdown } from '../dropdown.js';
import { openModal } from '../modal.js';
import { toggleMobileSidebar } from './sidebar.js';

export function initHeader() {
  const target = document.getElementById('header');
  if (!target) return;

  target.innerHTML = `
    <div class="h-14 topbar-glass px-6 flex items-center justify-between sticky top-0 z-20 theme-transition" style="border-bottom: 1px solid var(--border-subtle);">
      <!-- Left: Hamburger + Search -->
      <div class="flex items-center gap-3">
        <!-- Mobile hamburger -->
        <button class="hamburger items-center justify-center" id="hamburgerBtn" aria-label="Open navigation" style="color: var(--text-muted);">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/></svg>
        </button>
        <!-- Search -->
        <div class="w-80 relative hidden sm:block">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style="color: var(--text-faint);">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
          </div>
          <input class="w-full rounded-lg pl-8 pr-12 py-1.5 text-xs focus:outline-none transition theme-transition cursor-pointer" placeholder="Search markets, assets, agents..." type="text" readonly id="searchTrigger"
            style="background: var(--bg-input); border: 1px solid var(--border-subtle); color: var(--text-primary);" />
          <div class="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <kbd class="text-[10px] font-medium px-1.5 py-0.5 rounded" style="color: var(--text-faint); background: var(--bg-pill); border: 1px solid var(--border-subtle);">⌘K</kbd>
          </div>
        </div>
      </div>
      <!-- Right -->
      <div class="flex items-center gap-4">
        <!-- Theme Toggle -->
        <div class="theme-toggle" id="themeToggle" title="Toggle light / dark mode" role="switch" aria-label="Toggle theme">
          <div class="knob">
            <svg class="icon-sun" fill="none" stroke="#F59E0B" viewBox="0 0 24 24" stroke-width="2">
              <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg class="icon-moon" fill="none" stroke="#818CF8" viewBox="0 0 24 24" stroke-width="2">
              <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <div class="h-3.5 w-px" style="background: var(--border-subtle);"></div>

        <!-- Market Status -->
        <div class="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium" style="background: var(--emerald-bg); border: 1px solid var(--emerald-border); color: #10B981;">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Markets open</span>
        </div>

        <span class="text-[11px] font-mono hidden xl:block num-tabular" style="color: var(--text-faint);" id="liveDateTime"></span>

        <div class="h-3.5 w-px hidden md:block" style="background: var(--border-subtle);"></div>

        <!-- Notifications -->
        <div class="relative">
          <button aria-label="Notifications" class="relative p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/[0.04] transition btn-press" id="notifBtn" style="color: var(--text-muted);">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/></svg>
            <span class="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-lava text-white text-[8px] font-bold rounded-full flex items-center justify-center" style="border: 2px solid var(--bg-page);">3</span>
          </button>
          <!-- Notification Dropdown -->
          <div class="dropdown" id="notifDropdown" hidden>
            <div class="p-4 flex items-center justify-between" style="border-bottom: 1px solid var(--border-subtle);">
              <span class="text-sm font-semibold" style="color: var(--text-primary);">Notifications</span>
              <button class="text-[11px] font-medium text-lava hover:underline btn-press" id="markAllReadBtn">Mark all read</button>
            </div>
            <div class="max-h-[320px] overflow-y-auto">
              <div class="dropdown-item" style="border-bottom: 1px solid var(--border-subtle);">
                <div class="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold truncate" style="color: var(--text-primary);">BTC purchase completed</p>
                  <p class="text-[11px] mt-0.5" style="color: var(--text-faint);">0.01918 BTC • 2 min ago</p>
                </div>
              </div>
              <div class="dropdown-item" style="border-bottom: 1px solid var(--border-subtle);">
                <div class="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold truncate" style="color: var(--text-primary);">USDT deposit pending</p>
                  <p class="text-[11px] mt-0.5" style="color: var(--text-faint);">2 of 12 confirmations • 45 min ago</p>
                </div>
              </div>
              <div class="dropdown-item">
                <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style="background: rgba(255,85,36,0.1);">
                  <svg class="w-4 h-4 text-lava" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold truncate" style="color: var(--text-primary);">Alpha Trader: New signal</p>
                  <p class="text-[11px] mt-0.5" style="color: var(--text-faint);">ETH long opportunity • 1h ago</p>
                </div>
              </div>
            </div>
            <div class="p-3 text-center" style="border-top: 1px solid var(--border-subtle);">
              <a href="#" class="text-[11px] font-medium text-lava hover:underline">View all notifications →</a>
            </div>
          </div>
        </div>

        <!-- User Menu -->
        <div class="relative">
          <div class="flex items-center gap-2 pl-1 cursor-pointer group btn-press" id="userMenuBtn">
            <div class="w-7 h-7 rounded-full bg-gradient-to-tr from-lava to-burgundy flex items-center justify-center text-white text-[11px] font-bold border border-white/15 shadow-lg shadow-lava/10">A</div>
            <span class="text-xs font-semibold group-hover:text-lava transition hidden sm:inline" style="color: var(--text-secondary);">Afnan</span>
            <svg class="w-3 h-3 group-hover:text-lava transition" fill="none" stroke="currentColor" style="color: var(--text-faint);" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
          </div>
          <!-- User Dropdown -->
          <div class="dropdown" id="userDropdown" hidden>
            <div class="p-4 flex items-center gap-3" style="border-bottom: 1px solid var(--border-subtle);">
              <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-lava to-burgundy flex items-center justify-center text-white text-sm font-bold border border-white/15">A</div>
              <div>
                <p class="text-sm font-semibold" style="color: var(--text-primary);">Afnan</p>
                <p class="text-[11px]" style="color: var(--text-faint);">afnan@synxex.com</p>
              </div>
            </div>
            <div class="py-1">
              <a href="/pages/settings.html" class="dropdown-item">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" style="color: var(--text-muted);" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/></svg>
                <span>Profile</span>
              </a>
              <a href="/pages/settings.html" class="dropdown-item">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" style="color: var(--text-muted);" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/></svg>
                <span>Settings</span>
              </a>
              <a href="#" class="dropdown-item">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" style="color: var(--text-muted);" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/></svg>
                <span>Security</span>
              </a>
            </div>
            <div class="py-1" style="border-top: 1px solid var(--border-subtle);">
              <a href="/pages/login.html" class="dropdown-item" style="color: #F43F5E;">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/></svg>
                <span>Sign out</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Wire up event listeners
  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
  document.getElementById('notifBtn')?.addEventListener('click', () => toggleDropdown(document.getElementById('notifDropdown')));
  document.getElementById('userMenuBtn')?.addEventListener('click', () => toggleDropdown(document.getElementById('userDropdown')));
  document.getElementById('hamburgerBtn')?.addEventListener('click', toggleMobileSidebar);

  // Search trigger opens command palette
  document.getElementById('searchTrigger')?.addEventListener('click', () => {
    const palette = document.getElementById('commandPalette');
    if (palette) openModal(palette);
  });

  // Live date/time
  function updateTime() {
    const now = new Date();
    const el = document.getElementById('liveDateTime');
    if (el) {
      el.textContent = now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
        + ' · ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    }
  }
  updateTime();
  setInterval(updateTime, 30000);
}
