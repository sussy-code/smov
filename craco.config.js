const path = require(`path`);

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src/"),
      "@components": path.resolve(__dirname, "src/components"),
      "@scrapers": path.resolve(__dirname, "src/scrapers"),
    },
  },
};
