import {defineConfig} from 'vite';
import {svelte} from '@sveltejs/vite-plugin-svelte';
export default defineConfig({base:"/specimen-assets/",
 esbuild:{jsx:"automatic"},
 plugins:[svelte(),{name:'specimen-vendor-svg',enforce:'pre',resolveId(source,importer){if(source.endsWith('.svg')&&importer?.includes('/node_modules/'))return this.resolve(source+'?url',importer,{skipSelf:true})}}],
 build:{outDir:'dist/client/specimen-assets',emptyOutDir:true,target:'esnext',cssCodeSplit:true,rollupOptions:{onwarn(warning,warn){if(warning.code!=='MODULE_LEVEL_DIRECTIVE')warn(warning)},input:'src/specimens/runtime.js',output:{entryFileNames:'runtime.js',chunkFileNames:'[name]-[hash].js',assetFileNames:'[name]-[hash][extname]'}}}
});
