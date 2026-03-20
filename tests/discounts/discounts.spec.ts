// tests/discounts/discounts.spec.ts
// Regression tests for Discounts and Vouchers module

import { test, expect } from '../../fixtures';
import { DISCOUNTS } from '../../utils/testData';
import { DiscountsPage } from '../../pages/DiscountsPage';

test.describe('Discounts & Vouchers', () => {

  // ─── Smoke Tests ────────────────────────────────────────────────────────────

  test.describe('Smoke - Page Load', () => {

    test.beforeEach(async ({ discountsPage }) => {
      await discountsPage.navigate();
      await discountsPage.expectPageLoaded();
    });

    test('should load discounts page with correct title', async ({ discountsPage }) => {
      await discountsPage.expectPageLoaded();
    });

    test('should display discounts table with data', async ({ discountsPage }) => {
      await discountsPage.expectTableHasData();
    });

    test('should show search input', async ({ discountsPage }) => {
      await expect(discountsPage.searchInput).toBeVisible();
      await expect(discountsPage.searchInput).toBeEnabled();
    });

    test('should display column headers', async ({ discountsPage, page }) => {
      await expect(page.getByText('Discount name')).toBeVisible();
      await expect(page.getByText('Type')).toBeVisible();
      await expect(page.getByText('Status')).toBeVisible();
      await expect(page.getByText('Validity window')).toBeVisible();
      await expect(page.getByText('Usage counter')).toBeVisible();
      await expect(page.getByText('Actions')).toBeVisible();
    });

    test('should show enabled statuses in table', async ({ discountsPage }) => {
      const enabledCount = await discountsPage.enabledBadges().count();
      expect(enabledCount).toBeGreaterThan(0);
    });

  });

  // ─── Role-based Tests ────────────────────────────────────────────────────────

  test.describe('Role - Reader', () => {

    test.beforeAll(async ({ browser }) => {
      // Ensure we are on reader role (default - exit any active role)
      const context = await browser.newContext({
        storageState: 'fixtures/auth.json',
        userAgent: 'hly--dev--go',
      });
      const page = await context.newPage();
      const discountsPage = new DiscountsPage(page);
      await discountsPage.navigateToDashboard();

      // Exit any active role if present
      const exitButton = page.getByRole('button', { name: 'Exit' });
      if (await exitButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await exitButton.click();
        await page.waitForLoadState('domcontentloaded');
      }

      await context.storageState({ path: 'fixtures/auth.json' });
      await context.close();
    });

    test.beforeEach(async ({ discountsPage }) => {
      await discountsPage.navigate();
      await discountsPage.expectPageLoaded();
    });

    test('should NOT show Create discount button with reader role', async ({ discountsPage }) => {
      await discountsPage.expectCreateButtonNotVisible();
    });

  });

  test.describe('Role - Manager B2B', () => {

    test.beforeAll(async ({ browser }) => {
      const context = await browser.newContext({
        storageState: 'fixtures/auth.json',
        userAgent: 'hly--dev--go',
      });
      const page = await context.newPage();
      const discountsPage = new DiscountsPage(page);
      await discountsPage.ensureRole('platform:manager:b2b');
      await context.storageState({ path: 'fixtures/auth.json' });
      await context.close();
    });

    test.beforeEach(async ({ discountsPage }) => {
      await discountsPage.navigate();
      await discountsPage.expectPageLoaded();
    });

    test('should show Create discount button with manager role', async ({ discountsPage }) => {
      await discountsPage.expectCreateButtonVisible();
    });

  });

  // ─── Search Tests ────────────────────────────────────────────────────────────

  test.describe('Search Functionality', () => {

    test.beforeEach(async ({ discountsPage }) => {
      await discountsPage.navigate();
      await discountsPage.expectPageLoaded();
    });

    test('should filter discounts by name', async ({ discountsPage }) => {
      await discountsPage.searchDiscount(DISCOUNTS.searchTerms.VALID);
      await discountsPage.expectTableHasData();
      const names = await discountsPage.getDiscountNames();
      names.forEach(name => {
        expect(name.toLowerCase()).toContain(DISCOUNTS.searchTerms.VALID.toLowerCase());
      });
    });

    test('should clear search and show all discounts', async ({ discountsPage }) => {
      await discountsPage.searchDiscount(DISCOUNTS.searchTerms.VALID);
      const filteredCount = await discountsPage.getRowCount();
      await discountsPage.clearSearch();
      const totalCount = await discountsPage.getRowCount();
      expect(totalCount).toBeGreaterThanOrEqual(filteredCount);
    });

    test('should find TEST_VOUCHER_APPLY_JP by name', async ({ discountsPage }) => {
      await discountsPage.searchDiscount(DISCOUNTS.existing.TEST_VOUCHER);
      await discountsPage.expectDiscountInList(DISCOUNTS.existing.TEST_VOUCHER);
    });

  });

  // ─── Navigation Tests ────────────────────────────────────────────────────────

  test.describe('Navigation', () => {

    test('should be accessible from sidebar', async ({ discountsPage, page }) => {
      await discountsPage.navigateToDashboard();
      await discountsPage.clickSidebarItem('sidebar-link-sidebar.discounts');
      await expect(page).toHaveURL(new RegExp('discounts'));
    });

  });

});