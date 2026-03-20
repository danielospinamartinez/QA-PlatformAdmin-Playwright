// utils/testData.ts
// Centralized test data - easy to update without touching test files

export const DISCOUNTS = {
  // Existing discounts visible in the dashboard (from screenshot)
  existing: {
    TEST_VOUCHER: 'TEST_VOUCHER_APPLY_JP',
    TEST_KLAVIYO_50: 'TestKlaviyo50OFF',
    TEST_KLAVIYO_40: 'TestKlaviyo40OFF',
    TEST_KLAVIYO_30: 'TestKlaviyo30OFF',
    TEST_KLAVIYO_20: 'TestKlaviyo20OFF',
    TEST_CHECKOUT: 'test-checkout fix-value',
    TEST_CHECKOUT_VENCIDO: 'test-checkout-vencido',
  },

  // Data for creating new test discounts
  new: {
    PERCENTAGE_DISCOUNT: {
      name: `QA_TEST_PERCENT_${Date.now()}`,
      type: '%' as const,
      value: 10,
    },
    FIXED_DISCOUNT: {
      name: `QA_TEST_FIXED_${Date.now()}`,
      type: '€' as const,
      value: 5,
    },
  },

  // Search terms
  searchTerms: {
    VALID: 'QA-',
    INVALID: 'DISCOUNT_THAT_DOES_NOT_EXIST_XYZ',
    PARTIAL: 'test',
  },
};

export const URLS = {
  DASHBOARD: '/platform-admin/',
  DISCOUNTS: '/platform-admin/modules/discounts',
};
