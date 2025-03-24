import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    svelte({
      preprocess: vitePreprocess(),
      compilerOptions: {
        dev: !process.env.PROD,
      },
    }),
  ],
  base: '/netflix-svelte/',
  build: {
    outDir: 'dist'
  }
});
