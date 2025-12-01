module.exports = {
  testEnvironment: 'node',
  testTimeout: 300000, // mobile tests are slow
  verbose: true,
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterEnv: [
    '<rootDir>/tests/test-setup.cjs',
    '<rootDir>/tests/hooks.cjs',
  ],
  extensionsToTreatAsEsm: [],
};
