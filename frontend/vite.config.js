import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Expose to network
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - split large dependencies
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer-motion': ['framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 600, // Adjust warning threshold
  },
})
