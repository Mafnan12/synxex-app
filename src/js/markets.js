/**
 * SynxEx — Markets Module
 * Handles live trade order execution modal and interaction
 */

import { openModal, closeModal } from './modal.js';
import { showToast } from './toast.js';

export function initMarkets() {
  const tradeModal = document.getElementById('quickTradeModal');
  const closeBtn = document.getElementById('closeTradeModalBtn');
  const assetTitle = document.getElementById('tradeAssetTitle');
  const priceInput = document.getElementById('tradePriceInput');
  const amountInput = document.getElementById('tradeAmountInput');
  const totalDisplay = document.getElementById('tradeTotalDisplay');
  const submitBtn = document.getElementById('submitTradeOrderBtn');

  // Wire up trade buttons in the table
  document.querySelectorAll('#markets .trade-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const asset = btn.dataset.asset || 'BTC';
      const price = btn.dataset.price || '64,230.50';

      if (assetTitle) assetTitle.textContent = asset;
      if (priceInput) priceInput.value = `$${price}`;

      updateTradeTotal();
      if (tradeModal) openModal(tradeModal);
    });
  });

  if (closeBtn && tradeModal) {
    closeBtn.addEventListener('click', () => {
      closeModal(tradeModal);
    });
  }

  function updateTradeTotal() {
    if (!amountInput || !totalDisplay) return;
    const amount = parseFloat(amountInput.value) || 0;
    const fee = amount * 0.0005;
    const total = amount + fee;
    totalDisplay.textContent = `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  if (amountInput) {
    amountInput.addEventListener('input', updateTradeTotal);
  }

  if (submitBtn && tradeModal) {
    submitBtn.addEventListener('click', () => {
      const asset = assetTitle ? assetTitle.textContent : 'Asset';
      const amount = amountInput ? amountInput.value : '1,000';
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Routing Order...';

      setTimeout(() => {
        closeModal(tradeModal);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Place Market Order';

        showToast({
          title: 'Order Executed',
          message: `Successfully executed market buy of $${amount} in ${asset}`,
          type: 'success',
          duration: 4000,
        });
      }, 700);
    });
  }
}
