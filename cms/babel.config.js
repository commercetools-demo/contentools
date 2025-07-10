/**
 * @type {import('@babel/core').TransformOptions}
 */
module.exports = {
  presets: [
    [
      '@commercetools-frontend/babel-preset-mc-app',
      {
        runtime: 'automatic',
        keepPropTypes: true,
      },
    ],
  ],
  plugins: [
    [
      'babel-plugin-css-modules-transform',
      {
        generateScopedName: '[name]__[local]___[hash:base64:5]',
        extensions: ['.css'],
      },
    ],
  ],
};
