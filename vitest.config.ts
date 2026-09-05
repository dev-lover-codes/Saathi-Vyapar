/**
 * vitest.config.ts
 * Vitest configuration for Saathi Vyapar unit tests.
 */

import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Use the global test APIs (describe, it, expect) without importing them
    globals: true,
    // Use jsdom for browser-like environment (useful for component tests)
    environment: 'node',
    // Include pattern for test files
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    // Exclude node_modules and Next.js build output
    exclude: ['node_modules', '.next'],
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/lib/**/*.ts'],
      exclude: ['src/**/*.test.ts'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
