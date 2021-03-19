const VueLoaderPlugin = require("vue-loader/lib/plugin");
const isDev = process.env["NODE_ENV"] != "production";
module.exports = {
  mode: isDev ? "development" : "production",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
  },
  devtool: isDev ? "inline-cheap-module-source-map" : false,
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.svg$/,
        use: ["vue-svg-loader"],
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
};
