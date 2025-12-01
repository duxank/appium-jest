// test-capabilities.cjs
const capabilities = {
  platformName: 'Android',
  'appium:deviceName': 'Android Emulator',
  'appium:platformVersion': '16',
  'appium:automationName': 'UiAutomator2',
  'appium:app': 'C:/Users/duxan/Desktop/test.apk',
  'appium:appWaitActivity': '*',
  'appium:autoGrantPermissions': true,
};

module.exports = { capabilities };
