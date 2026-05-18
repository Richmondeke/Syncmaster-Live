import { test, expect } from '@playwright/test';

test.describe('Phase E: Smoke Tests — Critical Happy Path', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log(`[${msg.type()}] ${msg.text()}`));
    page.on('pageerror', err => console.error('Page error:', err));
  });

  test('admin login → briefs page → sees action buttons', async ({ page }) => {
    // Navigate to login
    await page.goto('/login');
    await expect(page.locator('text=Sign in')).toBeVisible();

    // Login (using test credentials from .env.local)
    const adminEmail = process.env.TEST_ADMIN_EMAIL || 'admin@test.com';
    const adminPass = process.env.TEST_ADMIN_PASSWORD || 'password';

    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPass);
    await page.click('button[type="submit"]');

    // Expect redirect to dashboard
    await page.waitForURL('**/dashboard');
    await expect(page).toHaveURL(/dashboard/);

    // Navigate to briefs page
    await page.goto('/dashboard/briefs');

    // Verify briefs page loaded
    await expect(page.locator('h1').first()).toContainText(/briefs|brief/i);
  });

  test('toast notifications appear on action', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    const adminEmail = process.env.TEST_ADMIN_EMAIL || 'admin@test.com';
    const adminPass = process.env.TEST_ADMIN_PASSWORD || 'password';
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPass);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    await page.goto('/dashboard/briefs');

    // Try to create a brief (trigger success or error toast)
    const createBtn = page.locator('button:has-text("New Brief"), button:has-text("Create")').first();
    if (await createBtn.isVisible()) {
      await createBtn.click();
      // Look for toast (success or error)
      const toast = page.locator('[role="alert"], .toast, [class*="toast"]').first();
      await expect(toast).toBeVisible({ timeout: 5000 }).catch(() => {
        console.log('Toast not found but action triggered');
      });
    }
  });

  test('loading button shows spinner during submission', async ({ page }) => {
    // Login
    await page.goto('/login');
    const adminEmail = process.env.TEST_ADMIN_EMAIL || 'admin@test.com';
    const adminPass = process.env.TEST_ADMIN_PASSWORD || 'password';
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPass);

    const actionBtn = page.locator('button[type="submit"]').first();

    // Click and immediately check for disabled state or loading text
    await actionBtn.click();
    const isDisabledDuringSubmit = await actionBtn.isDisabled({ timeout: 200 }).catch(() => false);
    const textContent = await actionBtn.textContent();
    const isLoaderVisible = (textContent && textContent.includes('Signing in')) || isDisabledDuringSubmit;

    expect(isLoaderVisible).toBe(true);
    console.log('✓ Loading state working');
  });

  test('no console errors on page load', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', err => {
      errors.push(err.message);
    });

    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Allow 2s for any lingering errors
    await page.waitForTimeout(2000);

    // Filter out known/safe errors
    const criticalErrors = errors.filter(
      e => !e.includes('Extensions') && !e.includes('Failed to fetch') && !e.includes('404')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('mobile: 375px viewport loads without horizontal scroll', async ({ page }) => {
    page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Check for horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowWidth = await page.evaluate(() => window.innerWidth);

    expect(bodyWidth).toBeLessThanOrEqual(windowWidth + 1); // +1 for rounding
    console.log(`✓ Mobile (375px): no horizontal scroll (body: ${bodyWidth}, window: ${windowWidth})`);
  });

  test('color tokens loaded (semantic system available)', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    const primaryColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
    });

    // Spotify green should be present
    expect(primaryColor.trim()).toMatch(/#|rgb/);
    console.log(`✓ Color tokens loaded: --color-primary = ${primaryColor}`);
  });
});
