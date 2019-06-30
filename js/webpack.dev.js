const config = require('./config')
const common = require('./webpack.common.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const merge = require('webpack-merge')
const path = require('path')

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: `${config.buildDir}/index.html`,
    }),
  ],
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    hot: true,
    inline: true,
    port: 3001,
    contentBase: 'src',
    historyApiFallback: true,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: [
      {
        context: ['/graphql'],
        target: 'http://localhost:8000',
        secure: false,
        changeOrigin: false,
      },
    ],
  },
})
