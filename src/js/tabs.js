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

    // Ensure the first active tab or 'all' is marked active
    const activeTab = group.querySelector('[data-tab].active') || group.querySelector('[data-tab]');
    if (activeTab && !group.querySelector('[data-tab].active')) {
      activeTab.classList.add('active');
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        // Update active state styling
        tabs.forEach((t) => {
          t.classList.remove('active');
          t.style.background = '';
          t.style.color = 'var(--text-secondary)';
        });
        tab.classList.add('active');
        tab.style.background = '';
        tab.style.color = '';

        const filter = tab.dataset.tab;

        // Filter content if container exists
        if (contentContainer) {
          const items = contentContainer.querySelectorAll('[data-category]');
          let visibleCount = 0;
          items.forEach((item) => {
            const matchesCategory = (filter === 'all' || item.dataset.category === filter);
            
            // Respect search query if active
            const searchInput = document.getElementById('marketSearchInput');
            let matchesSearch = true;
            if (searchInput && searchInput.value.trim() !== '') {
              const query = searchInput.value.toLowerCase().trim();
              const text = item.textContent.toLowerCase();
              matchesSearch = text.includes(query);
            }

            if (matchesCategory && matchesSearch) {
              item.style.display = '';
              item.style.opacity = '0';
              item.style.transform = 'translateY(4px)';
              requestAnimationFrame(() => {
                item.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
              });
              visibleCount++;
            } else {
              item.style.display = 'none';
            }
          });

          // Handle empty state row if present
          const emptyRow = contentContainer.querySelector('.empty-filter-row');
          if (emptyRow) {
            emptyRow.style.display = visibleCount === 0 ? '' : 'none';
          }
        }
      });
    });
  });

  // Attach search filter listener if marketSearchInput exists
  const searchInput = document.getElementById('marketSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const contentContainer = document.getElementById('markets');
      if (!contentContainer) return;

      // Find current active category
      const activeTab = document.querySelector('[data-tab-group="markets"] [data-tab].active');
      const activeCategory = activeTab ? activeTab.dataset.tab : 'all';

      const items = contentContainer.querySelectorAll('[data-category]');
      let visibleCount = 0;
      items.forEach((item) => {
        const matchesCategory = (activeCategory === 'all' || item.dataset.category === activeCategory);
        const matchesSearch = query === '' || item.textContent.toLowerCase().includes(query);

        if (matchesCategory && matchesSearch) {
          item.style.display = '';
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });

      const emptyRow = contentContainer.querySelector('.empty-filter-row');
      if (emptyRow) {
        emptyRow.style.display = visibleCount === 0 ? '' : 'none';
      }
    });
  }
}
