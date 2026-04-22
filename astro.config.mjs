// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://mozule.co.jp',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()]
  }
});
