import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Register React and Tailwind CSS plugins
export default defineConfig({
  plugins: [react(), tailwindcss()],
})