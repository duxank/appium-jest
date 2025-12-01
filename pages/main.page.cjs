// pages/main.page.cjs
// Simplified MainPage: use only the `id:editTextAmount` locator
const AMOUNT = 'id:editTextAmount';

class MainPage {
  constructor(driver) {
    this.driver = driver;
  }

  async amountEl() {
    return await this.driver.$(AMOUNT);
  }

  async waitForAmount(timeout = 15000) {
    const el = await this.amountEl();
    await el.waitForDisplayed({ timeout });
    return el;
  }

  async setAmount(value) {
    const el = await this.waitForAmount();
    await el.clearValue();
    await el.setValue(value);
  }

  async getAmount() {
    const el = await this.amountEl();
    const text = await el.getText();
    if (text) return text;
    return (
      (await el.getAttribute('text')) || (await el.getAttribute('value')) || ''
    );
  }
}

module.exports = MainPage;
