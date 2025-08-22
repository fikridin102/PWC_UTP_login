module.exports = {
  default: {
    require: [
      'ts-node/register',
      'src/hooks/hooks.ts',
      'src/test/steps/*.ts',
    ],
    format: [
      'json:test-results/cucumber_report.json', // match reporter's folder
      './reporters/prometheus-reporter.ts',
      'progress'
    ],
    paths: ['src/test/features/**/*.feature'],
    publishQuiet: true,
  }
};
