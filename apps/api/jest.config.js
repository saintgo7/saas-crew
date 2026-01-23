module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: [
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/src/**/*.test.ts',
  ],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.module.ts',
    '!src/main.ts',
    '!src/**/*.dto.ts',
    '!src/**/*.interface.ts',
    '!src/**/*.entity.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/test/**',
  ],
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  coverageThreshold: {
    // Tested service files should have high coverage
    './src/users/users.service.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/projects/projects.service.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/courses/courses.service.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/posts/posts.service.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/comments/comments.service.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/votes/votes.service.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/auth/auth.service.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/chapters/chapters.service.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/enrollments/enrollments.service.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/admin/admin.service.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  testTimeout: 10000,
  maxWorkers: '50%',
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
}
