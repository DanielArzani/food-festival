const path = require("path");
const webpack = require("webpack");

module.exports = {
  // For a basic configuration, we need to provide webpack with three properties: entry, output, and mode. The first thing we want to declare is the entry property. The entry point is the root of the bundle and the beginning of the dependency graph, so give it the relative path to the client's code. Add the following code inside the module.exports object you just created:
  entry: "./assets/js/script.js",
  // webpack will next take the entry point we have provided, bundle that code, and output that bundled code to a folder that we specify. It is common and best practice to put your bundled code into a folder named dist, which is short for distribution.
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.bundle.js",
  },
  // The final piece of our basic setup will provide the mode in which we want webpack to run. By default, webpack wants to run in production mode. In this mode, webpack will minify our code for us automatically, along with some other nice additions
  mode: "development",
  // Webpack doesn't natively recognize JQuery, this is too fix that
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
  ],
};
