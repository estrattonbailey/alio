const ExtractCSS = require('mini-css-extract-plugin')

module.exports = (options = {}) => (config, ctx) => {
  config.module.rules.push({
    test: /\.css$/,
    exclude: /node_modules/,
    use: [
      ExtractCSS.loader,
      require.resolve('css-loader'),
      require.resolve('postcss-loader'),
    ]
  })

  config.plugins.push(
    new ExtractCSS({
      filename: options.filename || '[name].css'
    })
  )

  return config
}
