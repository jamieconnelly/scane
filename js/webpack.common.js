const path = require('path')

const config = require('./config')

module.exports = {
  entry: `${config.jsRootDir}/src/index.tsx`,
  output: {
    filename: 'bundle.js',
    path: config.buildDir,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        exclude: [/node_modules/],
        test: /\.(j|t)sx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: true,
              cacheDirectory: true,
              configFile: path.resolve(__dirname, '.babelrc.js'),
            },
          },
        ],
      },
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      scane: path.resolve(__dirname, 'src/'),
    },
    extensions: ['.tsx', '.ts', '.js', '.scss'],
  },
}
