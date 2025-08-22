import express from 'express';
import client from 'prom-client';
import fs from 'fs';

const app = express();
const register = new client.Registry();

client.collectDefaultMetrics({ register });

const totalTests = new client.Counter({
  name: 'total_tests',
  help: 'Total number of executed tests',
});
const passedTests = new client.Counter({
  name: 'passed_tests',
  help: 'Total number of passed tests',
});
const failedTests = new client.Counter({
  name: 'failed_tests',
  help: 'Total number of failed tests',
});

register.registerMetric(totalTests);
register.registerMetric(passedTests);
register.registerMetric(failedTests);

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const PORT = 9100;
app.listen(PORT, () => {
  console.log(`Prometheus metrics server running at http://localhost:${PORT}/metrics`);
});

// Export counters so post-processing script can use them
export { totalTests, passedTests, failedTests };
