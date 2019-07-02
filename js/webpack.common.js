const autoprefixer = require('autoprefixer')
const path = require('path')
const config = require('./config')

const getSCSSLoaders = (options = { useCSSModules: false }) => {
  const loaders = [
    {
      loader: 'css-loader',
      options: {
        importLoaders: 2,
        url: true,
        ...(options.useCSSModules
          ? {
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            }
          : {}),
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        plugins: () => [autoprefixer],
      },
    },
    {
      loader: 'sass-loader',
    },
  ]
  loaders.unshift({ loader: 'style-loader' })
  return loaders
}

module.exports = {
  entry: `${config.jsRootDir}/src/index.tsx`,
  output: {
    filename: '[name].[hash].js',
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
      {
        test: /(pages|components)\/.*\.scss$/,
        use: getSCSSLoaders({ useCSSModules: true }),
      },
      {
        test: /(styles\/styles.scss)$/,
        use: getSCSSLoaders(),
      },
    ],
  },
  resolve: {
    alias: {
      scane: path.resolve(__dirname, 'src/'),
    },
    modules: [config.jsRootDir, path.join(config.jsRootDir, 'node_modules')],
    extensions: ['.tsx', '.ts', '.js'],
  },
}
