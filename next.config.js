/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  webpack(config, { isServer }) {
    config.resolve.alias["vscode"] = require.resolve(
      "@codingame/monaco-languageclient/lib/vscode-compatibility"
    );
    config.resolve.alias["handlebars"] = require.resolve(
      "handlebars/dist/handlebars.js"
    );
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    });
    return config;
  },
};
