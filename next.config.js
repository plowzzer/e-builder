const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  webpack(config) {
    // Garante que o node_modules do projeto seja o primeiro a ser consultado,
    // ignorando o package.json errado em /Users/plowzzer/
    config.resolve.modules = [
      path.join(__dirname, "node_modules"),
      "node_modules",
    ];
    return config;
  },
};

module.exports = nextConfig;
