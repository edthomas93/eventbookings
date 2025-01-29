import type { Config } from 'jest';

const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
  globalTeardown: '<rootDir>/tests/jest.teardown.ts',
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  maxConcurrency: 1,
  verbose: true,
};

export default config;
