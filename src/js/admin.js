/**
 * SynxEx — Admin Control Plane Controller
 * Provides interactive charts, user management, transaction AML inspection,
 * AI fleet management, market circuit breakers, and KYC verification queues.
 */

import { showToast } from './toast.js';
import { openModal, closeModal } from './modal.js';

export function initAdmin(activePage) {
  switch (activePage) {
    case 'admin-dashboard':
      initAdminDashboard();
      break;
    case 'admin-users':
      initAdminUsers();
      break;
    case 'admin-transactions':
      initAdminTransactions();
      break;
    case 'admin-agents':
      initAdminAgents();
      break;
    case 'admin-markets':
      initAdminMarkets();
      break;
    case 'admin-compliance':
      initAdminCompliance();
      break;
    case 'admin-settings':
      initAdminSettings();
      break;
    default:
      initAdminDashboard();
  }
}

// -------------------------------------------------------------
// 1. Admin Command Center (admin-dashboard)
// -------------------------------------------------------------
function initAdminDashboard() {
  const chartSvg = document.getElementById('adminChartSvg');
  const lineBtn = document.getElementById('chartModeLine');
  const barBtn = document.getElementById('chartModeBar');
  const rangeBtns = document.querySelectorAll('[data-admin-range]');
  const statVolume = document.getElementById('adminVolumeStat');
  const statTrades = document.getElementById('adminTradesStat');
  const statRevenue = document.getElementById('adminRevenueStat');

  let currentMode = 'line';
  let currentRange = '24H';

  const chartData = {
    '24H': {
      volume: '$42,852,190',
      trades: '48,120',
      revenue: '$64,280',
      points: [24, 38, 31, 49, 58, 42, 65, 59, 78, 71, 89, 94],
      labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
    },
    '7D': {
      volume: '$284,190,450',
      trades: '312,400',
      revenue: '$426,280',
      points: [40, 48, 62, 55, 74, 82, 91],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    '30D': {
      volume: '$1,194,520,000',
      trades: '1,420,900',
      revenue: '$1,791,800',
      points: [30, 42, 38, 51, 60, 58, 72, 69, 81, 88, 95, 99],
      labels: ['W1', 'W2', 'W3', 'W4']
    },
    '90D': {
      volume: '$3,820,100,000',
      trades: '4,610,200',
      revenue: '$5,730,150',
      points: [25, 35, 48, 58, 64, 71, 78, 86, 92, 98],
      labels: ['M1', 'M2', 'M3']
    },
    '1Y': {
      volume: '$14,280,000,000',
      trades: '18,400,000',
      revenue: '$21,420,000',
      points: [20, 28, 35, 45, 52, 61, 70, 77, 83, 89, 94, 100],
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  };

  function renderChart() {
    if (!chartSvg) return;
    const config = chartData[currentRange] || chartData['24H'];
    const pts = config.points;
    const width = 800;
    const height = 240;
    const padX = 40;
    const padY = 30;

    const minVal = Math.min(...pts) * 0.85;
    const maxVal = Math.max(...pts) * 1.05;
    const stepX = (width - padX * 2) / (pts.length - 1);

    const coords = pts.map((val, idx) => {
      const x = padX + idx * stepX;
      const y = height - padY - ((val - minVal) / (maxVal - minVal)) * (height - padY * 2);
      return { x, y, val };
    });

    if (currentMode === 'line') {
      const pathD = coords.reduce((acc, pt, i) => {
        if (i === 0) return `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
        const prev = coords[i - 1];
        const cx1 = prev.x + (pt.x - prev.x) / 2;
        const cy1 = prev.y;
        const cx2 = prev.x + (pt.x - prev.x) / 2;
        const cy2 = pt.y;
        return `${acc} C ${cx1.toFixed(1)} ${cy1.toFixed(1)}, ${cx2.toFixed(1)} ${cy2.toFixed(1)}, ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
      }, '');

      const areaD = `${pathD} L ${coords[coords.length - 1].x.toFixed(1)} ${(height - padY).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(height - padY).toFixed(1)} Z`;

      chartSvg.innerHTML = `
        <defs>
          <linearGradient id="adminLineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FF5524" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#FF5524" stop-opacity="0.0"/>
          </linearGradient>
          <linearGradient id="adminStrokeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#70162B"/>
            <stop offset="50%" stop-color="#FF5524"/>
            <stop offset="100%" stop-color="#FF8A65"/>
          </linearGradient>
        </defs>
        <!-- Grid lines -->
        <line x1="${padX}" y1="${padY}" x2="${width - padX}" y2="${padY}" stroke="var(--border-subtle)" stroke-dasharray="3 3"/>
        <line x1="${padX}" y1="${height / 2}" x2="${width - padX}" y2="${height / 2}" stroke="var(--border-subtle)" stroke-dasharray="3 3"/>
        <line x1="${padX}" y1="${height - padY}" x2="${width - padX}" y2="${height - padY}" stroke="var(--border-subtle)"/>
        <!-- Area fill -->
        <path d="${areaD}" fill="url(#adminLineGrad)" />
        <!-- Stroke -->
        <path d="${pathD}" fill="none" stroke="url(#adminStrokeGrad)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <!-- Dot markers -->
        ${coords.map(pt => `
          <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="4" fill="#FF5524" stroke="#080A12" stroke-width="2" class="cursor-pointer transition-transform hover:scale-150" />
        `).join('')}
      `;
    } else {
      // Bar Chart mode
      const barWidth = Math.min(28, (width - padX * 2) / (pts.length * 1.6));
      chartSvg.innerHTML = `
        <!-- Grid lines -->
        <line x1="${padX}" y1="${padY}" x2="${width - padX}" y2="${padY}" stroke="var(--border-subtle)" stroke-dasharray="3 3"/>
        <line x1="${padX}" y1="${height / 2}" x2="${width - padX}" y2="${height / 2}" stroke="var(--border-subtle)" stroke-dasharray="3 3"/>
        <line x1="${padX}" y1="${height - padY}" x2="${width - padX}" y2="${height - padY}" stroke="var(--border-subtle)"/>
        <!-- Bars -->
        ${coords.map(pt => {
          const barH = (height - padY) - pt.y;
          return `
            <rect x="${(pt.x - barWidth / 2).toFixed(1)}" y="${pt.y.toFixed(1)}" width="${barWidth}" height="${barH.toFixed(1)}"
              rx="4" fill="#FF5524" fill-opacity="0.85" class="transition-opacity hover:opacity-100 cursor-pointer" />
          `;
        }).join('')}
      `;
    }

    if (statVolume) statVolume.textContent = config.volume;
    if (statTrades) statTrades.textContent = config.trades;
    if (statRevenue) statRevenue.textContent = config.revenue;
  }

  // Toggle buttons
  lineBtn?.addEventListener('click', () => {
    currentMode = 'line';
    lineBtn.classList.add('bg-lava', 'text-white');
    lineBtn.classList.remove('text-muted');
    barBtn?.classList.remove('bg-lava', 'text-white');
    renderChart();
  });

  barBtn?.addEventListener('click', () => {
    currentMode = 'bar';
    barBtn.classList.add('bg-lava', 'text-white');
    barBtn.classList.remove('text-muted');
    lineBtn?.classList.remove('bg-lava', 'text-white');
    renderChart();
  });

  rangeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      rangeBtns.forEach(b => {
        b.classList.remove('bg-lava', 'text-white');
        b.classList.add('text-muted');
      });
      btn.classList.add('bg-lava', 'text-white');
      btn.classList.remove('text-muted');
      currentRange = btn.dataset.adminRange || '24H';
      renderChart();
      showToast(`Timescale updated: ${currentRange}`, 'info');
    });
  });

  // Emergency action buttons
  document.getElementById('emergencyHaltBtn')?.addEventListener('click', () => {
    showToast('Platform Circuit Breakers armed: Order routing normal', 'warning');
  });

  document.getElementById('flushCacheBtn')?.addEventListener('click', () => {
    showToast('Edge memory and redis caches successfully purged', 'success');
  });

  renderChart();
}

// -------------------------------------------------------------
// 2. User & Account Governance (admin-users)
// -------------------------------------------------------------
function initAdminUsers() {
  const searchInput = document.getElementById('userSearchInput');
  const userRows = document.querySelectorAll('[data-user-row]');
  const userModal = document.getElementById('userModal');
  const filterTabs = document.querySelectorAll('[data-user-filter]');

  let activeFilter = 'all';

  function applyFilters() {
    const query = (searchInput?.value || '').toLowerCase().trim();
    userRows.forEach(row => {
      const name = (row.dataset.userName || '').toLowerCase();
      const email = (row.dataset.userEmail || '').toLowerCase();
      const role = row.dataset.userRole || '';
      const status = row.dataset.userStatus || '';

      const matchesQuery = !query || name.includes(query) || email.includes(query);
      let matchesFilter = true;

      if (activeFilter === 'pending') matchesFilter = status === 'pending';
      else if (activeFilter === 'vip') matchesFilter = role === 'vip';
      else if (activeFilter === 'flagged') matchesFilter = status === 'flagged';
      else if (activeFilter === 'frozen') matchesFilter = status === 'frozen';

      row.style.display = matchesQuery && matchesFilter ? '' : 'none';
    });
  }

  searchInput?.addEventListener('input', applyFilters);

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active', 'border-lava', 'text-lava'));
      tab.classList.add('active', 'border-lava', 'text-lava');
      activeFilter = tab.dataset.userFilter || 'all';
      applyFilters();
    });
  });

  // User detail inspection triggers
  document.querySelectorAll('[data-inspect-user]').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('[data-user-row]');
      if (!row) return;

      const name = row.dataset.userName || 'User';
      const email = row.dataset.userEmail || 'user@synxex.com';
      const balance = row.dataset.userBalance || '$0.00';
      const tier = row.dataset.userTier || 'Tier 1';
      const status = row.dataset.userStatus || 'Active';

      const modalTitle = document.getElementById('inspectUserName');
      const modalEmail = document.getElementById('inspectUserEmail');
      const modalBal = document.getElementById('inspectUserBalance');
      const modalTier = document.getElementById('inspectUserTier');
      const modalStatus = document.getElementById('inspectUserStatus');

      if (modalTitle) modalTitle.textContent = name;
      if (modalEmail) modalEmail.textContent = email;
      if (modalBal) modalBal.textContent = balance;
      if (modalTier) modalTier.textContent = tier;
      if (modalStatus) modalStatus.textContent = status;

      if (userModal) openModal(userModal);
    });
  });

  // Modal actions
  document.getElementById('freezeUserBtn')?.addEventListener('click', () => {
    if (userModal) closeModal(userModal);
    showToast('Account status updated to FROZEN: withdrawals suspended', 'warning');
  });

  document.getElementById('verifyUserBtn')?.addEventListener('click', () => {
    if (userModal) closeModal(userModal);
    showToast('User verified and upgraded to KYC Tier 3 (VIP Institutional)', 'success');
  });

  document.getElementById('reset2faBtn')?.addEventListener('click', () => {
    if (userModal) closeModal(userModal);
    showToast('One-time 2FA reset authorization email dispatched', 'info');
  });
}

// -------------------------------------------------------------
// 3. Real-Time Transaction Ledger & AML (admin-transactions)
// -------------------------------------------------------------
function initAdminTransactions() {
  const searchInput = document.getElementById('txSearchInput');
  const rows = document.querySelectorAll('[data-tx-row]');
  const filterTabs = document.querySelectorAll('[data-tx-filter]');
  const txModal = document.getElementById('txInspectModal');

  let activeFilter = 'all';

  function applyFilters() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    rows.forEach(row => {
      const hash = (row.dataset.txHash || '').toLowerCase();
      const user = (row.dataset.txUser || '').toLowerCase();
      const risk = row.dataset.txRisk || 'low';
      const type = row.dataset.txType || '';

      const matchesQ = !q || hash.includes(q) || user.includes(q);
      let matchesFilter = true;

      if (activeFilter === 'high') matchesFilter = risk === 'high';
      else if (activeFilter === 'medium') matchesFilter = risk === 'medium';
      else if (activeFilter === 'crypto') matchesFilter = type === 'crypto';
      else if (activeFilter === 'remittance') matchesFilter = type === 'remittance';

      row.style.display = matchesQ && matchesFilter ? '' : 'none';
    });
  }

  searchInput?.addEventListener('input', applyFilters);

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active', 'border-lava', 'text-lava'));
      tab.classList.add('active', 'border-lava', 'text-lava');
      activeFilter = tab.dataset.txFilter || 'all';
      applyFilters();
    });
  });

  // Inspect Transaction Trigger
  document.querySelectorAll('[data-inspect-tx]').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('[data-tx-row]');
      if (!row) return;

      const hash = row.dataset.txHash || '0x4f...89b';
      const amount = row.dataset.txAmount || '$0.00';
      const risk = row.dataset.txRisk || 'low';
      const user = row.dataset.txUser || 'Anonymous';

      const hashEl = document.getElementById('inspectTxHash');
      const amtEl = document.getElementById('inspectTxAmount');
      const riskEl = document.getElementById('inspectTxRisk');
      const userEl = document.getElementById('inspectTxUser');

      if (hashEl) hashEl.textContent = hash;
      if (amtEl) amtEl.textContent = amount;
      if (riskEl) riskEl.textContent = risk.toUpperCase();
      if (userEl) userEl.textContent = user;

      if (txModal) openModal(txModal);
    });
  });

  // Modal actions
  document.getElementById('approveTxBtn')?.addEventListener('click', () => {
    if (txModal) closeModal(txModal);
    showToast('Transaction cleared and signed by Hot Wallet Multi-Sig', 'success');
  });

  document.getElementById('blockTxBtn')?.addEventListener('click', () => {
    if (txModal) closeModal(txModal);
    showToast('Transfer blocked and funds quarantined for AML review', 'error');
  });
}

// -------------------------------------------------------------
// 4. AI Fleet Management (admin-agents)
// -------------------------------------------------------------
function initAdminAgents() {
  const toggleBtns = document.querySelectorAll('[data-agent-toggle]');
  const pauseAllBtn = document.getElementById('pauseAllAgentsBtn');

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('[data-agent-card]');
      const name = card?.dataset.agentName || 'Agent';
      const isRunning = btn.dataset.agentRunning === 'true';

      if (isRunning) {
        btn.dataset.agentRunning = 'false';
        btn.textContent = 'Resume Bot';
        btn.classList.remove('btn-lava');
        btn.classList.add('btn-ghost');
        showToast(`${name} has been paused from order routing`, 'warning');
      } else {
        btn.dataset.agentRunning = 'true';
        btn.textContent = 'Pause Bot';
        btn.classList.add('btn-lava');
        btn.classList.remove('btn-ghost');
        showToast(`${name} strategy active and executing orders`, 'success');
      }
    });
  });

  pauseAllBtn?.addEventListener('click', () => {
    toggleBtns.forEach(btn => {
      btn.dataset.agentRunning = 'false';
      btn.textContent = 'Resume Bot';
      btn.classList.remove('btn-lava');
      btn.classList.add('btn-ghost');
    });
    showToast('All 6 AI trading models temporarily stopped', 'warning');
  });

  // Sliders for risk ceiling
  document.querySelectorAll('[data-risk-slider]').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const valEl = slider.parentElement?.querySelector('.risk-val');
      if (valEl) valEl.textContent = `${e.target.value}x Max`;
    });
  });
}

// -------------------------------------------------------------
// 5. Market Engine & Liquidity Control (admin-markets)
// -------------------------------------------------------------
function initAdminMarkets() {
  document.querySelectorAll('[data-halt-pair]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pair = btn.dataset.haltPair || 'Pair';
      const halted = btn.dataset.isHalted === 'true';

      if (halted) {
        btn.dataset.isHalted = 'false';
        btn.textContent = 'Halt Trading';
        btn.classList.remove('bg-emerald-500/20', 'text-emerald-400');
        showToast(`${pair} trading pair re-enabled on matching engine`, 'success');
      } else {
        btn.dataset.isHalted = 'true';
        btn.textContent = 'Resume Trading';
        btn.classList.add('bg-emerald-500/20', 'text-emerald-400');
        showToast(`Circuit Breaker: ${pair} spot trading halted immediately`, 'error');
      }
    });
  });

  document.getElementById('saveMarketFeesBtn')?.addEventListener('click', () => {
    showToast('Maker/Taker spreads updated and pushed to matching engine', 'success');
  });
}

// -------------------------------------------------------------
// 6. Compliance & KYC Verification Queue (admin-compliance)
// -------------------------------------------------------------
function initAdminCompliance() {
  const kycModal = document.getElementById('kycInspectModal');
  const countBadge = document.getElementById('pendingKycCount');

  document.querySelectorAll('[data-review-kyc]').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('[data-kyc-row]');
      if (!row) return;

      const name = row.dataset.applicantName || 'Applicant';
      const docType = row.dataset.applicantDoc || 'Passport';
      const country = row.dataset.applicantCountry || 'United Kingdom';

      const nameEl = document.getElementById('kycApplicantName');
      const docEl = document.getElementById('kycApplicantDoc');
      const countryEl = document.getElementById('kycApplicantCountry');

      if (nameEl) nameEl.textContent = name;
      if (docEl) docEl.textContent = docType;
      if (countryEl) countryEl.textContent = country;

      if (kycModal) openModal(kycModal);
    });
  });

  document.getElementById('approveKycDocBtn')?.addEventListener('click', () => {
    if (kycModal) closeModal(kycModal);
    showToast('KYC Document verified. User upgraded to Tier 2', 'success');
    if (countBadge) {
      const cur = parseInt(countBadge.textContent || '4', 10);
      if (cur > 0) countBadge.textContent = `${cur - 1} New`;
    }
  });

  document.getElementById('rejectKycDocBtn')?.addEventListener('click', () => {
    if (kycModal) closeModal(kycModal);
    showToast('Document rejected. Resubmission notification dispatched', 'warning');
  });
}

// -------------------------------------------------------------
// 7. Platform Settings & System Security (admin-settings)
// -------------------------------------------------------------
function initAdminSettings() {
  document.getElementById('adminSaveSecurityBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Platform security thresholds successfully updated', 'success');
  });

  document.getElementById('adminSaveFeesBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Global fee schedule updated and deployed', 'success');
  });

  document.getElementById('exportAuditLogsBtn')?.addEventListener('click', () => {
    showToast('Generating encrypted CSV audit ledger archive...', 'info');
    setTimeout(() => {
      showToast('Download complete: synxex_audit_20261011.csv.enc', 'success');
    }, 1500);
  });
}

