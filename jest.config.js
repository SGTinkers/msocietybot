/* eslint-disable no-undef */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/jest.setup.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/src/testUtils/', 'src/migration/'],
  coverageThreshold: {
    global: {
      branches: 60,
      function: 80,
      lines: 80,
      statements: 80,
    },
  },
};
