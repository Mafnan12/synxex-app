/**
 * SynxEx — Tab Filter System
 * Handles interactive tab switching with content filtering
 */

export function initTabs() {
  document.querySelectorAll('[data-tab-group]').forEach((group) => {
    const tabs = group.querySelectorAll('[data-tab]');
    const targetId = group.dataset.tabGroup;
    // Don't treat chartRange as a visibility filtering group
    if (targetId === 'chartRange') return;
    const contentContainer = document.getElementById(targetId);

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        // Update active state
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.dataset.tab;

        // Filter content if container exists
        if (contentContainer) {
          const items = contentContainer.querySelectorAll('[data-category]');
          items.forEach((item) => {
            if (filter === 'all' || item.dataset.category === filter) {
              item.style.display = '';
              item.style.opacity = '0';
              item.style.transform = 'translateY(4px)';
              requestAnimationFrame(() => {
                item.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
              });
            } else {
              item.style.display = 'none';
            }
          });
        }
      });
    });
  });
}
