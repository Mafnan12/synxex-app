/**
 * SynxEx — Web3 Wallet Controller
 * Manages Send, Receive (QR + Address Copy), and Instant DEX Swap
 */

import { showToast } from './toast.js';
import { openModal, closeModal } from './modal.js';

export function initWallet() {
  // Send Modal Controls
  const sendBtn = document.getElementById('walletSendBtn');
  const sendModal = document.getElementById('walletSendModal');
  const closeSendBtn = document.getElementById('closeWalletSendModalBtn');
  const confirmSendBtn = document.getElementById('confirmWalletSendBtn');
  const sendAssetSelect = document.getElementById('walletSendAsset');
  const sendAddressInput = document.getElementById('walletSendAddress');
  const sendAmountInput = document.getElementById('walletSendAmount');
  const sendMaxBtn = document.getElementById('walletSendMaxBtn');

  if (sendBtn && sendModal) {
    sendBtn.addEventListener('click', () => {
      openModal(sendModal);
    });
  }

  if (closeSendBtn && sendModal) {
    closeSendBtn.addEventListener('click', () => {
      closeModal(sendModal);
    });
  }

  if (sendMaxBtn && sendAmountInput) {
    sendMaxBtn.addEventListener('click', () => {
      sendAmountInput.value = '1.45';
      showToast('Max balance selected', 'info');
    });
  }

  if (confirmSendBtn && sendModal) {
    confirmSendBtn.addEventListener('click', () => {
      const asset = sendAssetSelect ? sendAssetSelect.value : 'BTC';
      const amount = sendAmountInput ? sendAmountInput.value : '0.05';
      const addr = sendAddressInput && sendAddressInput.value.trim() ? sendAddressInput.value.trim() : '0x71C...9f24E1';

      confirmSendBtn.disabled = true;
      confirmSendBtn.textContent = 'Broadcasting to Mempool...';

      setTimeout(() => {
        confirmSendBtn.disabled = false;
        confirmSendBtn.textContent = 'Review & Sign Transaction';
        closeModal(sendModal);

        showToast(`Transaction Broadcasted: Sent ${amount} ${asset} to ${addr.substring(0, 10)}...`, 'success');
      }, 700);
    });
  }

  // Receive Modal Controls
  const receiveBtn = document.getElementById('walletReceiveBtn');
  const receiveModal = document.getElementById('walletReceiveModal');
  const closeReceiveBtn = document.getElementById('closeWalletReceiveModalBtn');
  const copyAddressBtn = document.getElementById('copyReceiveAddressBtn');
  const receiveAddressInput = document.getElementById('receiveAddressInput');

  if (receiveBtn && receiveModal) {
    receiveBtn.addEventListener('click', () => {
      openModal(receiveModal);
    });
  }

  if (closeReceiveBtn && receiveModal) {
    closeReceiveBtn.addEventListener('click', () => {
      closeModal(receiveModal);
    });
  }

  if (copyAddressBtn && receiveAddressInput) {
    copyAddressBtn.addEventListener('click', () => {
      navigator.clipboard?.writeText(receiveAddressInput.value).then(() => {
        showToast('Vault address copied to clipboard!', 'success');
      }).catch(() => {
        showToast('Address copied: ' + receiveAddressInput.value, 'success');
      });
    });
  }

  // Swap Modal Controls
  const swapBtn = document.getElementById('walletSwapBtn');
  const swapModal = document.getElementById('walletSwapModal');
  const closeSwapBtn = document.getElementById('closeWalletSwapModalBtn');
  const confirmSwapBtn = document.getElementById('confirmSwapBtn');
  const swapPayInput = document.getElementById('swapPayAmount');
  const swapReceiveInput = document.getElementById('swapReceiveAmount');
  const swapPayToken = document.getElementById('swapPayToken');
  const swapReceiveToken = document.getElementById('swapReceiveToken');
  const invertBtn = document.getElementById('invertSwapTokensBtn');

  if (swapBtn && swapModal) {
    swapBtn.addEventListener('click', () => {
      openModal(swapModal);
    });
  }

  if (closeSwapBtn && swapModal) {
    closeSwapBtn.addEventListener('click', () => {
      closeModal(swapModal);
    });
  }

  function recalculateSwap() {
    if (!swapPayInput || !swapReceiveInput) return;
    const payAmt = parseFloat(swapPayInput.value) || 0;
    // Estimate rates
    const fromToken = swapPayToken ? swapPayToken.value : 'ETH';
    const toToken = swapReceiveToken ? swapReceiveToken.value : 'USDT';

    let rate = 3420.10; // ETH to USDT
    if (fromToken === 'BTC' && toToken === 'USDT') rate = 64230.50;
    if (fromToken === 'SOL' && toToken === 'USDT') rate = 145.80;
    if (fromToken === 'USDT' && toToken === 'ETH') rate = 1 / 3420.10;

    const estReceive = payAmt * rate;
    swapReceiveInput.value = estReceive >= 1 ? estReceive.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : estReceive.toFixed(4);
  }

  if (swapPayInput) {
    swapPayInput.addEventListener('input', recalculateSwap);
  }
  if (swapPayToken) {
    swapPayToken.addEventListener('change', recalculateSwap);
  }
  if (swapReceiveToken) {
    swapReceiveToken.addEventListener('change', recalculateSwap);
  }

  if (invertBtn && swapPayToken && swapReceiveToken) {
    invertBtn.addEventListener('click', () => {
      const temp = swapPayToken.value;
      swapPayToken.value = swapReceiveToken.value;
      swapReceiveToken.value = temp;
      recalculateSwap();
    });
  }

  if (confirmSwapBtn && swapModal) {
    confirmSwapBtn.addEventListener('click', () => {
      const payVal = swapPayInput ? swapPayInput.value : '1.0';
      const from = swapPayToken ? swapPayToken.value : 'ETH';
      const recVal = swapReceiveInput ? swapReceiveInput.value : '3,420.10';
      const to = swapReceiveToken ? swapReceiveToken.value : 'USDT';

      confirmSwapBtn.disabled = true;
      confirmSwapBtn.textContent = 'Routing Across Liquidity Pools...';

      setTimeout(() => {
        confirmSwapBtn.disabled = false;
        confirmSwapBtn.textContent = 'Execute Optimal Swap';
        closeModal(swapModal);

        showToast(`DEX Swap Executed: Swapped ${payVal} ${from} for ${recVal} ${to}`, 'success');
      }, 700);
    });
  }
}
