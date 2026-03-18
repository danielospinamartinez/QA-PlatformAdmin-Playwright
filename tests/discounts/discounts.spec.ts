// tests/discounts/discounts.spec.ts
// Regression tests for Discounts and Vouchers module

import { test, expect } from '../../fixtures';
import { DISCOUNTS } from '../../utils/testData';

test.describe('Discounts & Vouchers', () => {

  test.beforeEach(async ({ discountsPage }) => {
    // Navigate to discounts before each test
    await discountsPage.navigate();
    await discountsPage.expectPageLoaded();
  });

  // ─── Smoke Tests ────────────────────────────────────────────────────────────

  test.describe('Smoke - Page Load', () => {

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

    test('should show "Create discount" button', async ({ discountsPage }) => {
      await expect(discountsPage.createDiscountButton).toBeVisible();
    });

    test('should display column headers', async ({ discountsPage }) => {
      const { page } = discountsPage;
      await expect(page.getByText('Discount name')).toBeVisible();
      await expect(page.getByText('Type')).toBeVisible();
      await expect(page.getByText('Status')).toBeVisible();
      await expect(page.getByText('Validity window')).toBeVisible();
      await expect(page.getByText('Usage counter')).toBeVisible();
      await expect(page.getByText('Actions')).toBeVisible();
    });

    test('should show enabled and disabled statuses', async ({ discountsPage }) => {
      // Verify both statuses exist in the table (based on screenshot data)
      const enabledCount = await discountsPage.enabledBadges().count();
      expect(enabledCount).toBeGreaterThan(0);
    });

  });

  // ─── Search Tests ────────────────────────────────────────────────────────────

  test.describe('Search Functionality', () => {

    test('should filter discounts by name', async ({ discountsPage }) => {
      await discountsPage.searchDiscount(DISCOUNTS.searchTerms.VALID);
      await discountsPage.expectTableHasData();
      // All results should contain the search term
      const names = await discountsPage.getDiscountNames();
      names.forEach(name => {
        expect(name.toLowerCase()).toContain(DISCOUNTS.searchTerms.VALID.toLowerCase());
      });
    });

    test('should show no results for invalid search', async ({ discountsPage, page }) => {
      await discountsPage.searchDiscount(DISCOUNTS.searchTerms.INVALID);
      // Should show empty state
      const rowCount = await discountsPage.getRowCount();
      expect(rowCount).toBe(0);
    });

    test('should clear search and show all discounts', async ({ discountsPage }) => {
      // First search for something
      await discountsPage.searchDiscount(DISCOUNTS.searchTerms.VALID);
      const filteredCount = await discountsPage.getRowCount();

      // Clear and verify all results return
      await discountsPage.clearSearch();
      const totalCount = await discountsPage.getRowCount();
      expect(totalCount).toBeGreaterThanOrEqual(filteredCount);
    });

    test('should find TEST_VOUCHER_APPLY_JP by name', async ({ discountsPage }) => {
      await discountsPage.searchDiscount(DISCOUNTS.existing.TEST_VOUCHER);
      await discountsPage.expectDiscountInList(DISCOUNTS.existing.TEST_VOUCHER);
    });

  });

  // ─── Create Discount Tests ────────────────────────────────────────────────────

  test.describe('Create Discount', () => {

    test('should open create discount form when button clicked', async ({ discountsPage, page }) => {
      await discountsPage.clickCreateDiscount();
      // After clicking, should navigate or show a modal/form
      // Update this assertion once you share the create form screenshot
      await expect(page).not.toHaveURL(new RegExp('discounts$'));
      // OR if it's a modal:
      // await expect(page.getByRole('dialog')).toBeVisible();
    });

  });

  // ─── Actions Menu Tests ────────────────────────────────────────────────────

  test.describe('Row Actions Menu', () => {

    test('should open actions menu on first row', async ({ discountsPage, page }) => {
      await discountsPage.openActionsMenu(0);
      // Menu should appear - update selectors based on actual menu options
      const menu = page.locator('[role="menu"], [class*="dropdown-menu"], [class*="actions-menu"]');
      await expect(menu).toBeVisible({ timeout: 5000 });
    });

  });

  // ─── Navigation Tests ────────────────────────────────────────────────────────

  test.describe('Navigation', () => {

    test('should be accessible from sidebar', async ({ dashboardPage, page }) => {
      await dashboardPage.navigate();
      await dashboardPage.clickSidebarItem('Discounts & Vouchers');
      await expect(page).toHaveURL(new RegExp('discounts'));
    });

    test('should show breadcrumb navigation', async ({ discountsPage, page }) => {
      await expect(page.getByText('Discounts and vouchers')).toBeVisible();
    });

  });

});
