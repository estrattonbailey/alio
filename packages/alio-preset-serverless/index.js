module.exports = (options = {}) => (config, ctx) => {
  config.output.libraryTarget = 'commonjs'
  config.devtool = 'inline-cheap-module-source-map'

  return config
}
