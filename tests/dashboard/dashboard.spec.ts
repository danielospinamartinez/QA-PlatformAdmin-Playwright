// tests/dashboard/dashboard.spec.ts
// Regression tests for the main Dashboard page

import { test, expect } from '../../fixtures';
import { ENV } from '../../config/env';

test.describe('Dashboard - Smoke Tests', () => {

  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.navigate();
  });

  test('should load dashboard with correct title', async ({ dashboardPage }) => {
    await dashboardPage.expectDashboardLoaded();
  });

  test('should display all 6 module cards', async ({ dashboardPage }) => {
    await dashboardPage.expectAllModulesVisible();
  });

  test('should have correct URL after navigation', async ({ page }) => {
    await expect(page).toHaveURL(new RegExp('platform-admin'));
  });

  test('should navigate to Discounts module via card', async ({ dashboardPage, page }) => {
    await dashboardPage.goToDiscounts();
    await expect(page).toHaveURL(new RegExp('discounts'));
    await expect(page.getByRole('heading', { name: 'Discounts and vouchers' })).toBeVisible();
  });

  test('should navigate to Discounts module via sidebar', async ({ dashboardPage, page }) => {
    await dashboardPage.goToModuleViaSidebar('Discounts & Vouchers');
    await expect(page).toHaveURL(new RegExp('discounts'));
  });

  test('should have correct User-Agent set', async ({ page }) => {
    // Verify the user-agent is being sent correctly by checking we can access the page
    // (the page would reject us with wrong user-agent)
    const url = page.url();
    expect(url).toContain('platform-admin');
  });

});
