// config/env.ts
// Central configuration for all environments

export const ENV = {
  // Base URLs
  BASE_URL: process.env.BASE_URL || 'https://tools.pre.plat.mnvop.net',
  PLATFORM_ADMIN_URL: process.env.PLATFORM_ADMIN_URL || 'https://tools.pre.plat.mnvop.net/platform-admin',

  // Authentication
  USER_AGENT: process.env.USER_AGENT || 'hly--dev--go',
  USER_EMAIL: process.env.USER_EMAIL || 'gustavo.ospina@holafly.com',

  // Module URLs
  MODULES: {
    DASHBOARD: '/platform-admin/',
    DISCOUNTS: '/platform-admin/modules/discounts',
    TENANTS: '/platform-admin/modules/tenants',
    TRAVELLERS: '/platform-admin/modules/travellers',
    ORDERS: '/platform-admin/modules/orders',
    PAYMENTS: '/platform-admin/modules/payments',
    ESIMS: '/platform-admin/modules/esims',
    STOCK_MANAGER: '/platform-admin/modules/stock-manager',
  },
} as const;
