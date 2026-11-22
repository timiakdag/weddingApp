// Vite runs PostCSS on every CSS file it finds a config for. CRA used to do this internally;
// Vite needs it spelled out. tailwindcss expands the @tailwind directives in index.css, and
// autoprefixer adds vendor prefixes based on the browserslist in package.json.
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
