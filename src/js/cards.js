/**
 * SynxEx — Card Management Controller
 * Implements interactive card controls inspired by Revolut & Ramp:
 * - Dynamic cardholder binding from authenticated user
 * - Masked card number toggle (reveal/copy)
 * - Instant freeze / unfreeze card action with visual state updates
 * - Dynamic monthly spending limit tracker with live progress bar
 * - Spending limit adjustment modal
 */

import { authService } from './auth.js';
import { showToast } from './toast.js';

let cardState = {
  isFrozen: false,
  isDetailsRevealed: false,
  monthlySpend: 657.59,
  monthlyLimit: 5000.00,
  last4: '4921',
  expiry: '12/28',
  cvv: '842',
};

export function initBankingCards() {
  const cardFoil = document.getElementById('virtualCardFoil');
  const cardholderEl = document.getElementById('cardholderName');
  const freezeBtn = document.getElementById('freezeCardBtn');
  const revealDetailsBtn = document.getElementById('revealDetailsBtn');
  const cardPanEl = document.getElementById('cardPanDisplay');
  const cardCvvEl = document.getElementById('cardCvvDisplay');
  const spendBar = document.getElementById('cardSpendBar');
  const spendText = document.getElementById('cardSpendText');
  const limitInput = document.getElementById('cardLimitInput');
  const saveLimitBtn = document.getElementById('saveLimitBtn');

  // Load saved card preferences from localStorage
  const saved = localStorage.getItem('synxex_card_state');
  if (saved) {
    try {
      cardState = { ...cardState, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
  }

  // Bind authenticated cardholder name
  authService.init().then(() => {
    const user = authService.getUser();
    if (user && cardholderEl) {
      const name = user.name || (user.email ? user.email.split('@')[0] : 'Member');
      cardholderEl.textContent = name.toUpperCase();
    }
  });

  // Apply visual frozen state
  function updateCardUi() {
    if (cardFoil) {
      if (cardState.isFrozen) {
        cardFoil.classList.add('grayscale', 'opacity-70');
        const badge = document.getElementById('cardFrozenBadge');
        if (badge) badge.hidden = false;
        if (freezeBtn) {
          freezeBtn.innerHTML = `
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
            <span>Unfreeze Card</span>
          `;
          freezeBtn.classList.add('border-emerald-500/40');
        }
      } else {
        cardFoil.classList.remove('grayscale', 'opacity-70');
        const badge = document.getElementById('cardFrozenBadge');
        if (badge) badge.hidden = true;
        if (freezeBtn) {
          freezeBtn.innerHTML = `
            <svg class="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
            <span>Freeze Card</span>
          `;
          freezeBtn.classList.remove('border-emerald-500/40');
        }
      }
    }

    // Spend Progress bar
    if (spendBar && spendText) {
      const percent = Math.min(100, Math.round((cardState.monthlySpend / cardState.monthlyLimit) * 100));
      spendBar.style.width = `${percent}%`;
      spendText.textContent = `$${cardState.monthlySpend.toLocaleString('en-US', { minimumFractionDigits: 2 })} of $${cardState.monthlyLimit.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    }

    localStorage.setItem('synxex_card_state', JSON.stringify(cardState));
  }

  // Freeze/Unfreeze toggle
  freezeBtn?.addEventListener('click', () => {
    cardState.isFrozen = !cardState.isFrozen;
    updateCardUi();
    showToast(
      cardState.isFrozen
        ? 'Virtual Card frozen. All point-of-sale authorizations will be paused.'
        : 'Virtual Card unfrozen and active for global transactions.',
      cardState.isFrozen ? 'warning' : 'success'
    );
  });

  // Reveal Details
  revealDetailsBtn?.addEventListener('click', () => {
    cardState.isDetailsRevealed = !cardState.isDetailsRevealed;
    if (cardPanEl) {
      cardPanEl.textContent = cardState.isDetailsRevealed
        ? `4532 8920 1140 ${cardState.last4}`
        : `•••• •••• •••• ${cardState.last4}`;
    }
    if (cardCvvEl) {
      cardCvvEl.textContent = cardState.isDetailsRevealed ? cardState.cvv : '•••';
    }
    if (revealDetailsBtn) {
      revealDetailsBtn.textContent = cardState.isDetailsRevealed ? 'Hide Details' : 'Show Details';
    }
    showToast(cardState.isDetailsRevealed ? 'Sensitive card numbers revealed (masked automatically in 30s)' : 'Card numbers masked', 'info');

    if (cardState.isDetailsRevealed) {
      setTimeout(() => {
        if (cardState.isDetailsRevealed) {
          cardState.isDetailsRevealed = false;
          if (cardPanEl) cardPanEl.textContent = `•••• •••• •••• ${cardState.last4}`;
          if (cardCvvEl) cardCvvEl.textContent = '•••';
          if (revealDetailsBtn) revealDetailsBtn.textContent = 'Show Details';
        }
      }, 30000);
    }
  });

  // Save Limit
  saveLimitBtn?.addEventListener('click', () => {
    if (limitInput) {
      const newLimit = parseFloat(limitInput.value.replace(/[^0-9.]/g, ''));
      if (newLimit && newLimit > 0) {
        cardState.monthlyLimit = newLimit;
        updateCardUi();
        showToast(`Monthly spending limit updated to $${newLimit.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 'success');
      }
    }
  });

  updateCardUi();
}

