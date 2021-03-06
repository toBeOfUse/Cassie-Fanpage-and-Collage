const webpackConfig = require("./webpack.config.js");
const webpack = require("webpack");
const webpacker = webpack(webpackConfig);
webpacker.watch(
  {
    aggregateTimeout: 300,
  },
  (err, stats) => {
    if (err || stats.hasErrors()) {
      console.log("webpack error");
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
      }
    }
    console.log(
      stats.toString({
        colors: true,
        chunks: false,
      })
    );
  }
);

const connect = require("connect");
const serveStatic = require("serve-static");
connect()
  .use(serveStatic(__dirname))
  .listen(8080, () => console.log("Server running on 8080..."));
