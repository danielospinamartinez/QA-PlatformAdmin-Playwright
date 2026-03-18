// pages/BasePage.ts
// All page objects extend this class - contains shared methods

import { Page, Locator, expect } from '@playwright/test';
import { ENV } from '../config/env';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ─── Navigation ────────────────────────────────────────────────────────────

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToDashboard(): Promise<void> {
    await this.goto(ENV.MODULES.DASHBOARD);
  }

  // ─── Waiting Helpers ────────────────────────────────────────────────────────

  async waitForPageReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForSpinnerToDisappear(): Promise<void> {
    const spinner = this.page.locator('[class*="spinner"], [class*="loading"], [class*="skeleton"]');
    if (await spinner.isVisible({ timeout: 2000 }).catch(() => false)) {
      await spinner.waitFor({ state: 'hidden', timeout: 30_000 });
    }
  }

  // ─── Common Assertions ──────────────────────────────────────────────────────

  async expectPageTitle(title: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: title })).toBeVisible();
  }

  async expectUrl(urlPart: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(urlPart));
  }

  async expectToastMessage(message: string): Promise<void> {
    const toast = this.page.locator('[class*="toast"], [class*="notification"], [role="alert"]');
    await expect(toast.filter({ hasText: message })).toBeVisible({ timeout: 10_000 });
  }

  // ─── Sidebar Navigation ─────────────────────────────────────────────────────

  get sidebarModules(): Locator {
    return this.page.locator('nav').getByText('Modules');
  }

  async clickSidebarItem(testId: string): Promise<void> {
    await this.page.getByTestId(testId).click();
    await this.waitForPageReady();
  }

  // ─── Screenshot Helper ──────────────────────────────────────────────────────

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }
}
