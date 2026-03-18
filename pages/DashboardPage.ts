// pages/DashboardPage.ts
// Page Object for the main Dashboard

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ENV } from '../config/env';

export class DashboardPage extends BasePage {
  // ─── Locators ──────────────────────────────────────────────────────────────

  get heading(): Locator {
    return this.page.getByRole('heading', { name: 'Dashboard' });
  }

  get subheading(): Locator {
    return this.page.getByText('Manage your system here');
  }

  // Module cards
  get tenantsCard(): Locator {
    return this.page.getByRole('heading', { name: 'Tenants' });
  }

  get travellersCard(): Locator {
    return this.page.getByRole('heading', { name: 'Travellers' });
  }

  get ordersCard(): Locator {
    return this.page.getByRole('heading', { name: 'Orders' });
  }

  get paymentsCard(): Locator {
    return this.page.getByRole('heading', { name: 'Payments' });
  }

  get discountsCard(): Locator {
    return this.page.getByRole('heading', { name: 'Discounts and vouchers' });
  }

  get stockManagerCard(): Locator {
    return this.page.getByRole('heading', { name: 'Stock Manager' });
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  async navigate(): Promise<void> {
    await this.goto(ENV.MODULES.DASHBOARD);
  }

  async goToDiscounts(): Promise<void> {
    await this.page.getByTestId('dashboard-link-discounts').click();
    await this.waitForPageReady();
  }

  async goToModuleViaCard(moduleName: string): Promise<void> {
    const moduleSection = this.page.locator('div, article, section').filter({
      hasText: moduleName,
    }).first();
    await moduleSection.getByRole('link', { name: /visit/i }).click();
    await this.waitForPageReady();
  }

  async goToModuleViaSidebar(moduleName: string): Promise<void> {
    await this.clickSidebarItem('sidebar-link-sidebar.discounts');
    await this.waitForPageReady();
  }

  // ─── Assertions ────────────────────────────────────────────────────────────

  async expectDashboardLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.subheading).toBeVisible();
    await expect(this.discountsCard).toBeVisible();
  }

  async expectAllModulesVisible(): Promise<void> {
    await expect(this.tenantsCard).toBeVisible();
    await expect(this.travellersCard).toBeVisible();
    await expect(this.ordersCard).toBeVisible();
    await expect(this.paymentsCard).toBeVisible();
    await expect(this.discountsCard).toBeVisible();
    await expect(this.stockManagerCard).toBeVisible();
  }
}
