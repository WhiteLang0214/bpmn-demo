console.log('build 环境变量:', process.env.NODE_ENV)
console.log('build 环境变量 NODE_ENV:', process.env.NODE_ENV)
console.log('build 环境变量 BASE_URL:', process.env.BASE_URL)
console.log('build 环境变量 VUE_APP_API_HOST:', process.env.VUE_APP_API_HOST)

const isDev = process.env.NODE_ENV.includes('development')
const path = require('path');
function resolvePath(dir) {
  return path.join(__dirname, '.', dir);
}

module.exports = {
  productionSourceMap: true,
  devServer: {},
  configureWebpack: {
    plugins: [],
    output: {
      chunkFilename: 'js/[name].[hash].js',
      filename: 'js/[name].[hash].js',
    },
    resolve: {
      alias: {
        '@': resolvePath('src')
      }
    },
  },
  chainWebpack: config => {
    if (isDev) {
      config.plugin('html').tap(args => {
        args[0].title = '应用标题'
        return args
      })
    }

    // 删除预加载
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')

    // config.plugin('prefetch').tap(options => {
    //   options[0].fileBlacklist = options[0].fileBlacklist || []
    //   options[0].fileBlacklist.push(/myasyncRoute(.)+?\.js$/)
    //   return options
    // })
    config.optimization.runtimeChunk("single");
    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        vendor: {
          name: 'chunk-vendor',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial' // only package third parties that are initially dependent
        },
        elementPlus: {
          name: 'chunk-elementPlus', // split elementUI into a single package
          priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
          test: /[\\/]node_modules[\\/]_?element-plus(.*)/ // in order to adapt to cnpm
        },
        commons: {
          name: 'chunk-commons',
          test: resolvePath('src/components'), // can customize your rules
          priority: 30,
          reuseExistingChunk: true
        }
      }
    });

    config.module
      .rule("bpmn")
      .test(/\.bpmn$/)
      .use("raw-loader")
      .loader("raw-loader")
      .end()
  }
}