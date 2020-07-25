const path = require("path");
const { WebpackPluginServe: Serve } = require("webpack-plugin-serve");
const HtmlPlugin = require("html-webpack-plugin");

const outputPath = path.resolve("./dist");
const nodeModules = path.resolve("./node_modules");

const dev = process.argv.includes("dev");

const options = {
  historyFallback: true,
  hmr: false,
  liveReload: true,
  port: 3000,
  static: [outputPath, nodeModules],
};

module.exports = {
  output: {
    filename: "main.js",
    path: outputPath,
    publicPath: "/",
    chunkFilename: "[name].[hash].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  entry: ["./src/main.js", "webpack-plugin-serve/client"],
  plugins: [
    new HtmlPlugin({
      template: "src/index.html",
    }),
    dev ? new Serve(options) : null,
  ].filter(Boolean),
  watch: dev,
  mode: dev ? "development" : "production",
};
