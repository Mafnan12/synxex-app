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

// Global state simulation for User Dashboard
const state = {
  totalBalance: 124580.42,
  availableBalance: 42000.00,
  investedBalance: 80000.00,
  pendingBalance: 2580.42,
  activeRange: '1d',
};

// Chart data sets for each range
const chartRanges = {
  '1d': {
    total: '$124,580.42',
    changeText: '↑ +$3,440.38 (+2.84%)',
    changePeriod: 'today',
    isPositive: true,
    points: '10,170 C70,170 90,162 140,152 C190,142 220,147 270,132 C320,117 350,135 400,122 C460,107 500,127 560,115 C620,103 640,78 710,65 C730,62 760,68 780,65',
    area: '10,170 C70,170 90,162 140,152 C190,142 220,147 270,132 C320,117 350,135 400,122 C460,107 500,127 560,115 C620,103 640,78 710,65 C730,62 760,68 780,65 L780,195 L10,195Z',
    labels: ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM'],
    currentBadge: '$124.6k',
    endpoint: { cx: 780, cy: 65 }
  },
  '1w': {
    total: '$121,140.04',
    changeText: '↑ +$7,840.12 (+6.91%)',
    changePeriod: 'this week',
    isPositive: true,
    points: '10,155 C80,150 120,165 200,140 C280,115 320,130 420,95 C520,60 620,80 720,50 C745,45 765,48 780,42',
    area: '10,155 C80,150 120,165 200,140 C280,115 320,130 420,95 C520,60 620,80 720,50 C745,45 765,48 780,42 L780,195 L10,195Z',
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    currentBadge: '$121.1k',
    endpoint: { cx: 780, cy: 42 }
  },
  '1m': {
    total: '$114,200.50',
    changeText: '↑ +$13,820.30 (+12.52%)',
    changePeriod: 'this month',
    isPositive: true,
    points: '10,175 C100,170 180,150 260,140 C340,130 420,105 500,90 C580,75 660,65 720,55 C750,50 765,42 780,38',
    area: '10,175 C100,170 180,150 260,140 C340,130 420,105 500,90 C580,75 660,65 720,55 C750,50 765,42 780,38 L780,195 L10,195Z',
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    currentBadge: '$114.2k',
    endpoint: { cx: 780, cy: 38 }
  },
  '3m': {
    total: '$98,450.80',
    changeText: '↑ +$29,570.00 (+30.04%)',
    changePeriod: 'past 3 months',
    isPositive: true,
    points: '10,180 C120,165 220,145 320,120 C420,95 520,70 620,55 C700,45 750,38 780,32',
    area: '10,180 C120,165 220,145 320,120 C420,95 520,70 620,55 C700,45 750,38 780,32 L780,195 L10,195Z',
    labels: ['Jul 2026', 'Aug 2026', 'Sep 2026'],
    currentBadge: '$98.5k',
    endpoint: { cx: 780, cy: 32 }
  },
  '1y': {
    total: '$76,120.00',
    changeText: '↑ +$51,900.84 (+68.18%)',
    changePeriod: 'past year',
    isPositive: true,
    points: '10,185 C140,175 240,150 360,125 C480,100 580,75 680,48 C720,38 760,30 780,25',
    area: '10,185 C140,175 240,150 360,125 C480,100 580,75 680,48 C720,38 760,30 780,25 L780,195 L10,195Z',
    labels: ['Q4 25', 'Q1 26', 'Q2 26', 'Q3 26'],
    currentBadge: '$76.1k',
    endpoint: { cx: 780, cy: 25 }
  }
};

export function initDashboard() {
  if (document.body.dataset.page !== 'dashboard') return;

  setupChartRangeButtons();
  setupQuickActionForms();
  setupMarketRowClicks();
  setupTransactionDetailModals();
  setupCommandPaletteSearch();
  setupNotificationRead();
  updateBalanceUI();
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

      // Update SVG path
      if (chartPath) chartPath.setAttribute('d', data.points);
      if (chartFill) chartFill.setAttribute('d', data.area);

      if (chartPing) {
        chartPing.setAttribute('cx', data.endpoint.cx);
        chartPing.setAttribute('cy', data.endpoint.cy);
      }
      if (chartDot) {
        chartDot.setAttribute('cx', data.endpoint.cx);
        chartDot.setAttribute('cy', data.endpoint.cy);
      }

      // Update bottom time labels
      if (labelsContainer && data.labels) {
        labelsContainer.innerHTML = data.labels.map(lbl => `<span>${lbl}</span>`).join('');
      }
    });
  });
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
