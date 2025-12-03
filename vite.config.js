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
        manualChunks: {
          // Split Three.js and React Three Fiber into a separate chunk
          'three-vendor': [
            'three',
            '@react-three/fiber',
            '@react-three/drei',
            '@react-three/postprocessing'
          ],
          // Split GSAP into its own chunk
          'gsap-vendor': [
            'gsap',
            'gsap/SplitText',
            'gsap/ScrollTrigger'
          ],
          // Split React and React DOM
          'react-vendor': [
            'react',
            'react-dom',
            'react-router-dom'
          ]
        }
      }
    },
    // Increase chunk size warning limit to 1000kb
    chunkSizeWarningLimit: 1000
  }
})
