/** @type {import('next').NextConfig} */
const path = require("path");

const remotionPkgDir = path.dirname(require.resolve("remotion/package.json"));

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["remotion", "@remotion/player"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "remotion/no-react": path.join(remotionPkgDir, "dist/esm/no-react.mjs"),
    };
    return config;
  },
};

module.exports = nextConfig;
