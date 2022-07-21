const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
    ? '/cards-for-humanity/'
    : '/',
  transpileDependencies: true,
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "development") {
      config.devtool = "eval-source-map";
      config.output.devtoolModuleFilenameTemplate = (info) =>
        info.resourcePath.match(/\.vue$/) &&
          !info.identifier.match(/type=script/)
          ? `webpack-generated:///${info.resourcePath}?${info.hash}`
          : `webpack-yourCode:///${info.resourcePath}`;

      config.output.devtoolFallbackModuleFilenameTemplate =
        "webpack:///[resource-path]?[hash]";
    }
  },
});
