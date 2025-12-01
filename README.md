# Appium + Jest Test Framework (project: appium-jest)

This repository contains a minimal Appium + WebdriverIO test setup running under Jest. It is designed for local Android testing with an emulator or device using the UiAutomator2 driver.

**What’s included**

- `package.json` — project scripts and dependencies (`jest`, `appium`, `webdriverio`).
- `appium.config.cjs` — minimal Appium server config (kept empty to avoid schema issues).
- `test-capabilities.cjs` — test-specific Appium capabilities used by tests.
- `tests/sample.test.js` — example Jest test using `webdriverio`'s `remote()` API.

**Key files**

- `appium.config.cjs` : Appium server configuration (kept minimal to avoid Appium schema errors). Do not place test capabilities here; Appium expects a strict config schema.
- `test-capabilities.cjs` : Test-run capabilities that are passed to `webdriverio` when creating a session.
- `tests/sample.test.js` : Example test showing session creation, waiting for an element, and interacting with it.

Prerequisites

- Node.js and npm installed.
- Android SDK and `adb` on PATH, or a connected Android device.
- An Android emulator or real device available (verify with `adb devices`).
- Appium installed (you can run Appium locally with `npx appium`).

Quick setup

1. Install project dependencies:

```powershell
cd C:\Users\duxan\appium-jest
npm install
```

2. Install the UiAutomator2 driver for Appium (only once):

```powershell
appium driver install uiautomator2
```

3. Start Appium server (in a separate terminal):

```powershell
npx appium
```

4. Start an Android emulator or connect a device, then verify it’s visible:

```powershell
adb devices
```

Run tests

```powershell
npm test
```

What the test does

- `tests/sample.test.js` uses `webdriverio`'s `remote()` to connect to Appium at `localhost:4723`.
- Capabilities come from `test-capabilities.cjs`. The test waits for the element with accessibility id `editTextAmount`, sets a value, and asserts a value exists.

Common issues & fixes

- "A dynamic import callback was invoked without --experimental-vm-modules":

  - Cause: incompatibility between ESM/CJS and certain WebdriverIO builds under Jest. Fixes applied here included using CommonJS modules (no `"type":"module"` in `package.json`) and a compatible `webdriverio` version.

- "Could not find a driver for automationName 'UiAutomator2'":

  - Cause: UiAutomator2 driver not installed in Appium.
  - Fix: run `appium driver install uiautomator2`.

- "Errors in config file ... ADDITIONAL PROPERTY must NOT have additional properties":

  - Cause: Appium validates `appium.config.*` against a strict schema. Do not put your test capabilities directly in `appium.config.cjs` unless following Appium server schema exactly. This repository keeps server config minimal and places capabilities in `test-capabilities.cjs`.

- "element wasn't found" / cannot call `setValue`:
  - Causes: app not launched, wrong selector, the element is in a different activity, or timing issues.
  - Fixes applied in this project:
    - Added `appium:appWaitActivity: '*'` to `test-capabilities.cjs` to wait for activities.
    - Added `await el.waitForDisplayed({ timeout: 5000 })` before calling `setValue`.
    - Ensure the emulator/device and APK are correct and the app contains the accessibility id `editTextAmount`.

Tips for debugging

- Verify Appium server logs when a session is requested — they often show driver selection and capability parsing errors.
- Use `adb logcat` for native app crashes or activity issues.
- Use a UI inspector (Android Studio's Layout Inspector or Appium Desktop Inspector) to confirm element selectors and accessibility ids.

Next improvements (suggested)

- Add Page Object pattern to structure element access and actions.
- Integrate into CI: start Appium as a service in a CI job or use a device cloud.
- Add multiple capability sets for device matrix testing.
- Add more tests and examples (login flows, navigation, assertions).

If you want, I can:

- Update `test-capabilities.cjs` with your app package/name/activity for faster startup.
- Add a sample `README` section with CI examples (GitHub Actions) to run Appium + tests.

---

If you'd like, I can now commit these changes, or add a CI job example. Let me know which next step you prefer.
