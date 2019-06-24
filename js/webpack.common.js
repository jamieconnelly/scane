const path = require('path')

const config = require('./config')

module.exports = {
  entry: `${config.jsRootDir}/src/index.tsx`,
  output: {
    filename: 'bundle.js',
    path: config.buildDir,
  },
  module: {
    rules: [
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      {
        exclude: [/node_modules/],
        test: /\.(j|t)sx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: true,
              cacheDirectory: true,
              configFile: path.resolve(config.jsRootDir, '.babelrc.js'),
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
    extensions: ['.tsx', '.ts', '.js', '.scss'],
  },
}
