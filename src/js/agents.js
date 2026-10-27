/**
 * SynxEx — AI Trading Agents Controller
 * Manages strategy activation toggles, risk parameter confirmations,
 * and custom agent deployment
 */

import { showToast } from './toast.js';
import { openModal, closeModal } from './modal.js';

export function initAgents() {
  const deployBtn = document.getElementById('deployModelBtn');
  const deployModal = document.getElementById('deployAgentModal');
  const closeDeployBtn = document.getElementById('closeDeployModalBtn');
  const confirmDeployBtn = document.getElementById('confirmDeployAgentBtn');
  const agentNameInput = document.getElementById('newAgentName');
  const agentStrategySelect = document.getElementById('newAgentStrategy');
  const agentRiskSelect = document.getElementById('newAgentRisk');

  // Handle Activate / Deactivate on each agent card
  document.querySelectorAll('.activate-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.glass');
      const agentName = card?.querySelector('h3')?.textContent || 'Agent';
      const isCurrentlyActive = btn.classList.contains('is-active');

      if (isCurrentlyActive) {
        btn.classList.remove('is-active', 'bg-emerald-500', 'text-white');
        btn.textContent = 'Activate';
        showToast(`Strategy deactivated: ${agentName}`, 'info');
      } else {
        btn.classList.add('is-active', 'bg-emerald-500', 'text-white');
        btn.textContent = 'Active (Running)';
        showToast(`Strategy initiated: ${agentName} is now scanning live liquidity`, 'success');
      }
    });
  });

  // Modal open / close
  if (deployBtn && deployModal) {
    deployBtn.addEventListener('click', () => {
      openModal(deployModal);
    });
  }

  if (closeDeployBtn && deployModal) {
    closeDeployBtn.addEventListener('click', () => {
      closeModal(deployModal);
    });
  }

  // Confirm Deploy
  if (confirmDeployBtn && deployModal) {
    confirmDeployBtn.addEventListener('click', () => {
      const name = agentNameInput?.value?.trim() || 'Custom Quant Alpha';
      const strategy = agentStrategySelect?.value || 'Mean Reversion';
      const risk = agentRiskSelect?.value || 'Medium';

      confirmDeployBtn.disabled = true;
      confirmDeployBtn.textContent = 'Validating Backtest & Deploying...';

      setTimeout(() => {
        confirmDeployBtn.disabled = false;
        confirmDeployBtn.textContent = 'Deploy Strategy to Sandbox';
        closeModal(deployModal);

        showToast(`Successfully deployed ${name} (${strategy}, Risk: ${risk}) to paper trading sandbox`, 'success');

        // Dynamically append new card to grid
        const grid = document.querySelector('main .grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
        if (grid) {
          const newCard = document.createElement('div');
          newCard.className = 'glass card-lift rounded-xl p-5 flex flex-col fade-in';
          newCard.style.border = '1px solid var(--border-subtle)';
          newCard.innerHTML = `
            <div class="flex justify-between items-start mb-4">
              <div class="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xl">⚡</div>
              <span class="px-2 py-1 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">Active</span>
            </div>
            <h3 class="text-lg font-bold mb-1" style="color: var(--text-primary);">${name}</h3>
            <p class="text-sm mb-4 flex-1" style="color: var(--text-secondary);">${strategy} strategy running in verified risk sandbox with simulated orders.</p>
            <div class="flex justify-between items-center mb-4 text-sm">
              <div>
                <div style="color: var(--text-secondary);">Risk Level</div>
                <div class="font-medium text-${risk === 'High' ? 'red' : risk === 'Medium' ? 'yellow' : 'green'}-500">${risk}</div>
              </div>
              <div class="text-right">
                <div style="color: var(--text-secondary);">30D ROI</div>
                <div class="font-medium text-emerald-400">+12.8% (Sim)</div>
              </div>
            </div>
            <button class="btn activate-btn is-active bg-emerald-500 text-white w-full py-2.5 rounded-xl">Active (Running)</button>
          `;
          grid.prepend(newCard);

          // Wire up newly created button
          const newBtn = newCard.querySelector('.activate-btn');
          newBtn.addEventListener('click', () => {
            if (newBtn.classList.contains('is-active')) {
              newBtn.classList.remove('is-active', 'bg-emerald-500', 'text-white');
              newBtn.textContent = 'Activate';
              showToast(`Strategy deactivated: ${name}`, 'info');
            } else {
              newBtn.classList.add('is-active', 'bg-emerald-500', 'text-white');
              newBtn.textContent = 'Active (Running)';
              showToast(`Strategy activated: ${name}`, 'success');
            }
          });
        }
      }, 700);
    });
  }
}
