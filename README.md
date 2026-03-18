# 🧪 HolaFly QA Automation Framework

Playwright + TypeScript framework for automating the HolaFly Admin Dashboard regressions.

---

## 📁 Project Structure

```
holafly-qa/
├── config/
│   └── env.ts              # URLs, credentials, environment config
├── fixtures/
│   ├── index.ts            # Custom test fixtures (inject page objects)
│   └── auth.json           # Saved auth state (auto-generated, gitignored)
├── pages/
│   ├── BasePage.ts         # Shared methods for all pages
│   ├── DashboardPage.ts    # Dashboard page object
│   └── DiscountsPage.ts    # Discounts & Vouchers page object
├── tests/
│   ├── auth.setup.ts       # Authentication setup (runs once)
│   ├── dashboard/
│   │   └── dashboard.spec.ts
│   └── discounts/
│       └── discounts.spec.ts
├── utils/
│   └── testData.ts         # Centralized test data
├── reports/                # Test reports (auto-generated)
├── test-results/           # Screenshots, videos (auto-generated)
├── playwright.config.ts    # Playwright configuration
├── tsconfig.json           # TypeScript configuration
└── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ installed
- Access to HolaFly pre-production environment

### 2. Install dependencies
```bash
npm install
npx playwright install chromium
```

### 3. Configure environment
```bash
cp .env.example .env
# .env is already pre-configured for the pre environment
```

### 4. Run tests
```bash
# Run all tests
npm test

# Run with browser visible (great for debugging)
npm run test:headed

# Open Playwright interactive UI
npm run test:ui

# Run only discounts tests
npm run test:discounts

# View HTML report after running
npm run test:report
```

---

## 🏗️ Architecture

### Page Object Model (POM)
Each page/module has its own class in `/pages`. This means:
- Locators are defined ONCE (change in one place if UI changes)
- Tests are readable and maintainable
- No duplicated selectors

### Fixtures
Custom fixtures in `/fixtures/index.ts` auto-inject page objects into tests:
```typescript
// In your test - no manual setup needed!
test('my test', async ({ discountsPage }) => {
  await discountsPage.navigate();
  // discountsPage is ready to use
});
```

### Auth Setup
Authentication runs ONCE before all tests via `auth.setup.ts`.
The session is saved to `fixtures/auth.json` and reused — no repeated logins.

---

## ➕ Adding New Tests

### Add a test to an existing module:
```typescript
// tests/discounts/discounts.spec.ts
test('my new test', async ({ discountsPage }) => {
  await discountsPage.navigate();
  await discountsPage.searchDiscount('TestKlaviyo50OFF');
  await discountsPage.expectDiscountInList('TestKlaviyo50OFF');
});
```

### Add a new page (new module):
1. Create `/pages/NewModulePage.ts` extending `BasePage`
2. Add it to `/fixtures/index.ts`
3. Create `/tests/new-module/new-module.spec.ts`

---

## 📊 Reports

After running tests, open the HTML report:
```bash
npm run test:report
```

Reports are saved to `/reports/html/index.html`

---

## 🔑 Key Configuration

| Setting | Value |
|--------|-------|
| Base URL | `https://tools.pre.plat.mnvop.net` |
| User-Agent | `hly--dev--go` |
| Test environment | Pre-production |
| Default browser | Chromium |

---

## 📌 Modules Covered

| Module | Status |
|--------|--------|
| Dashboard | ✅ |
| Discounts & Vouchers | ✅ |
| Tenants | 🔜 Pending |
| Travellers | 🔜 Pending |
| Orders | 🔜 Pending |
| Payments | 🔜 Pending |
| Stock Manager | 🔜 Pending |
| eSIMs | 🔜 Pending |
