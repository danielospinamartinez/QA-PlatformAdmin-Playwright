// fixtures/index.ts
// Custom fixtures extend Playwright's base test
// This allows us to inject page objects into every test automatically

import { test as base, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { DiscountsPage } from '../pages/DiscountsPage';
import { CreateDiscountPage } from '../pages/CreateDiscountPage';

type HolaflyFixtures = {
  dashboardPage: DashboardPage;
  discountsPage: DiscountsPage;
  createDiscountPage: CreateDiscountPage;
};

export const test = base.extend<HolaflyFixtures>({

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  discountsPage: async ({ page }, use) => {
    await use(new DiscountsPage(page));
  },

  createDiscountPage: async ({ page }, use) => {
    await use(new CreateDiscountPage(page));
  },
});

export { expect };