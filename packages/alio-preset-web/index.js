module.exports = (options = {}) => (config, ctx) => {
  config.module.rules.push({
    test: /\.(?:js|jsx)$/,
    exclude: /node_modules/,
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          presets: [
            [require.resolve('@babel/preset-env'), options.env || {
              targets: 'defaults'
            }]
          ]
        }
      }
    ]
  })

  return config
}
