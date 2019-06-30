const path = require('path')

const config = require('./config')

module.exports = {
  plugins: [
    [
      'relay',
      {
        schema: 'graphql.schema',
        artifactDirectory: path.resolve(config.jsRootDir, 'src/__generated__'),
      },
    ],
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-modules-commonjs',
  ],
  presets: ['@babel/preset-react'],
}
