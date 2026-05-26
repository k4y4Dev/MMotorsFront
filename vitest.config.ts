import { defineConfig } from 'vitest/config';
 
export default defineConfig({
  test: {
    globals: true,
 
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],  // lcov requis par SonarCloud
      reportsDirectory: './coverage',
 
      // ✅ Seuil à 80 % — ng test retourne exit code 1 si non atteint → CI échoue
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
 
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/main.ts',
        '**/environments/**',
      ],
    },
  },
});
 