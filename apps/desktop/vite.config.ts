import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './', // Ensure relative paths for Tauri


  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    fs: {
      allow: ['..']
    }
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, '../../src')
    }
  },
  envPrefix: ['VITE_', 'TAURI_'],
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  build: {
    target: process.env.TAURI_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        zen: path.resolve(__dirname, 'zen.html'),
      },
    },
    typescript: {
      ignoreBuildErrors: true
    }
  }
})
