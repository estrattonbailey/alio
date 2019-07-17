module.exports = (options = {}) => (config, ctx) => {
  config.output.libraryTarget = 'commonjs'
  config.devtool = 'inline-cheap-module-source-map'
  config.optimization = {
    ...config.optimization,
    minimize: false
  }

  return config
}
