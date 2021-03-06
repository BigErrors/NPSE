const CompressionPlugin = require('compression-webpack-plugin')

module.exports = (() => {
  let option = {
    publicPath: '/',
    outputDir: './docker/dist',
    lintOnSave: true,
    runtimeCompiler: false,
    productionSourceMap: false,
    configureWebpack: {
      plugins: [
        // 构建过程中启用gzip压缩
        new CompressionPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: /\.js$|\.css$/,
          threshold: 10240,
          minRatio: 0.8
        })
      ]
    },
    devServer: {
      open: process.platform === 'darwin',
      host: '0.0.0.0',
      port: 8080,
      https: false,
      hotOnly: false,
      // 配置代理转发
      proxy: {
        '/System': {
          target: 'http://192.168.22.127:8056',
          changeOrigin: true
        }
      },
      before: app => {}
    }
  }
  option.devServer.proxy[`${process.env.LOCATION}`] = {
    target: process.env.TARGET,
    changeOrigin: true
  }
  return option
})()
