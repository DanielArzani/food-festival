const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const WebpackPwaManifest = require("webpack-pwa-manifest");

module.exports = {
  // For a basic configuration, we need to provide webpack with three properties: entry, output, and mode. The first thing we want to declare is the entry property. The entry point is the root of the bundle and the beginning of the dependency graph, so give it the relative path to the client's code. Add the following code inside the module.exports object you just created:
  entry: {
    app: "./assets/js/script.js",
    events: "./assets/js/events.js",
    schedule: "./assets/js/schedule.js",
    tickets: "./assets/js/tickets.js",
  },
  // webpack will next take the entry point we have provided, bundle that code, and output that bundled code to a folder that we specify. It is common and best practice to put your bundled code into a folder named dist, which is short for distribution.
  output: {
    // The output bundle files will be written to the dist folder, and will eliminate any need for the main.bundle.js that we created previously. Go ahead and delete dist/main.bundle.js before we run the build step.
    // path: path.resolve(__dirname, "dist"),
    // The name of each attribute in the entry object will be used in place of [name] in each bundle.js file that is created. So, the bundle file for script.js will be app.bundle.js, the bundle file for events.js will be events.bundle.js, and so on, with each using the key name from each key-value pair in the object for [name].
    filename: "[name].bundle.js",
  },
  module: {
    // In the config object, we added an object to the rules array. This object will identify the type of files to pre-process using the test property to find a regular expression, or regex. In our case, we are trying to process any image file with the file extension of .jpg. We could expand this expression to also search for other image file extensions such as .png, .svg, or .gif.
    rules: [
      {
        // any string that ends with .jpg (case insensitive)
        test: /\.jpg$/i,
        // For loading images
        // If you think the image file names look like the results from a password generator, you're not alone. Thankfully, our loader has configurable options that we can designate in the webpack.config.js. For more options, look at the webpack documentation on file-loader (Links to an external site.). In this documentation, we can see there is an options object that can rename our files and change the output path. -> name(file)...
        use: [
          {
            // IMPORTANT Make sure we keep track of the loader dependencies and ensure that file-loader processes the images first so that image-webpack-loader can optimize the emitted files.
            // npm install -D file-loader
            loader: "file-loader",
            // The default behavior of file-loader is such that file will be treated as an ES5 module. As a result, paths to images might be formatted incorrectly. To prevent this we can add a key-value pair in our options object: esModule: false,
            options: {
              esModule: false,
              name(file) {
                return "[path][name].[ext]";
              },
              publicPath: function (url) {
                return url.replace("../", "/assets/");
              },
            },
          },
          // The last step will be to use a image optimizer loader, because file-loader only emitted our images without reducing the size. We can use a package from npm called image-webpack-loader to do that. Let's install this package in our root directory using the following command: npm install image-webpack-loader
          {
            loader: "image-webpack-loader",
          },
        ],
      },
    ],
  },
  // The final piece of our basic setup will provide the mode in which we want webpack to run. By default, webpack wants to run in production mode. In this mode, webpack will minify our code for us automatically, along with some other nice additions
  mode: "development",
  // Webpack doesn't natively recognize JQuery, this is too fix that
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
    new WebpackPwaManifest({
      name: "Food Event",
      short_name: "Foodies",
      description: "An app that allows you to view upcoming food events.",
      start_url: "../index.html",
      background_color: "#01579b",
      theme_color: "#ffffff",
      // These two properties—fingerprints and inject—were not present in our manifest.json. That is because they are both specific to the manifest plugin. Fingerprints tell webpack whether or not it should generate unique fingerprints so that each time a new manifest is generated, it looks like this: manifest.lhge325d.json. Because we do not want this feature, we set fingerprints to be false.
      // The inject property determines whether the link to the manifest.json is added to the HTML. Because we are not using fingerprints, we can also set inject to be false. We will hardcode the path to the manifest.json instead, just like we would in an application without webpack.
      fingerprints: false,
      inject: false,
      icons: [
        {
          src: path.resolve("assets/img/icons/icon-512x512.png"),
          sizes: [96, 128, 192, 256, 384, 512],
          destination: path.join("assets", "icons"),
        },
      ],
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static", // the report outputs to an HTML file in the dist folder
    }),
  ],
};
