// pages/CreateDiscountPage.ts

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export type DiscountType = 'percentage' | 'fixed';
export type DiscountScope = 'Trips' | 'Plans';
export type PlanType = 'Yearly' | 'Monthly';
export type DiscountTeam = 'Marketing' | 'Affiliates' | 'CX / Sales' | 'Support' | 'Growth';
export type RedemptionType = 'unlimited' | 'limited';

export interface CreateDiscountData {
  name: string;
  description: string;
  type: DiscountType;
  value: string;
  orderValueMin: string;
  orderValueMax: string;
  scope: DiscountScope;
  scopeItem: string;
  planType?: PlanType;
  redemptions: RedemptionType;
  redemptionLimit?: string;
  team: DiscountTeam;
  enableAfterCreate: boolean;
}

export class CreateDiscountPage extends BasePage {

  // ─── Step 1 Locators ───────────────────────────────────────────────────────

  get discountNameInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Enter discount name' });
  }

  get descriptionInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Add some notes if needed.' });
  }

  get percentageToggle(): Locator {
    return this.page.getByRole('switch').first();
  }

  get fixedToggle(): Locator {
    return this.page.getByRole('switch').nth(1);
  }

  get percentageValueInput(): Locator {
    return this.page.getByRole('textbox', { name: '0', exact: true });
  }

  get fixedValueInput(): Locator {
    return this.page.getByRole('textbox', { name: '0.00' });
  }

  get orderValueMinInput(): Locator {
    return this.page.locator('input[name="orderValueMin"]');
  }

  get orderValueMaxInput(): Locator {
    return this.page.locator('input[name="orderValueMax"]');
  }

  get continueButton(): Locator {
    return this.page.getByRole('button', { name: 'Continue' });
  }

  get backButton(): Locator {
    return this.page.getByRole('button', { name: 'Back' });
  }

  // ─── Step 2 Locators ───────────────────────────────────────────────────────

  get dateRangeButton(): Locator {
    return this.page.getByRole('button', { name: 'Select date range' });
  }

  get unlimitedRedemptionsButton(): Locator {
    return this.page.getByRole('button', { name: 'Unlimited redemptions' });
  }

  get limitedRedemptionsButton(): Locator {
    return this.page.getByRole('button', { name: 'Limited redemptions', exact: true });
  }

  get redemptionLimitInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Enter number of redemptions' });
  }

  // ─── Step 3 Locators ───────────────────────────────────────────────────────

  get teamDropdown(): Locator {
    return this.page.getByRole('combobox');
  }

  // ─── Result Locators ───────────────────────────────────────────────────────

  get successMessage(): Locator {
    return this.page.getByText('The discount was created successfully');
  }

  get enableDiscountButton(): Locator {
    return this.page.getByRole('button', { name: 'Enable discount' });
  }

  get notNowButton(): Locator {
    return this.page.getByRole('button', { name: 'Not now' });
  }

  get discountStatusDisabled(): Locator {
    return this.page.getByText('Discount statusDisabled');
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  generateDiscountName(): string {
    return `QA-AUTO-${Date.now()}`;
  }

  getFutureDate(daysFromNow: number): { day: string; month: number; year: number } {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return {
      day: date.getDate().toString(),
      month: date.getMonth(),
      year: date.getFullYear(),
    };
  }

  async selectFutureDate(): Promise<void> {
    const start = this.getFutureDate(5);
    const end = this.getFutureDate(10);

    await this.dateRangeButton.click();
    await this.page.waitForTimeout(500);

    // Click start day
    await this.page.getByRole('button', { name: start.day, exact: true }).first().click();
    // Click end day
    await this.page.getByRole('button', { name: end.day, exact: true }).first().click();
    await this.page.getByRole('button', { name: 'Apply' }).click();
  }

  async selectTeam(team: DiscountTeam): Promise<void> {
    await this.teamDropdown.click();
    await this.page.getByRole('option', { name: team }).click();
  }

  async selectScopeItem(scope: DiscountScope, item: string, planType?: PlanType): Promise<void> {
    await this.page.getByRole('button', { name: scope }).click();

    if (scope === 'Trips') {
      await this.page.getByRole('textbox', { name: 'Search trips...' }).fill(item);
      await this.page.getByRole('button', { name: item }).first().click();
    } else {
      await this.page.getByRole('textbox', { name: 'Search plans...' }).fill(item);
      await this.page.getByRole('button', { name: item }).first().click();

      // Select plan type (required for Plans scope)
      if (planType) {
        await this.page.getByRole('button', { name: planType }).click();
      }
    }
  }

  // ─── Full Flow ─────────────────────────────────────────────────────────────

  async fillStep1(data: CreateDiscountData): Promise<void> {
    // Name and description
    await this.discountNameInput.fill(data.name);
    await this.descriptionInput.fill(data.description);

    // Activate toggle and fill value
    if (data.type === 'percentage') {
      await this.percentageToggle.click();
      await this.percentageValueInput.fill(data.value);
    } else {
      await this.fixedToggle.click();
      await this.fixedValueInput.fill(data.value);
    }

    // Order value min and max
    await this.orderValueMinInput.fill(data.orderValueMin);
    await this.orderValueMaxInput.fill(data.orderValueMax);
    await this.page.keyboard.press('Tab');
    await this.page.waitForTimeout(300);

    // Scope and plan type
    await this.selectScopeItem(data.scope, data.scopeItem, data.planType);

    // Continue
    await this.continueButton.click();
    await this.waitForPageReady();
  }

  async fillStep2(data: CreateDiscountData): Promise<void> {
    // Future date (always)
    await this.selectFutureDate();

    // Redemptions
    if (data.redemptions === 'unlimited') {
      await this.unlimitedRedemptionsButton.click();
    } else {
      await this.limitedRedemptionsButton.click();
      await this.redemptionLimitInput.fill(data.redemptionLimit || '10');
    }

    await this.continueButton.click();
    await this.waitForPageReady();
  }

  async fillStep3(data: CreateDiscountData): Promise<void> {
    await this.selectTeam(data.team);
    await this.continueButton.click();
    await this.waitForPageReady();
  }

  async createDiscount(data: CreateDiscountData): Promise<void> {
    await this.fillStep1(data);
    await this.fillStep2(data);
    await this.fillStep3(data);
  }

  // ─── Assertions ────────────────────────────────────────────────────────────

  async expectDiscountCreated(): Promise<void> {
    await expect(this.successMessage).toBeVisible({ timeout: 15_000 });
    await expect(this.discountStatusDisabled).toBeVisible();
  }

  async expectStep1Visible(): Promise<void> {
    await expect(this.discountNameInput).toBeVisible();
    await expect(this.descriptionInput).toBeVisible();
    await expect(this.continueButton).toBeVisible();
  }
}