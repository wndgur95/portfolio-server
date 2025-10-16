import type { Config } from 'jest';

const config: Config = {
  testTimeout: 100000,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': '@swc/jest',
  },
  collectCoverageFrom: ['**/*.ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>/apps/', '<rootDir>/libs/'],
  moduleNameMapper: {
    '^@libs/dao(|/.*)$': '<rootDir>/libs/dao/src/$1',
    '^@libs/common(|/.*)$': '<rootDir>/libs/common/src/$1',
    '^@extension(|/.*)$': '<rootDir>/libs/common/src/extension/$1',
  },
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts', // 전역 폴리필 로드
  ],
  forceExit: true, // 강제 종료 허용
  detectOpenHandles: true, // 열린 핸들 감지
};

export default config;
