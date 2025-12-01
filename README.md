# Appium + Jest Test Framework (project: appium-jest)

This repository contains a robust Appium + WebdriverIO + Jest test framework for Android testing. It includes a Page Object Model, global test hooks, centralized configuration, and best practices for mobile test automation.

## What's included

- `package.json` — project scripts and dependencies (`jest`, `appium`, `webdriverio`).
- `appium.config.cjs` — minimal Appium server config.
- `test-capabilities.cjs` — test-specific Appium capabilities.
- `pages/main.page.cjs` — Page Object Model for the main app screen.
- `tests/test-setup.cjs` — Jest setup that initializes Appium session and exposes `global.driver` and `global.mainPage`.
- `tests/hooks.cjs` — Global `beforeEach`/`afterEach` hooks for app reset and failure screenshots.
- `tests/sample.test.js` — Example tests using the Page Object.
- `jest.config.cjs` — Jest configuration with setup files.
- `artifacts/` — Directory for test screenshots and logs.

## Architecture

### Page Object Model

Elements and interactions are encapsulated in `pages/main.page.cjs`:

```javascript
class MainPage {
  async setAmount(value) {
    /* ... */
  }
  async getAmount() {
    /* ... */
  }
}
```

Tests use page objects instead of direct driver calls, keeping test code clean and maintainable.

### Global Setup (`tests/test-setup.cjs`)

Initializes Appium session once per test suite and exposes globally:

- `global.driver` — WebdriverIO driver instance
- `global.mainPage` — MainPage page object instance
- Tests access these without creating objects themselves

### Test Hooks (`tests/hooks.cjs`)

Global `beforeEach` and `afterEach` hooks provide:

- **beforeEach()** — Resets app state before each test (optional `driver.reset()`)
- **afterEach()** — Captures screenshots on test failure and saves to `artifacts/`
- **global.logger** — Consistent logging across tests (`info()`, `error()`, `warn()`)

## Prerequisites

- Node.js and npm installed.
- Android SDK and `adb` on PATH.
- An Android emulator running or a device connected (verify with `adb devices`).
- Appium installed (run locally with `npx appium`).

## Quick Setup

1. Install project dependencies:

```powershell
cd C:\Users\duxan\appium-jest
npm install
```

2. Install the UiAutomator2 driver for Appium (one time):

```powershell
appium driver install uiautomator2
```

3. Start Appium server in a separate terminal:

```powershell
npx appium
```

4. Verify Android emulator/device is connected:

```powershell
adb devices
```

5. Run tests:

```powershell
npm test
```

## File Structure

```
appium-jest/
├── appium.config.cjs          # Minimal Appium server config
├── jest.config.cjs             # Jest configuration with setup files
├── package.json                # Dependencies and scripts
├── test-capabilities.cjs       # Appium capabilities (platform, app, etc.)
├── README.md                   # This file
├── artifacts/                  # Test screenshots and logs (auto-created)
├── pages/
│   └── main.page.cjs           # Page Object for main screen
└── tests/
    ├── sample.test.js          # Example tests
    ├── test-setup.cjs          # Jest setup: initializes Appium session
    └── hooks.cjs               # Global beforeEach/afterEach hooks
```

## How Tests Work

1. **Jest Setup** (`tests/test-setup.cjs`) runs before all tests:

   - Connects to Appium at `localhost:4723`
   - Creates a `MainPage` instance
   - Attaches both to `global` for test access

2. **Global Hooks** (`tests/hooks.cjs`) run before/after each test:

   - `beforeEach()` — Resets app state
   - `afterEach()` — Captures screenshot if test fails

3. **Test** (`tests/sample.test.js`) uses the Page Object:

```javascript
test('set and read amount (100)', async () => {
  await global.mainPage.setAmount('100');
  const value = await global.mainPage.getAmount();
  expect(value).toBeTruthy();
});
```

## Page Object Methods

The `MainPage` class provides:

- `async amountEl()` — Returns the amount input element
- `async waitForAmount(timeout = 15000)` — Waits for amount element to display
- `async setAmount(value)` — Sets amount value (clears, then sets)
- `async getAmount()` — Reads amount value (tries text, then attributes)

## Test Artifacts

On test failure, screenshots are automatically saved to `artifacts/` with timestamps:

```
artifacts/
├── screenshot-sample-test-2025-12-01T18-20-45-123.png
└── screenshot-sample-test-2025-12-01T18-20-50-456.png
```

Access logs via:

```javascript
global.logger.info('Test message');
global.logger.error('Error message');
global.logger.warn('Warning message');
```

## Configuration

### Appium Capabilities (`test-capabilities.cjs`)

```javascript
const capabilities = {
  platformName: 'Android',
  'appium:deviceName': 'Android Emulator',
  'appium:platformVersion': '16',
  'appium:automationName': 'UiAutomator2',
  'appium:app': 'C:/Users/duxan/Desktop/test.apk',
  'appium:appWaitActivity': '*',
  'appium:autoGrantPermissions': true,
};
```

Modify `appium:app` to point to your APK.

### Element Selectors

Selectors are defined in `pages/main.page.cjs`:

```javascript
const SELECTOR = 'id:editTextAmount'; // resource-id shorthand
```

### Jest Configuration (`jest.config.cjs`)

- `testTimeout: 300000` — 5-minute timeout for mobile tests
- `setupFilesAfterEnv: [test-setup.cjs, hooks.cjs]` — Runs setup files before tests
- `testMatch: **/tests/**/*.test.js` — Matches test files

## Common Issues & Fixes

**"Unable to connect to http://localhost:4723/"**

- Cause: Appium server not running
- Fix: Start Appium in a separate terminal with `npx appium`

**"Could not find a driver for automationName 'UiAutomator2'"**

- Cause: UiAutomator2 driver not installed
- Fix: Run `appium driver install uiautomator2`

**"element wasn't found" or "not displayed after 5000ms"**

- Cause: Wrong selector, app not launched, or timing issues
- Fix:
  - Verify selector using Android Studio Layout Inspector or Appium Inspector
  - Check emulator/device and APK are correct
  - Ensure element exists on the screen
  - Increase `waitForAmount()` timeout if needed

**"A dynamic import callback was invoked without --experimental-vm-modules"**

- Cause: ESM/CJS incompatibility with WebdriverIO
- Fix: Use CommonJS (no `"type":"module"` in package.json) and compatible WebdriverIO version (already applied)

## Debugging Tips

- **Appium Logs**: Watch Appium server terminal for driver initialization and session creation errors
- **App Logs**: Use `adb logcat` to view native app crashes
- **UI Inspection**: Use Android Studio's Layout Inspector or Appium Desktop to inspect element selectors and attributes
- **Screenshots**: Check `artifacts/` for failure screenshots with timestamps

## Framework Enhancements

- ✅ Page Object Model — Encapsulates element access and actions
- ✅ Global Test Setup — Initializes Appium once per suite
- ✅ Test Hooks — Automatic app reset and failure screenshots
- ✅ Logging — Consistent logger across tests
- ⬜ Centralized test data — Next step
- ⬜ Parameterized tests — Data-driven testing
- ⬜ GitHub Actions CI/CD — Automated test runs
- ⬜ Multiple device capabilities — Device matrix testing

## Running Tests in CI/CD

Example GitHub Actions workflow:

```yaml
name: Appium Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: appium driver install uiautomator2
      - run: npx appium &
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: test-artifacts
          path: artifacts/
```

## Resources

- [Appium Documentation](https://appium.io/)
- [WebdriverIO API](https://webdriver.io/docs/api.html)
- [Jest Documentation](https://jestjs.io/)
- [Android Espresso Locator Strategies](https://developer.android.com/training/testing/espresso)
