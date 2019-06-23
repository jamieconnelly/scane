const config = require('./config')
const common = require('./webpack.common.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const merge = require('webpack-merge')
const path = require('path')

const getPlugins = () => {
  return [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: `${config.templateDir}/index.html`,
    }),
  ]
}

const getRules = () => {
  return [
    {
      test: /\.module\.s(a|c)ss$/,
      loader: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            modules: true,
            localIdentName: '[name]__[local]___[hash:base64:5]',
            camelCase: true,
          },
        },
        {
          loader: 'sass-loader',
        },
      ],
    },
    {
      test: /\.s(a|c)ss$/,
      exclude: /\.module.(s(a|c)ss)$/,
      loader: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'sass-loader',
        },
      ],
    },
  ]
}

module.exports = merge(common, {
  plugins: getPlugins(),
  mode: 'production',
  module: {
    rules: common.module.rules.concat(getRules()),
  },
})
