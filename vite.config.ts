// vitest/config re-exports Vite's defineConfig with the `test` key typed,
// so one file configures both the dev server and the test runner.
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
  // Vitest loads this config with mode 'test'. Point env-file loading at a
  // directory with no .env there, so a developer's real .env can't flip the
  // hook tests out of fake mode — unit tests stay offline and deterministic.
  envDir: mode === 'test' ? path.resolve(__dirname, './src/test') : undefined,
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
}))
