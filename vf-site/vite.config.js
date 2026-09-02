import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'three-core'
          }
          if (id.includes('node_modules/@react-three')) {
            return 'three-fiber'
          }
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) {
            return 'animation-engine'
          }
        }
      }
    }
  }
})
