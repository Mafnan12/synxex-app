/**
 * SynxEx — Sidebar Component
 * Renders the sidebar navigation and handles mobile toggle
 */

export function initSidebar(activePage = 'dashboard') {
  const target = document.getElementById('sidebar');
  if (!target) return;

  const isAdmin = activePage.startsWith('admin-');

  const userPages = [
    { id: 'dashboard', label: 'Dashboard', href: '/index.html', icon: `<path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />` },
    { id: 'markets', label: 'Markets', href: '/pages/markets.html', icon: `<path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />` },
    { id: 'agents', label: 'AI Agents', href: '/pages/agents.html', icon: `<path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />`, badge: 'New' },
    { id: 'wallet', label: 'Wallet', href: '/pages/wallet.html', icon: `<path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />` },
    { id: 'banking', label: 'Banking & Cards', href: '/pages/banking.html', icon: `<path d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />` },
    { id: 'remittance', label: 'Remittance', href: '/pages/remittance.html', icon: `<path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />` },
  ];

  const adminPages = [
    { id: 'admin-dashboard', label: 'Overview', href: '/pages/admin/index.html', icon: `<path d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />` },
    { id: 'admin-users', label: 'User Governance', href: '/pages/admin/users.html', icon: `<path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />`, badge: '284K' },
    { id: 'admin-transactions', label: 'Surveillance Ledger', href: '/pages/admin/transactions.html', icon: `<path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />`, badge: 'Live' },
    { id: 'admin-agents', label: 'AI Fleet Control', href: '/pages/admin/agents.html', icon: `<path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />`, badge: '6 Active' },
    { id: 'admin-markets', label: 'Markets & Liquidity', href: '/pages/admin/markets.html', icon: `<path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />` },
    { id: 'admin-compliance', label: 'KYC & Compliance', href: '/pages/admin/compliance.html', icon: `<path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />`, badge: '4 New' },
    { id: 'admin-settings', label: 'Platform Security', href: '/pages/admin/settings.html', icon: `<path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />` },
  ];

  const currentPages = isAdmin ? adminPages : userPages;
  const isActive = (id) => id === activePage;

  const navLinks = currentPages.map((p) => {
    if (isActive(p.id)) {
      return `<a class="flex items-center gap-3 px-3 py-2 rounded-xl bg-lava/[0.08] text-lava font-medium text-[13px] border border-lava/15 shadow-[0_0_16px_rgba(255,85,36,0.08)]" href="${p.href}">
        <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" viewBox="0 0 24 24">${p.icon}</svg>
        <span>${p.label}</span>
        ${p.badge ? `<span class="ml-auto text-[9px] font-bold bg-lava/15 text-lava border border-lava/20 px-1.5 py-0.5 rounded-md uppercase tracking-wide">${p.badge}</span>` : ''}
      </a>`;
    }
    return `<a class="nav-item flex items-center ${p.badge ? 'justify-between' : 'gap-3'} px-3 py-2 rounded-xl text-[13px]" href="${p.href}" style="color: var(--text-muted);">
      ${p.badge ? '<div class="flex items-center gap-3">' : ''}
      <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" viewBox="0 0 24 24">${p.icon}</svg>
      <span>${p.label}</span>
      ${p.badge ? `</div><span class="text-[9px] font-bold bg-lava/15 text-lava border border-lava/20 px-1.5 py-0.5 rounded-md uppercase tracking-wide">${p.badge}</span>` : ''}
    </a>`;
  }).join('');

  target.innerHTML = `
    <div class="p-5 flex flex-col h-full">
      <!-- Logo -->
      <div class="flex items-center gap-2.5 px-2 py-1 mb-8">
        <div class="relative">
          <svg class="w-8 h-8 text-lava" fill="none" viewBox="0 0 32 32">
            <path d="M16 3L27.2583 9.5V22.5L16 29L4.74167 22.5V9.5L16 3Z" stroke="#FF5524" stroke-linejoin="round" stroke-width="2.2"/>
            <path d="M16 8L22 11.5V18.5L16 22L10 18.5V11.5L16 8Z" fill="#70162B" stroke="#FF5524" stroke-width="1.5"/>
            <circle cx="16" cy="15" fill="#FF5524" r="2.5"/>
          </svg>
          <div class="absolute inset-0 blur-xl bg-lava/20 rounded-full -z-10"></div>
        </div>
        <div class="flex flex-col">
          <a href="${isAdmin ? '/pages/admin/index.html' : '/index.html'}" class="text-[17px] font-bold tracking-tight flex items-center gap-0.5" style="color: var(--text-primary); text-decoration: none;">
            Synx<span class="text-lava">Ex</span>
          </a>
          <span class="text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1.5" style="color: var(--text-muted);">
            ${isAdmin ? '<span class="text-lava font-bold">Control Plane</span>' : 'Terminal OS'}
          </span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="space-y-0.5">
        ${navLinks}
        ${!isAdmin ? `
        <a class="nav-item flex items-center justify-between px-3 py-2 rounded-xl text-[13px]" href="/pages/admin/index.html" style="color: var(--text-muted);">
          <div class="flex items-center gap-3">
            <svg class="w-[18px] h-[18px] text-amber-500" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            <span>Admin Console</span>
          </div>
          <span class="text-[9px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-md uppercase tracking-wide">Root</span>
        </a>
        ` : ''}
      </nav>

      <!-- Bottom -->
      <div class="mt-auto space-y-3 pt-4" style="border-top: 1px solid var(--border-subtle);">
        <div class="space-y-0.5">
          ${isAdmin ? `
          <a class="nav-item flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold hover:text-lava transition border border-dashed border-lava/30 bg-lava/5" href="/index.html" style="color: var(--text-primary);">
            <svg class="w-4 h-4 text-lava" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            <span>Switch to User App</span>
          </a>
          ` : `
          <a class="nav-item flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs" href="/pages/settings.html" style="color: var(--text-muted);">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span>Settings</span>
          </a>
          <a class="nav-item flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs" href="#" style="color: var(--text-muted);">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" viewBox="0 0 24 24"><path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>Help &amp; Support</span>
          </a>
          `}
        </div>
        <div class="glass rounded-xl p-3 flex items-center justify-between text-xs theme-transition">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <span class="text-[11px] font-medium" style="color: var(--text-secondary);">${isAdmin ? 'Cluster 01: Secure' : 'All systems operational'}</span>
          </div>
          <span class="text-[10px] font-mono" style="color: var(--text-faint);">${isAdmin ? '4.2ms' : '99.98%'}</span>
        </div>
      </div>
    </div>
  `;

  // Mobile sidebar toggle
  const overlay = document.getElementById('sidebarOverlay');
  if (overlay) {
    overlay.addEventListener('click', () => {
      target.classList.remove('open');
      overlay.classList.remove('open');
    });
  }
}

export function toggleMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open');
}
