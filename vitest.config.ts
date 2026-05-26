import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8', 
      reporter: ['text', 'lcov', 'html'], 
      reportsDirectory: './coverage',
      reportOnFailure: true,
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80
      }
    },
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/main.ts',            // bootstrap Angular, non testable
        '**/environments/**',
      ],
  },
});