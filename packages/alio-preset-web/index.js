module.exports = (options = {}) => (config, ctx) => {
  config.module.rules.push({
    test: /\.(?:js|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    use: [
      require.resolve('babel-loader'),
    ],
  })

  return config
}
