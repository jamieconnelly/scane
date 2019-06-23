const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

const jsRootDir = path.resolve(__dirname) // You are here
const repoRootDir = path.resolve(jsRootDir, '../')
const buildDir = path.resolve(repoRootDir, 'src/scane/dj/static/build')
const templateDir = path.resolve(repoRootDir, 'src/scane/dj/templates')

const isDevelopment = true

const getOutput = () => {
  return {
    filename: 'bundle.js',
    path: buildDir,
  }
}

const getPlugins = () => {
  return [
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].[hash].css',
      chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css',
    }),
  ]
}

const getRules = () => {
  return [
    { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
    // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
    { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
    {
      test: /\.module\.s(a|c)ss$/,
      loader: [
        isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            modules: true,
            localIdentName: '[name]__[local]___[hash:base64:5]',
            camelCase: true,
            sourceMap: isDevelopment,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: isDevelopment,
          },
        },
      ],
    },
    {
      test: /\.s(a|c)ss$/,
      exclude: /\.module.(s(a|c)ss)$/,
      loader: [
        isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            sourceMap: isDevelopment,
          },
        },
      ],
    },
  ]
}

module.exports = {
  entry: `${jsRootDir}/src/index.tsx`,
  output: getOutput(),
  plugins: getPlugins(),
  module: {
    rules: getRules(),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.scss'],
  },
  devServer: {
    hot: true,
    inline: true,
    port: 3001,
    contentBase: 'src',
  },
}
