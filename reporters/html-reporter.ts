import fs from 'fs';
import path from 'path';
import reporter from 'multiple-cucumber-html-reporter';
import open from 'open';
import Papa from 'papaparse';

// --- Types ---
interface ReportConfig {
  navbarTitle?: string;
  projectName?: string;
}

// --- Paths ---
const projectRoot = path.resolve();
const jsonFile = path.join(projectRoot, 'src/test-results/cucumber-report.json');
const htmlDir = path.join(projectRoot, 'src/test-results/html-report');
const backupDir = path.join(projectRoot, 'src/test-results/log');
const csvFile = path.join(projectRoot, 'src/data/report_config.csv');

// --- Ensure directories exist ---
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
if (!fs.existsSync(htmlDir)) fs.mkdirSync(htmlDir, { recursive: true });

// --- Backup previous report ---
if (fs.existsSync(htmlDir)) {
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(
    2,
    '0'
  )}-${String(now.getSeconds()).padStart(2, '0')}`;

  const backupFile = path.join(backupDir, `cucumber-report-${timestamp}`);
  fs.renameSync(htmlDir, backupFile);
  console.log(`Previous report backed up to: ${backupFile}`);
}

// --- Default report titles ---
let navbarTitle = 'CucumberJS Report';
let projectName = 'playwright-cucumber-ts';

// --- Read CSV config if exists ---
if (fs.existsSync(csvFile)) {
  const csvContent = fs.readFileSync(csvFile, 'utf8');
  const parsed = Papa.parse<ReportConfig>(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.data.length > 0) {
    const config = parsed.data[0];
    navbarTitle = config?.navbarTitle || navbarTitle;
    projectName = config?.projectName || projectName;
  }
}

// --- Generate HTML report ---
reporter.generate({
  jsonDir: path.dirname(jsonFile),
  reportPath: htmlDir,
  displayDuration: true,
  pageTitle: navbarTitle,
  reportName: projectName,
  metadata: {
    browser: {
      name: 'chromium',
      version: 'latest',
    },
    device: 'Local Test Machine',
    platform: {
      name: process.platform,
      version: 'latest',
    },
  },
});

console.log(`Report generated at: ${htmlDir}/index.html`);

// --- Open report automatically ---
open(path.join(htmlDir, 'index.html'));
