/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    colors: {
      'blue': '#1fb6ff',
      'purple': '#7e5bef',
      'pink': '#ff49db',
      'orange': '#ff7849',
      'green': '#13ce66',
      'yellow': '#ffc82c',
      'gray-dark': '#273444',
      'gray': '#8492a6',
      'gray-light': '#d3dce6',
    },
  },
  plugins: [
    require('daisyui'),
    plugin(function ({ addBase, theme, addVariant }) {
      // addBase({
      //   h1: { fontSize: theme('fontSize.7xl') },
      //   h2: { fontSize: theme('fontSize.6xl') },
      //   h3: { fontSize: theme('fontSize.3xl') },
      //   h4: { fontSize: theme('fontSize.2xl') },
      //   h6: { fontSize: theme('fontSize.lg') },
      //   h5: { fontSize: theme('fontSize.base') },
      // });
      addVariant('hocus', ['&:hover', '&:focus']);
      addVariant('not-last', '&:not(:last-child)')
    }),
  ],
};
