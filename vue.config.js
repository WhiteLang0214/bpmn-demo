module.exports = {
  productionSourceMap: true,
  devServer: {},
  configureWebpack: {
    plugins: [
    ],
    output: {},
  },
  chainWebpack: config => {
    config.module
      .rule("bpmn")
      .test(/\.bpmn$/)
      .use("raw-loader")
      .loader("raw-loader")
      .end()
  }
}