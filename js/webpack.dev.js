const config = require('./config')
const common = require('./webpack.common.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const merge = require('webpack-merge')
const path = require('path')

const getPlugins = () => {
  return [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: `${config.buildDir}/index.html`,
    }),
  ]
}

const getRules = () => {
  return [
    {
      test: /\.module\.s(a|c)ss$/,
      loader: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: true,
            localIdentName: '[name]__[local]___[hash:base64:5]',
            camelCase: true,
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        },
      ],
    },
    {
      test: /\.s(a|c)ss$/,
      exclude: /\.module.(s(a|c)ss)$/,
      loader: [
        'style-loader',
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        },
      ],
    },
  ]
}

module.exports = merge(common, {
  mode: 'development',
  plugins: getPlugins(),
  module: {
    rules: common.module.rules.concat(getRules()),
  },
  devServer: {
    hot: true,
    inline: true,
    port: 3001,
    contentBase: 'src',
  },
})
