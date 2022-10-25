/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const tailwindcss = require('tailwindcss');

module.exports = {
  plugins: [tailwindcss('./src/tailwind.config.js'), require('autoprefixer')],
};
