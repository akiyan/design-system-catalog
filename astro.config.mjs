import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
export default defineConfig({
 site: 'https://design-system-catalog.akiyan.tokyo',
 output: 'static',
 devToolbar: {enabled:false},
 outDir: './dist/client',
 integrations: [react()],
 vite: {server:{allowedHosts:['terminal.local']}}
});
