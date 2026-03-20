// pages/DiscountsPage.ts
// Page Object for the Discounts and Vouchers module
// URL: /platform-admin/modules/discounts

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ENV } from '../config/env';

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
    return this.page.getByRole('textbox', { name: 'Search by discount name' });
  }

  get searchButton(): Locator {
    return this.page.locator('form').getByRole('button');
  }

  get createDiscountButton(): Locator {
    return this.page.getByRole('button', { name: 'Create discount' });
  }

  get tableRows(): Locator {
    return this.page.locator('tbody tr');
  }

  actionsMenuButton(rowIndex: number = 0): Locator {
    return this.tableRows.nth(rowIndex).getByRole('button').last();
  }

  enabledBadges(): Locator {
    return this.page.locator('span, div').filter({ hasText: /^Enabled$/ });
  }

  disabledBadges(): Locator {
    return this.page.locator('span').filter({ hasText: 'Disabled' });
  }

  // ─── Navigation ────────────────────────────────────────────────────────────

  async navigate(): Promise<void> {
    await this.goto(ENV.MODULES.DISCOUNTS);
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  async searchDiscount(name: string): Promise<void> {
    await this.searchInput.fill(name);
    await this.searchButton.click();
    await this.waitForSpinnerToDisappear();
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
    await this.searchButton.click();
    await this.waitForSpinnerToDisappear();
  }

  async clickCreateDiscount(): Promise<void> {
    await this.createDiscountButton.click();
    await this.waitForPageReady();
  }

  async openActionsMenu(rowIndex: number = 0): Promise<void> {
    await this.actionsMenuButton(rowIndex).click();
  }

  // ─── Data Extraction ────────────────────────────────────────────────────────

  async getDiscountNames(): Promise<string[]> {
    return await this.page.locator('tbody td:first-child').allTextContents();
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
  }

  async expectCreateButtonVisible(): Promise<void> {
    await expect(this.createDiscountButton).toBeVisible();
  }

  async expectCreateButtonNotVisible(): Promise<void> {
    await expect(this.createDiscountButton).not.toBeVisible();
  }

  async expectDiscountInList(name: string): Promise<void> {
    const row = this.tableRows.filter({ hasText: name });
    await expect(row).toBeVisible();
  }

  async expectDiscountNotInList(name: string): Promise<void> {
    const row = this.tableRows.filter({ hasText: name });
    await expect(row).not.toBeVisible();
  }

  async expectTableHasData(): Promise<void> {
    const count = await this.getRowCount();
    expect(count).toBeGreaterThan(0);
  }
}