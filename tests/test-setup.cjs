// tests/test-setup.cjs
// Initializes Appium session and exposes `driver` and `mainPage` on `global`.
const { remote } = require('webdriverio');
const { capabilities } = require('../test-capabilities.cjs');
const MainPage = require('../pages/main.page.cjs');

beforeAll(async () => {
  const driver = await remote({
    hostname: 'localhost',
    port: 4723,
    path: '/',
    capabilities,
  });
  const mainPage = new MainPage(driver);

  // Expose as globals for tests to use without constructing objects
  global.driver = driver;
  global.mainPage = mainPage;
});

afterAll(async () => {
  if (global.driver) {
    try {
      await global.driver.deleteSession();
    } catch (e) {
      // ignore teardown errors
    }
    global.driver = undefined;
    global.mainPage = undefined;
  }
});
