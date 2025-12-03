import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["gsap", "gsap/SplitText", "gsap/ScrollTrigger"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split Three.js and React Three Fiber into a separate chunk
          if (id.includes('three') || id.includes('@react-three')) {
            return 'three-vendor';
          }
          // Split GSAP into its own chunk
          if (id.includes('gsap')) {
            return 'gsap-vendor';
          }
          // Split React and React DOM
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
            return 'react-vendor';
          }
          // Split node_modules into separate chunks
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    // Optimize chunk size warning limit
    chunkSizeWarningLimit: 600,
    // Enable source maps only for debugging (disable in production for smaller builds)
    sourcemap: false,
    // Use esbuild minifier (default, more reliable than terser)
    minify: 'esbuild',
  },
  // Performance optimizations
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  },
})
