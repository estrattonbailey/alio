const path = require('path')
const clone = require('clone')
const exit = require('exit')
const webpack = require('webpack')
const match = require('matched')
const TerserPlugin = require('terser-webpack-plugin')

const log = require('./logger.js')
const resolveEntry = require('./resolveEntry.js')
const resolvePresets = require('./resolvePresets.js')

const cwd = process.cwd()

const baseConfig = {
  output: {
    filename: '[name].js'
  },
  mode: 'development',
  target: 'web',
  performance: { hints: false },
  devtool: 'eval-source-map',
  module: { rules: [] },
  resolve: {
    alias: {
      '@': process.cwd()
    }
  },
  plugins: []
}

module.exports = function createConfig (conf, watch) {
  const wc = clone(baseConfig)

  wc.entry = resolveEntry(conf.in)

  wc.output = Object.assign(
    wc.output,
    // accepts a string or webpack output object
    typeof conf.out === 'object' ? conf.out : {
      path: path.resolve(cwd, conf.out || '')
    }
  )
  // double check to make sure output is resolved correctly
  wc.output.path = path.resolve(cwd, wc.output.path)

  wc.resolve.alias = Object.assign(wc.resolve.alias, conf.alias || {})

  wc.plugins = wc.plugins.concat([
    new webpack.DefinePlugin(conf.env || {}),
    conf.banner && new webpack.BannerPlugin({
      banner: conf.banner,
      raw: true,
      entryOnly: true,
      exclude: /\.(sa|sc|c)ss$/
    })
  ].filter(Boolean))

  if (conf.presets) resolvePresets(conf.presets, { watch }, wc)

  if (!watch) {
    wc.mode = 'production'
    wc.devtool = 'nosources-source-map'
    wc.optimization = {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            mangle: false
          }
        })
      ]
    }
  }

  return [
    conf,
    wc
  ]
}
