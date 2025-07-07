import { resolve, dirname } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = dirname(__filename);

export default defineConfig(({ command, mode }) => {
  const isProduction = command === 'build';
  
  return {
    plugins: [react()],
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    build: {
      sourcemap: true,
      outDir: resolve(__dirname, 'dist'),
      ...(isProduction && {
        lib: {
          entry: {
            index: resolve(__dirname, 'src/main.ts'),
          },
          formats: ['es', 'cjs'],
        },
        rollupOptions: {
          external: ['react', 'react-dom'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
            },
            assetFileNames: '[name][extname]',
            entryFileNames: '[name].js',
            chunkFileNames: '[name]-[hash].js',
          },
        },
      }),
    },
    publicDir: resolve(__dirname, 'static'),
    // Development server configuration
    server: {
      port: 3000,
      open: true,
    },
  };
}); 