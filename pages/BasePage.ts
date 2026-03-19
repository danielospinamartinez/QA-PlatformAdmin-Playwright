// pages/BasePage.ts
// All page objects extend this class - contains shared methods

import { Page, Locator, expect } from '@playwright/test';
import { ENV } from '../config/env';

export type UserRole =
  | 'platform:global:admin'
  | 'platform:manager:b2b'
  | 'platform:manager:b2c'
  | 'platform:customer:experience'
  | 'platform:customer:support'
  | 'platform:customer:test'
  | 'platform:financial:admin'
  | 'platform:reader';

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

  // ─── Role Management ───────────────────────────────────────────────────────

  async changeRole(role: UserRole): Promise<void> {
    await this.goto(ENV.MODULES.DASHBOARD);

    await this.page.locator('button:has(.lucide-ellipsis-vertical)').click();
    await this.page.getByRole('menuitem', { name: 'Test with Role' }).click();
    await this.page.getByRole('combobox').click();
    await this.page.getByText(role).click();
    await this.page.getByRole('button', { name: 'Apply Role' }).click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);
  }

  async ensureRole(role: UserRole): Promise<void> {
    await this.goto(ENV.MODULES.DASHBOARD);

    const roleIndicator = this.page.getByText(`Testing as role: ${role}`);
    const isRoleActive = await roleIndicator.isVisible({ timeout: 3000 }).catch(() => false);

    if (!isRoleActive) {
      console.log(`🔄 Changing role to ${role}...`);
      await this.changeRole(role);
      console.log(`✅ Role changed to ${role}`);
    } else {
      console.log(`✅ Already on role ${role}`);
    }
  }

  async expectRoleActive(role: UserRole): Promise<void> {
    await expect(
      this.page.getByText(`Testing as role: ${role}`)
    ).toBeVisible({ timeout: 10_000 });
  }

  // ─── Waiting Helpers ────────────────────────────────────────────────────────

  async waitForPageReady(): Promise<void> {
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

  // ─── Sidebar Navigation ─────────────────────────────────────────────────────

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