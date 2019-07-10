const path = require('path')
const clone = require('clone')
const exit = require('exit')
const webpack = require('webpack')
const match = require('matched')

const log = require('./logger.js')

const cwd = process.cwd()

function hasGlob (input) {
  return [].concat(input).reduce((_, str) => {
    if (/\*+/g.test(str)) return true
    return _
  }, false)
}

const baseConfig = {
  output: {
    filename: '[name].js'
  },
  mode: 'development',
  target: 'web',
  performance: { hints: false },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [
                require.resolve('@babel/plugin-syntax-object-rest-spread'),
                // require.resolve('@babel/plugin-proposal-class-properties'),
                // require.resolve('fast-async')
              ],
              // presets: [
              //   require.resolve('@babel/preset-env'),
              //   require.resolve('@babel/preset-react')
              // ]
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      '@': process.cwd()
    }
  },
  plugins: []
}

module.exports = function createConfig (conf, watch) {
  const wc = clone(baseConfig)

  wc.entry = conf.in
  wc.output = Object.assign(
    wc.output,
    typeof conf.out === 'object' ? conf.out : {
      path: path.resolve(cwd, conf.out)
    }
  )

  wc.output.path = path.resolve(cwd, wc.output.path)

  if (/\*+/g.test(wc.entry)) {
    const files = match.sync(path.join(cwd, wc.entry))

    wc.entry = files.reduce((obj, file) => {
      obj[path.basename(file, '.js')] = file
      return obj
    }, {})
  } else if (typeof wc.entry === 'string') {
    wc.entry = {
      [path.basename(wc.entry, '.js')]: path.resolve(cwd, wc.entry)
    }
  } else if (typeof wc.entry === 'object') {
    wc.entry = Object.keys(wc.entry).reduce((entry, name) => {
      entry[name] = path.resolve(cwd, wc.entry[name])
      return entry
    }, {})
  }

  wc.resolve.alias = Object.assign(wc.resolve.alias, conf.alias || {})
  wc.plugins = wc.plugins.concat([
    new webpack.DefinePlugin(JSON.stringify(conf.env || {})),
    conf.banner && new webpack.BannerPlugin({
      banner: conf.banner,
      raw: true,
      entryOnly: true,
      exclude: /\.(sa|sc|c)ss$/
    })
  ].filter(Boolean))

  conf.presets.map(p => {
    try {
      const preset = require(path.join(cwd, './node_modules', `@alio/preset-${p}`))
      preset()(wc, { watch })
    } catch (e) {
      log.hydrate({
        configError: [
          `cannot find '${p}' preset, please make sure it's installed`
        ]
      })()
    }
  })

  return [
    conf,
    wc
  ]
}
