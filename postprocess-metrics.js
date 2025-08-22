import fs from 'fs';
import path from 'path';
import { totalTests, passedTests, failedTests } from './metrics-server.js';

const jsonFile = path.resolve('src/test-results/cucumber-report.json');

if (!fs.existsSync(jsonFile)) {
  console.error('Cucumber JSON report not found!');
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

// Count tests
report.forEach((feature) => {
  feature.elements?.forEach((scenario) => {
    totalTests.inc();
    const allPassed = scenario.steps?.every((s) => s.result?.status === 'passed');
    if (allPassed) {
      passedTests.inc();
    } else {
      failedTests.inc();
    }
  });
});

console.log('Prometheus metrics updated from JSON report.');
