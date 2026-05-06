import { defineConfig, transformWithOxc } from 'vite'
import react from '@vitejs/plugin-react-oxc'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: false,
  },
  plugins: [
    {
      name: 'treat-js-as-jsx',
      enforce: 'pre',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null
        return transformWithOxc(code, id, { lang: 'jsx' })
      },
    },
    react(),
  ],
  envPrefix: ['API_', 'RAZORPAY_'],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
})
