import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
      '@css': resolve(import.meta.dirname, 'src/css'),
      '@js': resolve(import.meta.dirname, 'src/js'),
      '@assets': resolve(import.meta.dirname, 'src/assets'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        markets: resolve(import.meta.dirname, 'pages/markets.html'),
        agents: resolve(import.meta.dirname, 'pages/agents.html'),
        wallet: resolve(import.meta.dirname, 'pages/wallet.html'),
        banking: resolve(import.meta.dirname, 'pages/banking.html'),
        remittance: resolve(import.meta.dirname, 'pages/remittance.html'),
        settings: resolve(import.meta.dirname, 'pages/settings.html'),
        login: resolve(import.meta.dirname, 'pages/login.html'),
        register: resolve(import.meta.dirname, 'pages/register.html'),
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: true,
  },
});
