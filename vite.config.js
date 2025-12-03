import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["gsap", "gsap/SplitText", "gsap/ScrollTrigger"],
  },
  build: {
    // Optimize chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable source maps for debugging (can disable later)
    sourcemap: true,
  },
  // Performance optimizations
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  },
})
