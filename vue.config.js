const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/',
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      // 哪些文件自动引入，使用绝对路径
      // 需要是path.join来拼接完整路径
      patterns: [
        path.join(__dirname, './src/assets/styles/variables.less'),
        path.join(__dirname, './src/assets/styles/mixins.less')
      ]
    }
  },

  chainWebpack(config) {
    config.optimization.minimize(true)// 开启压缩js代码(默认true)
    config.optimization.splitChunks({ // 开启代码分割
      chunks: 'all'
    })
    // 生产模式下启用gzip压缩 需要配置nginx支持gzip
    if (process.env.NODE_ENV === 'production') {
      config.plugin('CompressionWebpackPlugin').use(CompressionWebpackPlugin, [
        {
          filename: '[path][base].gz',
          algorithm: 'gzip',
          test: /(\.js|\.css)$/,
          // 只处理大于xx字节 的文件，默认：0
          threshold: 10240,
          // 示例：一个1024b大小的文件，压缩后大小为768b，minRatio : 0.75
          minRatio: 0.8, // 默认: 0.8
          // 是否删除源文件，默认: false
          deleteOriginalAssets: false

        }
      ])
    }
  }

}
