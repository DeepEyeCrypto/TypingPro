import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
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
            '@src': path.resolve(__dirname, '../../src'),
            'react/jsx-dev-runtime': path.resolve(__dirname, '../../node_modules/react/jsx-dev-runtime.js'),
            'react/jsx-runtime': path.resolve(__dirname, '../../node_modules/react/jsx-runtime.js'),
            'react': path.resolve(__dirname, '../../node_modules/react'),
            'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
        }
    },
    envPrefix: ['VITE_', 'TAURI_'],
    esbuild: {
        logOverride: { 'this-is-undefined-in-esm': 'silent' },
        drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
    build: {
        target: process.env.TAURI_PLATFORM === 'windows' ? 'chrome105' : 'safari14',
        minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
        sourcemap: !!process.env.TAURI_DEBUG,
        reportCompressedSize: false,
        chunkSizeWarningLimit: 2000,
        cssCodeSplit: false, // Emergency Fix: Disable CSS splitting to avoid preload errors in Tauri
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
                zen: path.resolve(__dirname, 'zen.html'),
            },
        },
        outDir: 'dist',
        emptyOutDir: true,
        typescript: {
            ignoreBuildErrors: true
        }
    }
});
//# sourceMappingURL=vite.config.js.map