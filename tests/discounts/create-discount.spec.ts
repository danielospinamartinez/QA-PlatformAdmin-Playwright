// tests/discounts/create-discount.spec.ts

import { test, expect } from '../../fixtures';
import { ENV } from '../../config/env';
import { CreateDiscountPage } from '../../pages/CreateDiscountPage';

test.describe('Discounts & Vouchers › Create Discount', () => {

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({
      storageState: 'fixtures/auth.json',
      userAgent: 'hly--dev--go',
    });
    const page = await context.newPage();
    const discountPage = new CreateDiscountPage(page);
    await discountPage.ensureRole('platform:manager:b2b');
    await context.storageState({ path: 'fixtures/auth.json' });
    await context.close();
  });

  test.beforeEach(async ({ createDiscountPage }) => {
    await createDiscountPage.goto(ENV.MODULES.DISCOUNTS);
  });

  // ─── Smoke ─────────────────────────────────────────────────────────────────

  test('should open create discount form', async ({ createDiscountPage, page }) => {
    await page.getByRole('button', { name: 'Create discount' }).click();
    await createDiscountPage.expectStep1Visible();
    await expect(page.getByRole('heading', { name: 'Create discount' })).toBeVisible();
  });

  // ─── Plans - Yearly ────────────────────────────────────────────────────────

  test('should create a percentage discount for Plans - Yearly', async ({ createDiscountPage, page }) => {
    await page.getByRole('button', { name: 'Create discount' }).click();

    await createDiscountPage.createDiscount({
      name: createDiscountPage.generateDiscountName(),
      description: 'QA Auto - Plans Yearly',
      type: 'percentage',
      value: '15',
      orderValueMin: '100',
      orderValueMax: '120',
      scope: 'Plans',
      scopeItem: 'Light Plan',
      planType: 'Yearly',
      redemptions: 'unlimited',
      team: 'Support',
      enableAfterCreate: false,
    });

    await createDiscountPage.expectDiscountCreated();
    await createDiscountPage.notNowButton.click();
  });

  test('should create a percentage discount for Plans - Yearly and enable it', async ({ createDiscountPage, page }) => {
    await page.getByRole('button', { name: 'Create discount' }).click();

    await createDiscountPage.createDiscount({
      name: createDiscountPage.generateDiscountName(),
      description: 'QA Auto - Plans Yearly Enabled',
      type: 'percentage',
      value: '10',
      orderValueMin: '100',
      orderValueMax: '120',
      scope: 'Plans',
      scopeItem: 'Light Plan',
      planType: 'Yearly',
      redemptions: 'unlimited',
      team: 'Support',
      enableAfterCreate: true,
    });

    await createDiscountPage.expectDiscountCreated();
    await createDiscountPage.enableDiscountButton.click();
  });

  // ─── Plans - Monthly ───────────────────────────────────────────────────────

  test('should create a percentage discount for Plans - Monthly', async ({ createDiscountPage, page }) => {
    await page.getByRole('button', { name: 'Create discount' }).click();

    await createDiscountPage.createDiscount({
      name: createDiscountPage.generateDiscountName(),
      description: 'QA Auto - Plans Monthly',
      type: 'percentage',
      value: '10',
      orderValueMin: '100',
      orderValueMax: '120',
      scope: 'Plans',
      scopeItem: 'Light Plan',
      planType: 'Monthly',
      redemptions: 'unlimited',
      team: 'Support',
      enableAfterCreate: false,
    });

    await createDiscountPage.expectDiscountCreated();
    await createDiscountPage.notNowButton.click();
  });

  // ─── Limited Redemptions ───────────────────────────────────────────────────

  test('should create a discount with limited redemptions', async ({ createDiscountPage, page }) => {
    await page.getByRole('button', { name: 'Create discount' }).click();

    await createDiscountPage.createDiscount({
      name: createDiscountPage.generateDiscountName(),
      description: 'QA Auto - Limited redemptions',
      type: 'percentage',
      value: '20',
      orderValueMin: '100',
      orderValueMax: '120',
      scope: 'Plans',
      scopeItem: 'Light Plan',
      planType: 'Yearly',
      redemptions: 'limited',
      redemptionLimit: '5',
      team: 'Marketing',
      enableAfterCreate: false,
    });

    await createDiscountPage.expectDiscountCreated();
    await createDiscountPage.notNowButton.click();
  });

  // ─── Fixed Amount ──────────────────────────────────────────────────────────

  test('should create a fixed amount discount', async ({ createDiscountPage, page }) => {
    await page.getByRole('button', { name: 'Create discount' }).click();

    await createDiscountPage.createDiscount({
      name: createDiscountPage.generateDiscountName(),
      description: 'QA Auto - Fixed amount',
      type: 'fixed',
      value: '5',
      orderValueMin: '100',
      orderValueMax: '200',
      scope: 'Plans',
      scopeItem: 'Light Plan',
      planType: 'Yearly',
      redemptions: 'unlimited',
      team: 'Marketing',
      enableAfterCreate: false,
    });

    await createDiscountPage.expectDiscountCreated();
    await createDiscountPage.notNowButton.click();
  });

  // ─── Validations ───────────────────────────────────────────────────────────

  test('should not continue without discount name', async ({ createDiscountPage, page }) => {
    await page.getByRole('button', { name: 'Create discount' }).click();
    await createDiscountPage.expectStep1Visible();
    await createDiscountPage.continueButton.click();
    await expect(createDiscountPage.discountNameInput).toBeVisible();
    await expect(page.getByText('Create discount')).toBeVisible();
  });

  // ─── Navigation ────────────────────────────────────────────────────────────

  test('should go back from step 2 to step 1', async ({ createDiscountPage, page }) => {
    await page.getByRole('button', { name: 'Create discount' }).click();

    await createDiscountPage.fillStep1({
      name: createDiscountPage.generateDiscountName(),
      description: 'Back button test',
      type: 'percentage',
      value: '10',
      orderValueMin: '100',
      orderValueMax: '120',
      scope: 'Plans',
      scopeItem: 'Light Plan',
      planType: 'Yearly',
      redemptions: 'unlimited',
      team: 'Support',
      enableAfterCreate: false,
    });

    await createDiscountPage.backButton.click();
    await expect(createDiscountPage.discountNameInput).toBeVisible();
  });

});