import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'react-router-dom',
    '@commercetools-demo/puck-types',
    '@commercetools-demo/puck-api',
    '@commercetools-demo/puck-editor',
  ],
  // @measured/puck is bundled (not external) — same pattern as puck-editor
});
