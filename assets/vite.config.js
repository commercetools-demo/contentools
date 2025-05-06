import { resolve, dirname } from 'path';
import { defineConfig } from 'vite';

const __dirname = dirname(__filename);

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  build: {
    sourcemap: true,
    lib: {
      entry: {
        index: resolve(__dirname, 'src/main.ts'),
      },
      formats: ['es'],
    },
    outDir: resolve(__dirname, 'dist'),
    rollupOptions: {
      output: {
        assetFileNames: '[name][extname]',
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
      },
    },
  },
  publicDir: resolve(__dirname, 'static'),
});
