// apps/chrome-extension/vite.config.js
import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import manifest from './manifest.json';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': {
      SITE_URL: JSON.stringify(process.env.SITE_URL || 'https://bore.ndao.computer'),
    },
  },
  server: {
    port: 5174,
    strictPort: true,
    hmr: {
      port: 5174,
      host: 'localhost',
    },
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:9999',
        changeOrigin: true,
      },
    },
  }
});
