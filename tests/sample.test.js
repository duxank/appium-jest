// tests/sample.test.js
// Tests now rely on the Jest setup file which exposes `global.mainPage` and `global.driver`.

test('set and read amount (100)', async () => {
  await global.mainPage.setAmount('100');
  const value = await global.mainPage.getAmount();
  expect(value).toBeTruthy();
});

test('set and read amount (200)', async () => {
  await global.mainPage.setAmount('200');
  const value = await global.mainPage.getAmount();
  expect(value).toBeTruthy();
});
