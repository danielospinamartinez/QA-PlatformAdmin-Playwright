// pages/DiscountsPage.ts
// Page Object for the Discounts and Vouchers module
// URL: /platform-admin/modules/discounts

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ENV } from '../config/env';

// Types to represent the data model
export type DiscountStatus = 'Enabled' | 'Disabled';
export type DiscountType = '%' | '€';

export interface DiscountRow {
  name: string;
  type: DiscountType;
  status: DiscountStatus;
  validityWindow: string;
  usageCounter?: number;
}

export class DiscountsPage extends BasePage {

  // ─── Locators ──────────────────────────────────────────────────────────────

  get heading(): Locator {
    return this.page.getByRole('heading', { name: 'Discounts and vouchers' });
  }

  get searchInput(): Locator {
    return this.page.getByPlaceholder('Search by discount name');
  }

  get createDiscountButton(): Locator {
    return this.page.getByRole('button', { name: 'Create discount' });
  }

  get discountsTable(): Locator {
    return this.page.getByRole('table').or(
      this.page.locator('table, [class*="table"], [class*="list"]')
    ).first();
  }

  get tableRows(): Locator {
    return this.page.locator('tbody tr, [class*="row"]:not(:first-child)');
  }

  get columnHeaders(): Locator {
    return this.page.locator('thead th, [class*="header"] [class*="cell"]');
  }

  // Status badges
  enabledBadges(): Locator {
    return this.page.locator('[class*="badge"], span').filter({ hasText: 'Enabled' });
  }

  disabledBadges(): Locator {
    return this.page.locator('[class*="badge"], span').filter({ hasText: 'Disabled' });
  }

  // Actions menu (the "..." button on each row)
  actionsMenuButton(rowIndex: number = 0): Locator {
    return this.tableRows.nth(rowIndex).getByRole('button').last();
  }

  // ─── Navigation ────────────────────────────────────────────────────────────

  async navigate(): Promise<void> {
    await this.goto(ENV.MODULES.DISCOUNTS);
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  async searchDiscount(name: string): Promise<void> {
    await this.searchInput.fill(name);
    await this.page.keyboard.press('Enter');
    await this.waitForSpinnerToDisappear();
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
    await this.waitForSpinnerToDisappear();
  }

  async clickCreateDiscount(): Promise<void> {
    await this.createDiscountButton.click();
    await this.waitForPageReady();
  }

  async openActionsMenu(rowIndex: number = 0): Promise<void> {
    await this.actionsMenuButton(rowIndex).click();
  }

  async clickActionMenuItem(actionName: string): Promise<void> {
    const menuItem = this.page.getByRole('menuitem', { name: actionName })
      .or(this.page.locator('[role="menu"] li, [class*="dropdown"] li').filter({ hasText: actionName }));
    await menuItem.click();
  }

  // ─── Data Extraction ────────────────────────────────────────────────────────

  async getDiscountNames(): Promise<string[]> {
    const nameCell = this.page.locator('tbody td:first-child, [class*="row"] [class*="cell"]:first-child');
    return await nameCell.allTextContents();
  }

  async getRowCount(): Promise<number> {
    return await this.tableRows.count();
  }

  async getDiscountByName(name: string): Promise<Locator> {
    return this.tableRows.filter({ hasText: name });
  }

  // ─── Assertions ────────────────────────────────────────────────────────────

  async expectPageLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.searchInput).toBeVisible();
    await expect(this.createDiscountButton).toBeVisible();
  }

  async expectDiscountInList(name: string): Promise<void> {
    const row = await this.getDiscountByName(name);
    await expect(row).toBeVisible();
  }

  async expectDiscountNotInList(name: string): Promise<void> {
    const row = await this.getDiscountByName(name);
    await expect(row).not.toBeVisible();
  }

  async expectDiscountStatus(name: string, status: DiscountStatus): Promise<void> {
    const row = this.tableRows.filter({ hasText: name });
    await expect(row.getByText(status)).toBeVisible();
  }

  async expectTableHasData(): Promise<void> {
    const count = await this.getRowCount();
    expect(count).toBeGreaterThan(0);
  }

  async expectSearchResultsFor(term: string): Promise<void> {
    // After searching, all visible discount names should contain the search term
    const names = await this.getDiscountNames();
    names.forEach(name => {
      expect(name.toLowerCase()).toContain(term.toLowerCase());
    });
  }

  async expectUrl(): Promise<void> {
    await this.expectUrl('modules/discounts');
  }
}
