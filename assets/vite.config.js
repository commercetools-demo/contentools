import { resolve, dirname } from 'path';
import { defineConfig } from 'vite';

const __dirname = dirname(__filename);

export default defineConfig({
  build: {
    lib: {
      entry: {
        'layout-cms': resolve(__dirname, 'src/main.ts'),
      },
      formats: ['es']
    },
    outDir: resolve(__dirname, 'public'),
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
      }
    }
  },
  publicDir: resolve(__dirname, 'static'),
  envPrefix: 'CTP_',
  server: {
    proxy: {
      '/service': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      }
    }
  }
});
