import react from '@vitejs/plugin-react'
import { defineConfig, configDefaults } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: false,
    exclude: [...configDefaults.exclude, "e2e/**"],
  },
})
