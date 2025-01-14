import { defineConfig , type UserConfig} from 'vite'
import type { InlineConfig } from 'vitest/node'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
  },
} as UserConfig & { test: InlineConfig })
