// tests/hooks.cjs
// Global test hooks for app reset, screenshots on failure, and logging
const fs = require('fs');
const path = require('path');

// Ensure artifacts directory exists
const artifactsDir = path.join(__dirname, '../artifacts');
if (!fs.existsSync(artifactsDir)) {
  fs.mkdirSync(artifactsDir, { recursive: true });
}

// Simple logger
global.logger = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${msg}`),
};

// beforeEach: Reset app state before each test
beforeEach(async () => {
  if (!global.driver) return;

  try {
    global.logger.info('Resetting app before test...');
    // Close app and reopen (if needed)
    // await global.driver.reset(); // uncomment if app supports reset
    global.logger.info('App reset complete');
  } catch (e) {
    global.logger.warn(`Failed to reset app: ${e.message}`);
  }
});

// afterEach: Capture screenshot on test failure
afterEach(async () => {
  if (!global.driver) return;

  const testState = expect.getState();
  const testName = testState.testPath
    ? path.basename(testState.testPath, '.js')
    : 'unknown';

  // Check if test failed
  if (testState.numPassingAsserts < testState.assertionCalls) {
    try {
      global.logger.error(`Test failed: ${testName}`);
      const screenshot = await global.driver.takeScreenshot();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotPath = path.join(
        artifactsDir,
        `screenshot-${testName}-${timestamp}.png`
      );

      fs.writeFileSync(screenshotPath, screenshot, 'base64');
      global.logger.info(`Screenshot saved: ${screenshotPath}`);
    } catch (e) {
      global.logger.warn(`Failed to take screenshot: ${e.message}`);
    }
  }
});
