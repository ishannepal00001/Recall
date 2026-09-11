import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['preact', 'preact/hooks', 'preact/compat', 'preact/jsx-runtime', '@preact/signals', '@schedule-x/calendar', '@schedule-x/react'],
  },
})
