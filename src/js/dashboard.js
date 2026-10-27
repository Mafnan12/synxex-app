/**
 * SynxEx — User Dashboard Interactive Controller
 * Powers all interactive systems on the main dashboard:
 * - Real-time portfolio chart time-range switching (1D, 1W, 1M, 3M, 1Y)
 * - Quick Actions (Deposit, Withdraw, Transfer, Trade) with live balance updates
 * - Dynamic ledger row insertion upon transaction completion
 * - Market row click-to-trade integration
 * - Transaction details inspection popovers
 * - Real-time Command Palette search filtering
 */

import { showToast } from './toast.js';
import { openModal, closeModal } from './modal.js';
import { authService } from './auth.js';

// Global state simulation for User Dashboard
const state = {
  totalBalance: 124580.42,
  availableBalance: 42000.00,
  investedBalance: 80000.00,
  pendingBalance: 2580.42,
  activeRange: '1d',
  activeChartType: 'line',
};

// Chart data sets for each range
const chartRanges = {
  '1d': {
    total: '$124,580.42',
    changeText: '↑ +$3,440.38 (+2.84%)',
    changePeriod: 'today',
    isPositive: true,
    points: 'M10,170 C70,170 90,162 140,152 C190,142 220,147 270,132 C320,117 350,135 400,122 C460,107 500,127 560,115 C620,103 640,78 710,65 C730,62 760,68 780,65',
    area: 'M10,170 C70,170 90,162 140,152 C190,142 220,147 270,132 C320,117 350,135 400,122 C460,107 500,127 560,115 C620,103 640,78 710,65 C730,62 760,68 780,65 L780,195 L10,195Z',
    labels: ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM'],
    currentBadge: '$124.6k',
    endpoint: { cx: 780, cy: 65 },
    hoverPoints: [
      { x: 10, y: 170, time: '12:00 AM', val: '$121,140.04' },
      { x: 140, y: 152, time: '04:00 AM', val: '$121,890.10' },
      { x: 270, y: 132, time: '08:00 AM', val: '$122,750.50' },
      { x: 400, y: 122, time: '12:00 PM', val: '$123,410.20' },
      { x: 560, y: 115, time: '04:00 PM', val: '$123,890.80' },
      { x: 710, y: 65, time: '08:00 PM', val: '$124,420.00' },
      { x: 780, y: 65, time: 'Now', val: '$124,580.42' },
    ]
  },
  '1w': {
    total: '$121,140.04',
    changeText: '↑ +$7,840.12 (+6.91%)',
    changePeriod: 'this week',
    isPositive: true,
    points: 'M10,155 C80,150 120,165 200,140 C280,115 320,130 420,95 C520,60 620,80 720,50 C745,45 765,48 780,42',
    area: 'M10,155 C80,150 120,165 200,140 C280,115 320,130 420,95 C520,60 620,80 720,50 C745,45 765,48 780,42 L780,195 L10,195Z',
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    currentBadge: '$121.1k',
    endpoint: { cx: 780, cy: 42 },
    hoverPoints: [
      { x: 10, y: 155, time: 'Monday', val: '$113,300.00' },
      { x: 120, y: 165, time: 'Tuesday', val: '$112,500.20' },
      { x: 200, y: 140, time: 'Wednesday', val: '$115,400.00' },
      { x: 320, y: 130, time: 'Thursday', val: '$116,800.50' },
      { x: 420, y: 95, time: 'Friday', val: '$119,200.00' },
      { x: 620, y: 80, time: 'Saturday', val: '$120,100.80' },
      { x: 780, y: 42, time: 'Sunday', val: '$121,140.04' },
    ]
  },
  '1m': {
    total: '$114,200.50',
    changeText: '↑ +$13,820.30 (+12.52%)',
    changePeriod: 'this month',
    isPositive: true,
    points: 'M10,175 C100,170 180,150 260,140 C340,130 420,105 500,90 C580,75 660,65 720,55 C750,50 765,42 780,38',
    area: 'M10,175 C100,170 180,150 260,140 C340,130 420,105 500,90 C580,75 660,65 720,55 C750,50 765,42 780,38 L780,195 L10,195Z',
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    currentBadge: '$114.2k',
    endpoint: { cx: 780, cy: 38 },
    hoverPoints: [
      { x: 10, y: 175, time: 'Week 1', val: '$100,380.00' },
      { x: 260, y: 140, time: 'Week 2', val: '$105,420.00' },
      { x: 500, y: 90, time: 'Week 3', val: '$109,800.00' },
      { x: 780, y: 38, time: 'Week 4', val: '$114,200.50' },
    ]
  },
  '3m': {
    total: '$98,450.80',
    changeText: '↑ +$29,570.00 (+30.04%)',
    changePeriod: 'past 3 months',
    isPositive: true,
    points: 'M10,180 C120,165 220,145 320,120 C420,95 520,70 620,55 C700,45 750,38 780,32',
    area: 'M10,180 C120,165 220,145 320,120 C420,95 520,70 620,55 C700,45 750,38 780,32 L780,195 L10,195Z',
    labels: ['Jul 2026', 'Aug 2026', 'Sep 2026'],
    currentBadge: '$98.5k',
    endpoint: { cx: 780, cy: 32 },
    hoverPoints: [
      { x: 10, y: 180, time: 'July', val: '$68,880.00' },
      { x: 320, y: 120, time: 'August', val: '$81,400.00' },
      { x: 780, y: 32, time: 'September', val: '$98,450.80' },
    ]
  },
  '1y': {
    total: '$76,120.00',
    changeText: '↑ +$51,900.84 (+68.18%)',
    changePeriod: 'past year',
    isPositive: true,
    points: 'M10,185 C140,175 240,150 360,125 C480,100 580,75 680,48 C720,38 760,30 780,25',
    area: 'M10,185 C140,175 240,150 360,125 C480,100 580,75 680,48 C720,38 760,30 780,25 L780,195 L10,195Z',
    labels: ['Q4 25', 'Q1 26', 'Q2 26', 'Q3 26'],
    currentBadge: '$76.1k',
    endpoint: { cx: 780, cy: 25 },
    hoverPoints: [
      { x: 10, y: 185, time: 'Q4 2025', val: '$24,220.00' },
      { x: 240, y: 150, time: 'Q1 2026', val: '$41,500.00' },
      { x: 480, y: 100, time: 'Q2 2026', val: '$58,700.00' },
      { x: 780, y: 25, time: 'Q3 2026', val: '$76,120.00' },
    ]
  }
};

export function initDashboard() {
  if (document.body.dataset.page !== 'dashboard') return;

  setupPersonalizedGreeting();
  setupBalancePrivacyToggle();
  setupChartRangeButtons();
  setupChartTypeSwitcher();
  setupPortfolioGraphHover();
  setupDonutInteractions();
  setupQuickActionForms();
  setupMarketRowClicks();
  setupTransactionDetailModals();
  setupCommandPaletteSearch();
  setupNotificationRead();
  updateBalanceUI();
}

/**
 * 0. Personalized Greeting from Auth Session & Time of Day
 */
function setupPersonalizedGreeting() {
  const greetingEl = document.getElementById('dashboardGreeting');
  if (!greetingEl) return;

  const now = new Date();
  const hour = now.getHours();
  let timeGreeting = 'Good morning';
  if (hour >= 12 && hour < 17) {
    timeGreeting = 'Good afternoon';
  } else if (hour >= 17) {
    timeGreeting = 'Good evening';
  }

  authService.init().then(() => {
    const user = authService.getUser();
    if (user) {
      const name = user.name || (user.email ? user.email.split('@')[0] : '');
      greetingEl.textContent = name ? `${timeGreeting}, ${name}` : `${timeGreeting}, Member`;
    } else {
      greetingEl.textContent = `${timeGreeting}`;
    }
  });
}

/**
 * 0b. Privacy Balance Masking Toggle (Revolut / Wise pattern)
 */
let isBalanceHidden = localStorage.getItem('synxex_hide_balance') === 'true';

function setupBalancePrivacyToggle() {
  const toggleBtn = document.getElementById('toggleBalancePrivacyBtn');
  const totalValEl = document.getElementById('portfolioTotalValue');
  const icon = document.getElementById('balancePrivacyIcon');
  if (!toggleBtn || !totalValEl) return;

  function renderBalancePrivacy() {
    const donutCenterVal = document.getElementById('donutCenterValue');
    const chartBadge = document.getElementById('chartValueBadge');
    const availVal = document.getElementById('availableBalanceVal');
    const invVal = document.getElementById('investedBalanceVal');
    const pendVal = document.getElementById('pendingBalanceVal');
    const legendVals = document.querySelectorAll('#donutLegend .legend-val');

    if (isBalanceHidden) {
      totalValEl.innerHTML = '<span class="tracking-widest">••••••••</span>';
      if (donutCenterVal) donutCenterVal.textContent = '••••••';
      if (chartBadge) chartBadge.textContent = '••••••';
      if (availVal) availVal.textContent = '••••••';
      if (invVal) invVal.textContent = '••••••';
      if (pendVal) pendVal.textContent = '••••••';
      legendVals.forEach(el => {
        el.textContent = '••••';
      });

      if (icon) {
        icon.innerHTML = '<path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>';
      }
    } else {
      updateBalanceUI();
      if (donutCenterVal) donutCenterVal.textContent = '$124.6k';
      const rangeData = chartRanges[state.activeRange] || chartRanges['1d'];
      if (chartBadge) chartBadge.textContent = rangeData.currentBadge;
      legendVals.forEach(el => {
        el.textContent = el.dataset.orig || el.textContent;
      });

      if (icon) {
        icon.innerHTML = '<path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>';
      }
    }
  }

  toggleBtn.addEventListener('click', () => {
    isBalanceHidden = !isBalanceHidden;
    localStorage.setItem('synxex_hide_balance', isBalanceHidden);
    renderBalancePrivacy();
    showToast(isBalanceHidden ? 'Balances & portfolio allocation masked' : 'Balances & portfolio visible', 'info');
  });

  if (isBalanceHidden) {
    renderBalancePrivacy();
  }
}

/**
 * 1. Chart time range switching
 */
function setupChartRangeButtons() {
  const container = document.querySelector('[data-tab-group="chartRange"]');
  if (!container) return;

  const buttons = container.querySelectorAll('.tab-item[data-tab]');
  const totalValEl = document.getElementById('portfolioTotalValue');
  const changeBadgeEl = document.getElementById('portfolioChangeBadge');
  const chartPath = document.getElementById('chartLinePath');
  const chartFill = document.getElementById('chartFillPath');
  const chartPing = document.getElementById('chartPingCircle');
  const chartDot = document.getElementById('chartDotCircle');
  const badgeEl = document.getElementById('chartValueBadge');
  const labelsContainer = document.getElementById('chartTimeLabels');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const range = btn.dataset.tab;
      if (!chartRanges[range]) return;

      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const data = chartRanges[range];
      state.activeRange = range;

      // Update text with soft flash
      if (totalValEl) {
        totalValEl.style.transition = 'opacity 0.15s ease';
        totalValEl.style.opacity = '0.5';
        setTimeout(() => {
          totalValEl.innerHTML = `${data.total.split('.')[0]}<span class="text-2xl sm:text-3xl font-bold" style="color: var(--text-faint);">.${data.total.split('.')[1] || '00'}</span>`;
          totalValEl.style.opacity = '1';
        }, 150);
      }

      if (changeBadgeEl) {
        changeBadgeEl.innerHTML = `${data.changeText} <span style="color: var(--text-faint);" class="font-normal">${data.changePeriod}</span>`;
      }

      if (badgeEl) {
        badgeEl.textContent = data.currentBadge;
      }

      // Helper to guarantee valid SVG path syntax with initial MoveTo command
      const ensureM = (str) => {
        if (!str) return '';
        const trimmed = str.trim();
        return (trimmed.startsWith('M') || trimmed.startsWith('m')) ? trimmed : `M${trimmed}`;
      };

      // Update SVG path
      if (chartPath) {
        chartPath.setAttribute('d', ensureM(data.points));
        if (state.activeChartType === 'line') {
          chartPath.style.display = '';
          chartPath.style.opacity = '1';
        }
      }
      if (chartFill) {
        chartFill.setAttribute('d', ensureM(data.area));
        if (state.activeChartType === 'line') {
          chartFill.style.display = '';
          chartFill.style.opacity = '1';
        }
      }

      if (chartPing) {
        chartPing.setAttribute('cx', data.endpoint.cx);
        chartPing.setAttribute('cy', data.endpoint.cy);
        if (state.activeChartType === 'line') chartPing.style.display = '';
      }
      if (chartDot) {
        chartDot.setAttribute('cx', data.endpoint.cx);
        chartDot.setAttribute('cy', data.endpoint.cy);
        if (state.activeChartType === 'line') chartDot.style.display = '';
      }

      // Update bottom time labels
      if (labelsContainer && data.labels) {
        labelsContainer.innerHTML = data.labels.map(lbl => `<span>${lbl}</span>`).join('');
      }

      // Re-render bars if bar mode is active or to keep in sync
      renderBarsForRange(data);
    });
  });
}

/**
 * Renders SVG bars for the current range data
 */
function renderBarsForRange(data) {
  const barsGroup = document.getElementById('chartBarsGroup');
  if (!barsGroup || !data.hoverPoints) return;

  const pts = data.hoverPoints;
  const barWidth = Math.max(14, Math.min(36, 680 / (pts.length * 2.2)));

  barsGroup.innerHTML = pts.map((pt, i) => {
    const x = Math.max(8, pt.x - barWidth / 2);
    const height = Math.max(12, 195 - pt.y);
    const y = pt.y;
    return `
      <g class="chart-bar-col cursor-pointer" data-idx="${i}">
        <!-- Subtle back glow bar -->
        <rect x="${x}" y="${y}" width="${barWidth}" height="${height}" rx="4" fill="url(#cS)" opacity="0.85" class="transition-all duration-200 hover:opacity-100 hover:brightness-125"/>
        <!-- Soft top cap highlight -->
        <rect x="${x}" y="${y}" width="${barWidth}" height="3" rx="1.5" fill="#FFFFFF" opacity="0.4"/>
      </g>
    `;
  }).join('');
}

/**
 * 1.b Chart View Type Switcher (Line vs Bar)
 */
function setupChartTypeSwitcher() {
  const btnLine = document.getElementById('btnChartTypeLine');
  const btnBar = document.getElementById('btnChartTypeBar');
  const chartPath = document.getElementById('chartLinePath');
  const chartFill = document.getElementById('chartFillPath');
  const chartPing = document.getElementById('chartPingCircle');
  const chartDot = document.getElementById('chartDotCircle');
  const barsGroup = document.getElementById('chartBarsGroup');

  if (!btnLine || !btnBar) return;

  function setChartType(type) {
    state.activeChartType = type;

    if (type === 'line') {
      btnLine.classList.add('active');
      btnBar.classList.remove('active');

      if (chartPath) {
        chartPath.style.display = '';
        chartPath.style.opacity = '1';
        chartPath.style.visibility = 'visible';
      }
      if (chartFill) {
        chartFill.style.display = '';
        chartFill.style.opacity = '1';
        chartFill.style.visibility = 'visible';
      }
      if (chartPing) {
        chartPing.style.display = '';
        chartPing.style.opacity = '';
      }
      if (chartDot) {
        chartDot.style.display = '';
        chartDot.style.opacity = '';
      }

      if (barsGroup) {
        barsGroup.style.opacity = '0';
        barsGroup.classList.add('pointer-events-none');
      }
    } else {
      btnBar.classList.add('active');
      btnLine.classList.remove('active');

      if (chartPath) chartPath.style.display = 'none';
      if (chartFill) chartFill.style.display = 'none';
      if (chartPing) chartPing.style.display = 'none';
      if (chartDot) chartDot.style.display = 'none';

      // Ensure bars are populated for active range
      const data = chartRanges[state.activeRange] || chartRanges['1d'];
      renderBarsForRange(data);

      if (barsGroup) {
        barsGroup.style.opacity = '1';
        barsGroup.classList.remove('pointer-events-none');
      }
    }
  }

  btnLine.addEventListener('click', () => setChartType('line'));
  btnBar.addEventListener('click', () => setChartType('bar'));

  // Initial bar population
  const initialData = chartRanges[state.activeRange] || chartRanges['1d'];
  renderBarsForRange(initialData);
}

/**
 * 2. Quick Action Forms (Deposit, Withdraw, Transfer, Trade)
 */
function setupQuickActionForms() {
  // Deposit Form
  const depositForm = document.getElementById('depositForm');
  if (depositForm) {
    depositForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const amountInput = depositForm.querySelector('input[type="number"], input[type="text"][name="amount"]');
      const amountVal = parseFloat(amountInput?.value) || 0;
      const method = depositForm.querySelector('select')?.value || 'Bank Transfer';

      if (amountVal <= 0) {
        showToast('Please enter a valid deposit amount', 'warning');
        return;
      }

      state.availableBalance += amountVal;
      state.totalBalance += amountVal;
      updateBalanceUI();

      closeModal(document.getElementById('depositModal'));
      depositForm.reset();

      showToast(`Successfully deposited $${amountVal.toLocaleString('en-US', { minimumFractionDigits: 2 })} via ${method}`, 'success');

      insertLedgerRow({
        date: 'Just now',
        activity: 'Deposit completed',
        subtext: `${method} • Confirmed`,
        icon: '↓',
        iconBg: 'bg-emerald-500/[0.12] text-emerald-500',
        product: 'Banking',
        status: 'Completed',
        statusColor: 'text-emerald-500',
        dotColor: 'bg-emerald-400',
        amount: `+$${amountVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        isPositive: true,
        category: 'banking'
      });
    });
  }

  // Withdraw Form
  const withdrawForm = document.getElementById('withdrawForm');
  if (withdrawForm) {
    withdrawForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const amountInput = withdrawForm.querySelector('input[type="number"], input[type="text"][name="amount"]');
      const amountVal = parseFloat(amountInput?.value) || 0;

      if (amountVal <= 0) {
        showToast('Please enter a valid withdrawal amount', 'warning');
        return;
      }

      if (amountVal > state.availableBalance) {
        showToast(`Insufficient funds! Available: $${state.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 'error');
        return;
      }

      state.availableBalance -= amountVal;
      state.totalBalance -= amountVal;
      updateBalanceUI();

      closeModal(document.getElementById('withdrawModal'));
      withdrawForm.reset();

      showToast(`Withdrawal of $${amountVal.toLocaleString('en-US', { minimumFractionDigits: 2 })} scheduled`, 'success');

      insertLedgerRow({
        date: 'Just now',
        activity: 'Withdrawal to Bank',
        subtext: 'SEPA Instant • Account ****4821',
        icon: '↑',
        iconBg: 'bg-lava/[0.1] text-lava',
        product: 'Banking',
        status: 'Completed',
        statusColor: 'text-emerald-500',
        dotColor: 'bg-emerald-400',
        amount: `-$${amountVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        isPositive: false,
        category: 'banking'
      });
    });
  }

  // Transfer Form
  const transferForm = document.getElementById('transferForm');
  if (transferForm) {
    transferForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const recipientInput = transferForm.querySelector('input[placeholder*="Name"], input[name="recipient"]');
      const amountInput = transferForm.querySelector('input[placeholder*="0.00"], input[name="amount"]');
      const amountVal = parseFloat(amountInput?.value) || 0;
      const recipientVal = recipientInput?.value || 'Recipient';

      if (amountVal <= 0) {
        showToast('Please enter a valid transfer amount', 'warning');
        return;
      }

      if (amountVal > state.availableBalance) {
        showToast('Insufficient funds for this transfer', 'error');
        return;
      }

      state.availableBalance -= amountVal;
      state.totalBalance -= amountVal;
      updateBalanceUI();

      closeModal(document.getElementById('transferModal'));
      transferForm.reset();

      showToast(`Transferred $${amountVal.toLocaleString('en-US', { minimumFractionDigits: 2 })} to ${recipientVal}`, 'success');

      insertLedgerRow({
        date: 'Just now',
        activity: `Transfer to ${recipientVal}`,
        subtext: 'Instant payment • Completed',
        icon: '↗',
        iconBg: 'bg-blue-500/[0.12] text-blue-400',
        product: 'Remittance',
        status: 'Completed',
        statusColor: 'text-emerald-500',
        dotColor: 'bg-emerald-400',
        amount: `-$${amountVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        isPositive: false,
        category: 'remittance'
      });
    });
  }

  // Trade Form
  const tradeForm = document.getElementById('tradeForm');
  if (tradeForm) {
    const tradeTabs = tradeForm.querySelectorAll('.tab-item');
    let tradeMode = 'buy';
    tradeTabs.forEach(t => {
      t.addEventListener('click', () => {
        tradeTabs.forEach(b => b.classList.remove('active'));
        t.classList.add('active');
        tradeMode = t.textContent.trim().toLowerCase();
        const submitBtn = tradeForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.textContent = tradeMode === 'buy' ? 'Place Buy Order' : 'Place Sell Order';
      });
    });

    tradeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const assetSelect = tradeForm.querySelector('select');
      const assetVal = assetSelect?.value || 'BTC';
      const amountInput = tradeForm.querySelector('input[placeholder*="0.00"]');
      const amountVal = parseFloat(amountInput?.value) || 0;

      if (amountVal <= 0) {
        showToast('Please enter an order amount', 'warning');
        return;
      }

      if (tradeMode === 'buy' && amountVal > state.availableBalance) {
        showToast('Insufficient available funds to execute buy', 'error');
        return;
      }

      if (tradeMode === 'buy') {
        state.availableBalance -= amountVal;
        state.investedBalance += amountVal;
      } else {
        state.availableBalance += amountVal;
        state.investedBalance = Math.max(0, state.investedBalance - amountVal);
      }
      updateBalanceUI();

      closeModal(document.getElementById('tradeModal'));
      tradeForm.reset();

      showToast(`Order executed: ${tradeMode.toUpperCase()} $${amountVal.toLocaleString('en-US', { minimumFractionDigits: 2 })} of ${assetVal.split(' ')[0]}`, 'success');

      insertLedgerRow({
        date: 'Just now',
        activity: `${assetVal.split(' ')[0]} ${tradeMode === 'buy' ? 'purchase' : 'sale'}`,
        subtext: `Market order • Executed`,
        icon: tradeMode === 'buy' ? '₿' : '⇄',
        iconBg: 'bg-amber-500/[0.12] text-amber-500',
        product: 'Crypto',
        status: 'Completed',
        statusColor: 'text-emerald-500',
        dotColor: 'bg-emerald-400',
        amount: `${tradeMode === 'buy' ? '-' : '+'}$${amountVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        isPositive: tradeMode !== 'buy',
        category: 'crypto'
      });
    });
  }
}

/**
 * 3. Update all balance DOM elements
 */
function updateBalanceUI() {
  const availEl = document.getElementById('availableBalanceVal');
  const invEl = document.getElementById('investedBalanceVal');
  const pendEl = document.getElementById('pendingBalanceVal');
  const totalEl = document.getElementById('portfolioTotalValue');

  if (availEl) availEl.textContent = `$${state.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (invEl) invEl.textContent = `$${state.investedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (pendEl) pendEl.textContent = `$${state.pendingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  
  if (totalEl && state.activeRange === '1d') {
    const formatted = state.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const parts = formatted.split('.');
    totalEl.innerHTML = `$${parts[0]}<span class="text-2xl sm:text-3xl font-bold" style="color: var(--text-faint);">.${parts[1] || '00'}</span>`;
  }

  // Update modal hint
  const withdrawHint = document.getElementById('withdrawAvailHint');
  if (withdrawHint) {
    withdrawHint.textContent = `Available: $${state.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }
}

/**
 * 4. Insert dynamic transaction into Recent Activity table
 */
function insertLedgerRow(item) {
  const tbody = document.querySelector('#activityContent table tbody');
  if (!tbody) return;

  const tr = document.createElement('tr');
  tr.className = 'ledger-row';
  tr.dataset.category = item.category;
  tr.style.borderBottom = '1px solid var(--border-subtle)';
  tr.style.opacity = '0';
  tr.style.transform = 'translateY(-8px)';
  tr.style.transition = 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)';

  tr.innerHTML = `
    <td class="py-3 font-mono text-[11px]" style="color: var(--text-faint);">${item.date}</td>
    <td class="py-3">
      <div class="flex items-center gap-3">
        <div class="w-7 h-7 rounded-full ${item.iconBg} border border-white/10 flex items-center justify-center font-bold text-[11px] shrink-0">${item.icon}</div>
        <div>
          <span class="font-semibold block truncate max-w-[180px]" style="color: var(--text-primary);">${item.activity}</span>
          <span class="block text-[10px]" style="color: var(--text-faint);">${item.subtext}</span>
        </div>
      </div>
    </td>
    <td class="py-3"><span class="product-badge px-2 py-0.5 rounded-md text-[10px] font-medium">${item.product}</span></td>
    <td class="py-3">
      <span class="inline-flex items-center gap-1.5 ${item.statusColor} font-medium text-[10px]">
        <span class="w-1.5 h-1.5 rounded-full ${item.dotColor}"></span>${item.status}
      </span>
    </td>
    <td class="py-3 text-right font-bold ${item.isPositive ? 'text-emerald-500' : ''} num-tabular" style="${!item.isPositive ? 'color: var(--text-primary);' : ''}">${item.amount}</td>
    <td class="py-3 text-right">
      <button class="p-1 rounded transition text-xs btn-press tx-details-btn" title="View receipt" style="color: var(--text-faint);">•••</button>
    </td>
  `;

  tbody.insertBefore(tr, tbody.firstChild);

  // Trigger smooth enter animation
  requestAnimationFrame(() => {
    tr.style.opacity = '1';
    tr.style.transform = 'translateY(0)';
  });

  // Re-bind details click
  tr.querySelector('.tx-details-btn')?.addEventListener('click', () => {
    openReceiptModal(item.activity, item.amount, item.date, item.product);
  });
}

/**
 * 5. Market Row Click-to-Trade
 */
function setupMarketRowClicks() {
  const rows = document.querySelectorAll('#marketContent .ledger-row');
  const tradeModal = document.getElementById('tradeModal');
  const assetSelect = tradeModal?.querySelector('select');

  rows.forEach(row => {
    row.addEventListener('click', (e) => {
      // Don't trigger if clicking explicit external links
      if (e.target.closest('a')) return;

      const symbol = row.querySelector('.font-semibold')?.textContent?.split('/')[0]?.trim();
      if (tradeModal && assetSelect && symbol) {
        // Pre-select asset
        for (let i = 0; i < assetSelect.options.length; i++) {
          if (assetSelect.options[i].text.includes(symbol)) {
            assetSelect.selectedIndex = i;
            break;
          }
        }
        openModal(tradeModal);
        showToast(`Selected ${symbol} for order entry`, 'info');
      }
    });
  });
}

/**
 * 6. Transaction Details Modal
 */
function setupTransactionDetailModals() {
  document.querySelectorAll('.tx-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const row = btn.closest('tr');
      const activity = row?.querySelector('.font-semibold')?.textContent?.trim() || 'Transaction';
      const amount = row?.querySelector('td:nth-child(5)')?.textContent?.trim() || '$0.00';
      const date = row?.querySelector('td:nth-child(1)')?.textContent?.trim() || 'Today';
      const product = row?.querySelector('.product-badge')?.textContent?.trim() || 'Payment';

      openReceiptModal(activity, amount, date, product);
    });
  });
}

function openReceiptModal(activity, amount, date, product) {
  const receiptModal = document.getElementById('receiptModal');
  if (!receiptModal) return;

  const titleEl = document.getElementById('receiptTitle');
  const amountEl = document.getElementById('receiptAmount');
  const dateEl = document.getElementById('receiptDate');
  const productEl = document.getElementById('receiptProduct');
  const hashEl = document.getElementById('receiptHash');

  if (titleEl) titleEl.textContent = activity;
  if (amountEl) amountEl.textContent = amount;
  if (dateEl) dateEl.textContent = date;
  if (productEl) productEl.textContent = product;
  if (hashEl) {
    const randomHash = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    hashEl.textContent = randomHash;
  }

  openModal(receiptModal);
}

/**
 * 7. Real-time Command Palette search filtering
 */
function setupCommandPaletteSearch() {
  const palette = document.getElementById('commandPalette');
  if (!palette) return;

  const searchInput = palette.querySelector('input[type="text"]');
  const items = palette.querySelectorAll('.dropdown-item');

  searchInput?.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();

    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (!query || text.includes(query)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  });
}

/**
 * 8. Notification mark all as read
 */
function setupNotificationRead() {
  const markReadBtn = document.getElementById('markAllReadBtn');
  const badge = document.querySelector('#notifBtn span');
  const dropdown = document.getElementById('notifDropdown');

  markReadBtn?.addEventListener('click', () => {
    if (badge) badge.style.display = 'none';
    dropdown?.querySelectorAll('.dropdown-item').forEach(item => {
      item.style.opacity = '0.6';
    });
    showToast('All notifications marked as read', 'info');
  });
}

/**
 * 9. Interactive Portfolio Graph Hover & Tooltip
 */
function setupPortfolioGraphHover() {
  const hitArea = document.getElementById('chartHitArea');
  const cursorLine = document.getElementById('chartCursorLine');
  const hoverCircle = document.getElementById('chartHoverCircle');
  const tooltip = document.getElementById('chartInteractiveTooltip');
  const tooltipTime = document.getElementById('chartTooltipTime');
  const tooltipVal = document.getElementById('chartTooltipValue');
  const container = document.getElementById('portfolioChartContainer');
  const badgeEl = document.getElementById('chartValueBadge');

  if (!hitArea || !container) return;

  hitArea.addEventListener('mousemove', (e) => {
    const rangeData = chartRanges[state.activeRange] || chartRanges['1d'];
    const pts = rangeData.hoverPoints;
    if (!pts || pts.length === 0) return;

    const rect = hitArea.getBoundingClientRect();
    const mouseXRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const svgX = mouseXRatio * 800;

    // Find closest hover point
    let closest = pts[0];
    let minDiff = Math.abs(pts[0].x - svgX);
    for (let i = 1; i < pts.length; i++) {
      const diff = Math.abs(pts[i].x - svgX);
      if (diff < minDiff) {
        minDiff = diff;
        closest = pts[i];
      }
    }

    // Position cursor line & hover circle in SVG coordinates
    if (cursorLine) {
      cursorLine.setAttribute('x1', closest.x);
      cursorLine.setAttribute('x2', closest.x);
      cursorLine.style.opacity = '0.8';
    }
    if (hoverCircle) {
      hoverCircle.setAttribute('cx', closest.x);
      hoverCircle.setAttribute('cy', closest.y);
      hoverCircle.style.opacity = '1';
    }

    // Update floating HTML tooltip
    if (tooltip && tooltipTime && tooltipVal) {
      tooltipTime.textContent = closest.time;
      tooltipVal.textContent = closest.val;

      // Position tooltip in container pixel coordinates
      const pixelX = (closest.x / 800) * container.clientWidth;
      const pixelY = (closest.y / 200) * container.clientHeight;

      tooltip.style.left = `${pixelX}px`;
      tooltip.style.top = `${pixelY}px`;
      tooltip.style.opacity = '1';
    }

    if (badgeEl) {
      badgeEl.textContent = closest.val.replace(',00', '').replace('.00', '');
    }
  });

  hitArea.addEventListener('mouseleave', () => {
    if (cursorLine) cursorLine.style.opacity = '0';
    if (hoverCircle) hoverCircle.style.opacity = '0';
    if (tooltip) tooltip.style.opacity = '0';

    const rangeData = chartRanges[state.activeRange] || chartRanges['1d'];
    if (badgeEl) badgeEl.textContent = rangeData.currentBadge;
  });
}

/**
 * 10. Portfolio Allocation Donut & Legend Bidirectional Interactivity
 */
function setupDonutInteractions() {
  const donutSvg = document.getElementById('donutSvg');
  const legend = document.getElementById('donutLegend');
  const centerTitle = document.getElementById('donutCenterTitle');
  const centerVal = document.getElementById('donutCenterValue');
  const centerSub = document.getElementById('donutCenterSub');

  if (!donutSvg || !legend) return;

  const categoryDetails = {
    crypto: { name: 'Crypto', percent: '40%', val: '$49,832.16', color: '#FF5524' },
    stocks: { name: 'Stocks', percent: '30%', val: '$37,374.12', color: '#8C1D38' },
    forex:  { name: 'Forex',  percent: '15%', val: '$18,687.06', color: '#4C101F' },
    cash:   { name: 'Cash',   percent: '15%', val: '$18,687.08', color: '#94A3B8' }
  };

  const defaultTotal = { title: 'Total', val: '$124.6k' };

  function highlightCategory(cat) {
    const detail = categoryDetails[cat];
    if (!detail) return;

    // Highlight donut segment
    donutSvg.querySelectorAll('.donut-segment').forEach(seg => {
      if (seg.dataset.category === cat) {
        seg.style.strokeWidth = '16';
        seg.style.opacity = '1';
        seg.style.filter = 'drop-shadow(0 0 8px ' + detail.color + ')';
      } else {
        seg.style.strokeWidth = '10';
        seg.style.opacity = '0.35';
        seg.style.filter = 'none';
      }
    });

    // Highlight legend item
    legend.querySelectorAll('.legend-item').forEach(item => {
      if (item.dataset.category === cat) {
        item.style.backgroundColor = 'rgba(255,85,36,0.12)';
        item.style.transform = 'translateX(4px)';
      } else {
        item.style.backgroundColor = 'transparent';
        item.style.transform = 'none';
        item.style.opacity = '0.45';
      }
    });

    // Update center donut display
    if (centerTitle) {
      centerTitle.textContent = detail.name;
      centerTitle.style.color = detail.color;
    }
    if (centerVal) {
      centerVal.textContent = isBalanceHidden ? '••••••' : detail.val;
    }
    if (centerSub) {
      centerSub.textContent = detail.percent + ' of portfolio';
      centerSub.classList.remove('hidden');
    }
  }

  function resetCategory() {
    donutSvg.querySelectorAll('.donut-segment').forEach(seg => {
      seg.style.strokeWidth = '12';
      seg.style.opacity = '1';
      seg.style.filter = 'none';
    });

    legend.querySelectorAll('.legend-item').forEach(item => {
      item.style.backgroundColor = 'transparent';
      item.style.transform = 'none';
      item.style.opacity = '1';
    });

    if (centerTitle) {
      centerTitle.textContent = defaultTotal.title;
      centerTitle.style.color = 'var(--text-faint)';
    }
    if (centerVal) {
      centerVal.textContent = isBalanceHidden ? '••••••' : defaultTotal.val;
    }
    if (centerSub) {
      centerSub.classList.add('hidden');
    }
  }

  // Hover on Donut segments
  donutSvg.querySelectorAll('.donut-segment').forEach(seg => {
    seg.addEventListener('mouseenter', () => highlightCategory(seg.dataset.category));
    seg.addEventListener('mouseleave', resetCategory);
  });

  // Hover on Legend items
  legend.querySelectorAll('.legend-item').forEach(item => {
    item.addEventListener('mouseenter', () => highlightCategory(item.dataset.category));
    item.addEventListener('mouseleave', resetCategory);
  });
}
