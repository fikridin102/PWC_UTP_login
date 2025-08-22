import { Given, When, Then } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import assert from 'assert';
import path from 'path';

// Path to storageState.json at project root
const storagePath = path.join(process.cwd(), 'storageState.json');

Given('Student access the URL given', async function () {
  this.browser = await chromium.launch({ headless: false });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
  await this.page.goto('https://oic-vbcs-dev-vb-frk0uwpiewks.builder.eu-frankfurt-1.ocp.oraclecloud.com/ic/builder/rt/UBooking/2.0/webApps/spacebookingapp-user/');
});

When('Student login based on their credentials', async function () {
  const { username, password } = this.credentials;

  await this.page.getByRole('textbox', { name: 'username@utp.edu.my' }).fill(username);
  await this.page.getByRole('button', { name: 'Next' }).click();
  await this.page.getByRole('textbox', { name: 'Enter the password for' }).fill(password);
  await this.page.getByRole('button', { name: 'Sign in' }).click();
  await this.page.getByRole('button', { name: 'Yes' }).click();

  // Wait for Shelves to appear
  await this.page.waitForSelector('text=Space Filter', { timeout: 90000});
});

Then('Student reached Ubooking Home Page', async function () {
  const visible = await this.page.isVisible('text=Space Filter');
  assert.strictEqual(visible, true, 'Not on main page after login');

  // Save session to Playwright_Cucumber_TS-main/storageState.json
  await this.context.storageState({ path: storagePath });

  await this.browser.close();
});
