/**
 * SynxEx — Remittance Controller
 * Handles interactive currency conversion, quick preset selections,
 * fee calculations, and transaction submission.
 */

import { showToast } from './toast.js';

const exchangeRates = {
  USD: { PKR: 278.50, INR: 83.45, PHP: 58.20, EUR: 0.92, GBP: 0.79, MXN: 18.25, USD: 1.0 },
  EUR: { PKR: 302.70, INR: 90.70, PHP: 63.26, EUR: 1.0, GBP: 0.86, MXN: 19.84, USD: 1.087 },
  GBP: { PKR: 352.50, INR: 105.60, PHP: 73.65, EUR: 1.16, GBP: 1.0, MXN: 23.10, USD: 1.265 }
};

const currencySymbols = {
  USD: '$', EUR: '€', GBP: '£', PKR: 'Rs ', INR: '₹', PHP: '₱', MXN: 'Mex$'
};

export function initRemittance() {
  if (document.body.dataset.page !== 'remittance') return;

  const sendAmountInput = document.getElementById('sendAmount');
  const receiveAmountInput = document.getElementById('receiveAmount');
  const sendCurrencySelect = document.getElementById('sendCurrency');
  const receiveCurrencySelect = document.getElementById('receiveCurrency');
  const rateLabel = document.getElementById('liveRateLabel');
  const rateBreakdown = document.getElementById('rateBreakdownText');
  const feeBreakdown = document.getElementById('feeBreakdownText');
  const totalPayBreakdown = document.getElementById('totalPayText');
  const sendBtn = document.getElementById('reviewSendBtn');
  const recipientNameInput = document.getElementById('recipientName');
  const quickPresets = document.querySelectorAll('.quick-preset');
  const recentList = document.getElementById('recentTransfersList');

  if (!sendAmountInput || !sendCurrencySelect || !receiveCurrencySelect) return;

  function calculate() {
    const sendCur = sendCurrencySelect.value || 'USD';
    const recCur = receiveCurrencySelect.value || 'PKR';
    const amount = parseFloat(sendAmountInput.value) || 0;

    const rateTable = exchangeRates[sendCur] || exchangeRates.USD;
    const rate = rateTable[recCur] || 1.0;

    const received = amount * rate;
    const fee = amount > 0 ? (amount >= 500 ? 0.00 : 2.00) : 0.00;
    const total = amount + fee;

    const sendSym = currencySymbols[sendCur] || '$';
    const recSym = currencySymbols[recCur] || '';

    // Update recipient gets input
    if (receiveAmountInput) {
      receiveAmountInput.value = `${recSym}${received.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }

    // Update rate pill
    if (rateLabel) {
      rateLabel.textContent = `1 ${sendCur} = ${rate.toFixed(2)} ${recCur}`;
    }

    // Update breakdown
    if (rateBreakdown) {
      rateBreakdown.textContent = `1 ${sendCur} = ${rate.toFixed(2)} ${recCur}`;
    }
    if (feeBreakdown) {
      feeBreakdown.textContent = fee === 0 ? 'Free (Zero FX Markup)' : `${sendSym}${fee.toFixed(2)}`;
    }
    if (totalPayBreakdown) {
      totalPayBreakdown.textContent = `${sendSym}${total.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
  }

  // Quick preset pills
  quickPresets.forEach(btn => {
    btn.addEventListener('click', () => {
      quickPresets.forEach(b => {
        b.classList.remove('active', 'text-white');
        b.style.background = 'var(--bg-pill)';
        b.style.borderColor = 'var(--border-subtle)';
        b.style.color = 'var(--text-secondary)';
      });
      btn.classList.add('active', 'text-white');
      btn.style.background = '#FF5524';
      btn.style.borderColor = '#FF5524';
      btn.style.color = '#FFFFFF';

      const preset = btn.dataset.amount;
      if (preset) {
        sendAmountInput.value = preset;
        calculate();
      }
    });
  });

  // Input listener
  sendAmountInput.addEventListener('input', () => {
    quickPresets.forEach(b => b.classList.remove('active'));
    calculate();
  });

  sendCurrencySelect.addEventListener('change', calculate);
  receiveCurrencySelect.addEventListener('change', calculate);

  // Send action
  sendBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const recipient = recipientNameInput?.value.trim() || '';
    const amount = parseFloat(sendAmountInput.value) || 0;
    const sendCur = sendCurrencySelect.value;
    const recCur = receiveCurrencySelect.value;
    const recVal = receiveAmountInput?.value || '0.00';

    if (!recipient) {
      if (recipientNameInput) {
        recipientNameInput.focus();
        recipientNameInput.classList.add('ring-2', 'ring-rose-500');
        setTimeout(() => recipientNameInput.classList.remove('ring-2', 'ring-rose-500'), 1500);
      }
      showToast('Please enter the recipient’s full name', 'warning');
      return;
    }

    if (amount <= 0) {
      showToast('Please enter a valid amount to send', 'warning');
      return;
    }

    // Add to recent transfers list
    if (recentList) {
      const sendSym = currencySymbols[sendCur] || '$';
      const item = document.createElement('div');
      item.className = 'flex justify-between items-center py-2.5 transition-all theme-transition fade-in';
      item.style.borderBottom = '1px solid var(--border-subtle)';
      item.innerHTML = `
        <div>
          <div class="font-medium text-sm" style="color: var(--text-primary);">${recipient}</div>
          <div class="text-xs" style="color: var(--text-secondary);">Sent to ${recCur} • Just now</div>
        </div>
        <div class="text-right">
          <div class="font-semibold text-sm" style="color: var(--text-primary);">-${sendSym}${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <div class="text-xs text-emerald-500 font-semibold font-mono">${recVal}</div>
        </div>
      `;
      recentList.insertBefore(item, recentList.firstChild);
    }

    showToast(`Transfer of ${currencySymbols[sendCur] || '$'}${amount} to ${recipient} initiated!`, 'success');
    if (recipientNameInput) recipientNameInput.value = '';
  });

  // Run initial calculation
  calculate();
}
