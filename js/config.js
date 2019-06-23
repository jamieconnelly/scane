const path = require('path')

const jsRootDir = path.resolve(__dirname) // You are here
const repoRootDir = path.resolve(jsRootDir, '../')
const buildDir = path.resolve(repoRootDir, 'src/scane/dj/static/build')
const templateDir = path.resolve(repoRootDir, 'src/scane/dj/templates')

module.exports = {
  jsRootDir,
  repoRootDir,
  buildDir,
  templateDir,
}
