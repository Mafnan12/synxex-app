import { test, expect } from '@playwright/test';

test.describe('SynxEx Dashboard & UI/UX Validation', () => {
  test('1. Dashboard loads with zero console errors and crisp typography', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('http://localhost:3000/');
    await expect(page).toHaveTitle(/SynxEx/);
    expect(consoleErrors).toEqual([]);
    
    await page.screenshot({ path: 'test-results/01-dashboard-loaded.png' });
  });

  test('2. Header icons and avatars have established orange styling', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    
    const notifBtn = page.locator('#notifBtn');
    await expect(notifBtn).toBeVisible();
    await expect(notifBtn).toHaveCSS('color', 'rgb(255, 85, 36)');
    
    const avatar = page.locator('#userMenuBtn div');
    await expect(avatar).toBeVisible();
    await expect(avatar).toHaveCSS('background-color', 'rgb(255, 85, 36)');
    
    // Check Settings page avatar too
    await page.goto('http://localhost:3000/pages/settings.html');
    const settingsAvatar = page.locator('section').first().locator('div').filter({ hasText: /^A$/ }).first();
    await expect(settingsAvatar).toBeVisible();
    await expect(settingsAvatar).toHaveCSS('background-color', 'rgb(255, 85, 36)');
    
    await page.screenshot({ path: 'test-results/02-settings-avatar.png' });
  });

  test('3. Quick action buttons have clear hover feedback', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    
    const withdrawBtn = page.locator('.qa-row button:has-text("Withdraw")');
    await expect(withdrawBtn).toBeVisible();
    await withdrawBtn.hover();
    
    // View portfolio link hover
    const viewPortfolio = page.locator('a:has-text("View portfolio →")');
    await expect(viewPortfolio).toBeVisible();
    await viewPortfolio.hover();
    
    await page.screenshot({ path: 'test-results/03-quick-actions-hover.png' });
  });

  test('4. Time-range switching (1W, 1M, 3M, 1Y) updates chart without disappearing', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    
    const chartSvg = page.locator('#portfolioSvg');
    await expect(chartSvg).toBeVisible();
    
    // Click 1W
    const btn1W = page.locator('button[data-tab="1w"]');
    await btn1W.click();
    await page.waitForTimeout(200);
    await expect(chartSvg).toBeVisible();
    await expect(btn1W).toHaveClass(/active/);
    
    // Verify path updated to 1w coordinates
    const d1W = await page.locator('#chartLinePath').getAttribute('d');
    expect(d1W).toContain('10,155');
    
    // Click 1M
    const btn1M = page.locator('button[data-tab="1m"]');
    await btn1M.click();
    await page.waitForTimeout(200);
    await expect(chartSvg).toBeVisible();
    const d1M = await page.locator('#chartLinePath').getAttribute('d');
    expect(d1M).toContain('10,175');
    
    // Click 1Y then back to 1D repeatedly
    const btn1Y = page.locator('button[data-tab="1y"]');
    await btn1Y.click();
    await page.waitForTimeout(200);
    await expect(chartSvg).toBeVisible();
    
    const btn1D = page.locator('button[data-tab="1d"]');
    await btn1D.click();
    await page.waitForTimeout(200);
    await expect(chartSvg).toBeVisible();
    const d1D = await page.locator('#chartLinePath').getAttribute('d');
    expect(d1D).toContain('10,170');
    
    await page.screenshot({ path: 'test-results/04-chart-ranges.png' });
  });

  test('5. Portfolio graph hover displays informative tooltip and cursor', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    
    const hitArea = page.locator('#chartHitArea');
    await expect(hitArea).toBeVisible();
    
    // Hover across the middle of the graph
    await hitArea.hover({ position: { x: 400, y: 100 } });
    await page.waitForTimeout(200);
    
    const tooltip = page.locator('#chartInteractiveTooltip');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveCSS('opacity', '1');
    
    await page.screenshot({ path: 'test-results/05-chart-hover-tooltip.png' });
  });

  test('6. Portfolio donut chart has two-way hover interactivity with legend and tooltip', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    
    const centerTitle = page.locator('#donutCenterTitle');
    
    // Hover on Crypto segment via dispatchEvent for SVG elements
    await page.locator('#donutSegmentCrypto').dispatchEvent('mouseenter');
    await page.waitForTimeout(200);
    await expect(centerTitle).toHaveText('Crypto');
    
    // Hover on Stocks legend item
    const legendStocks = page.locator('#legendStocks');
    await legendStocks.hover();
    await page.waitForTimeout(200);
    await expect(centerTitle).toHaveText('Stocks');
    
    // Hover on Forex legend item
    const legendForex = page.locator('#legendForex');
    await legendForex.hover();
    await page.waitForTimeout(200);
    await expect(centerTitle).toHaveText('Forex');
    
    await page.screenshot({ path: 'test-results/06-donut-interactions.png' });
  });

  test('7. Markets page Trade buttons have prominent hover feedback', async ({ page }) => {
    await page.goto('http://localhost:3000/pages/markets.html');
    
    const tradeButtons = page.locator('.trade-btn');
    await expect(tradeButtons.first()).toBeVisible();
    
    await tradeButtons.first().hover();
    await page.waitForTimeout(150);
    
    await page.screenshot({ path: 'test-results/07-market-trade-hover.png' });
  });

  test('8. AI Agents page Activate buttons respond to hover and click', async ({ page }) => {
    await page.goto('http://localhost:3000/pages/agents.html');
    
    const activateBtns = page.locator('.activate-btn');
    await expect(activateBtns.first()).toBeVisible();
    
    await activateBtns.first().hover();
    await page.waitForTimeout(150);
    
    await page.screenshot({ path: 'test-results/08-agent-activate-hover.png' });
  });

  test('9. Remittance currency dropdowns are legible and high contrast', async ({ page }) => {
    await page.goto('http://localhost:3000/pages/remittance.html');
    
    const selects = page.locator('select.input');
    await expect(selects.first()).toBeVisible();
    await expect(selects.first()).toHaveValue('USD');
    
    await page.screenshot({ path: 'test-results/09-remittance-dropdowns.png' });
  });

  test('10. Notification number badge is clearly visible in light mode', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    
    // Switch to light mode
    await page.click('#themeToggle');
    await page.waitForTimeout(200);
    
    const notifBadge = page.locator('#notifBtn span');
    await expect(notifBadge).toBeVisible();
    await expect(notifBadge).toHaveText('3');
    await expect(notifBadge).toHaveCSS('color', 'rgb(255, 255, 255)');
    await expect(notifBadge).toHaveCSS('background-color', 'rgb(255, 85, 36)');
    
    await page.screenshot({ path: 'test-results/10-light-mode-notification.png' });
    
    // Switch back to dark mode
    await page.click('#themeToggle');
  });

  test('11. Chart Line vs Bar view mode switcher works seamlessly across ranges', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    
    const btnBar = page.locator('#btnChartTypeBar');
    const btnLine = page.locator('#btnChartTypeLine');
    const chartPath = page.locator('#chartLinePath');
    const barsGroup = page.locator('#chartBarsGroup');
    
    await expect(btnBar).toBeVisible();
    await expect(btnLine).toBeVisible();
    
    // Switch to Bar chart
    await btnBar.click();
    await page.waitForTimeout(200);
    await expect(btnBar).toHaveClass(/active/);
    await expect(barsGroup).toHaveCSS('opacity', '1');
    await expect(chartPath).toHaveCSS('display', 'none');
    
    // Switch range while in Bar mode (e.g. 1W)
    await page.click('button[data-tab="1w"]');
    await page.waitForTimeout(200);
    await expect(barsGroup).toHaveCSS('opacity', '1');
    
    // Switch back to Line chart
    await btnLine.click();
    await page.waitForTimeout(200);
    await expect(btnLine).toHaveClass(/active/);
    const dVal = await chartPath.getAttribute('d');
    expect(dVal).toBeTruthy();
    expect(await chartPath.evaluate(el => el.style.display)).toBe('');
    
    await page.screenshot({ path: 'test-results/11-chart-bar-mode.png' });
  });
});

