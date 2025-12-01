// tests/sample.test.js
const { remote } = require('webdriverio');
const { capabilities } = require('../test-capabilities.cjs');

let driver;

beforeAll(async () => {
  driver = await remote({
    hostname: 'localhost',
    port: 4723,
    path: '/',
    capabilities: capabilities,
  });
});

afterAll(async () => {
  if (driver) await driver.deleteSession();
});

test('example test', async () => {
  // Wait for element to be present
  const el = await driver.$('id:editTextAmount');

  // Wait for element to be displayed with timeout
  await el.waitForDisplayed({ timeout: 5000 });

  // Set value and verify
  await el.setValue('100');
  const value = await el.getText();

  expect(value).toBeTruthy();
});
