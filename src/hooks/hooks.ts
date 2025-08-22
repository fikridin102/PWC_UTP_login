import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

setDefaultTimeout(60 * 1000);

export interface Credentials {
  username: string;
  password: string;
}

let credentialsList: Credentials[] = [];
let currentIndex = 0;

let browser: Browser;
let context: BrowserContext;
export let page: Page;

const storagePath = path.join(__dirname, '../storageState.json');

// --- Before hook ---
Before(async function () {
  if (!credentialsList.length) {
    const csvFile = path.join(__dirname, '../data/credentials.csv');
    const content = fs.readFileSync(csvFile, 'utf8');
    const parsed = Papa.parse(content, { header: true, skipEmptyLines: true });
    credentialsList = parsed.data.filter((row: any) => row.username && row.password) as Credentials[];
    if (!credentialsList.length) throw new Error('No valid credentials found!');
  }

  this.credentials = credentialsList[currentIndex];
  currentIndex = (currentIndex + 1) % credentialsList.length;

  browser = await chromium.launch({ headless: false });
  context = fs.existsSync(storagePath)
    ? await browser.newContext({ storageState: storagePath })
    : await browser.newContext();

  page = await context.newPage();
  this.page = page;
});

// --- After hook ---
After(async function (scenario) {
  if (scenario.result?.status === 'PASSED') {
    fs.mkdirSync(path.dirname(storagePath), { recursive: true });
    await context.storageState({ path: storagePath });
  }

  if (page && !page.isClosed()) await page.close();
  if (browser) await browser.close();
});
