import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Never set `base: './'` — the prerendered pages live at nested paths like
  // /guides/<slug>/index.html and reuse the root template's asset tags, so the
  // hashed /assets/* URLs must stay root-absolute.
  ssr: {
    // Externalize node_modules for the SSR pass: only src/** gets bundled,
    // which keeps the extra build step small on the low-RAM production box.
    target: 'node',
  },
});
