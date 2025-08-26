/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",

  // Use the DOM-like environment
  testEnvironment: "jsdom",

  // ✅ Load jest-dom (put this file at src/setupTests.js)
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],

  // (Optional but recommended if you use JSX/ESM in tests)
  // Requires: npm i -D babel-jest
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },

  // (Optional) keep defaults for test file patterns
  // testMatch: ["**/__tests__/**/*.test.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
};

module.exports = config;
