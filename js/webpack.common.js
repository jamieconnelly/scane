const config = require('./config')

module.exports = {
  entry: `${config.jsRootDir}/src/index.tsx`,
  output: {
    filename: 'bundle.js',
    path: config.buildDir,
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.scss'],
  },
}
