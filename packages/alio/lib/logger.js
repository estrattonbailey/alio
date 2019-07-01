const path = require('path')
const evx = require('evx')
const log = require('log-update')
const c = require('ansi-colors')

const cwd = process.cwd()
const pkg = require('../package.json')

evx.on('*', ({
  silent = false,
  watch,
  done,
  closing,
  warning = [],
  error = [],
  internalError = [],
  configError = [],
  stats = []
}) => {
  if (silent) return

  const banner = `${c[error.length ? 'red' : 'blue'](' alio ')}v${pkg.version}`

  let msg = '\n ' + banner

  if (watch) {
    msg += '\n\n  watch'
  } else {
    msg += '\n\n  build'
  }

  if (internalError.length) {
    msg += '\n\n  ' + internalError.map(e => c.red('internal ') + (e.message || e)).join('\n  ')
  }

  if (configError.length) {
    msg += '\n\n  ' + configError.map(e => c.red('config ') + (e.message || e)).join('\n  ')
  }

  if (warning.length) {
    msg += '\n\n  ' + warning.map(e => c.yellow('compile ') + (e.message || e)).join('\n  ')
  }

  if (error.length) {
    msg += '\n\n  ' + error.map(e => c.red('compile ') + (e.message || e)).join('\n  ')

    msg += '\n'

    return log(msg)
  }

  if (stats) {
    msg += '\n\n  ' + stats.map(stats => {
      return [
        c.blue(stats.duration + 's')
      ].concat(
        stats.assets
          .filter(asset => !/\.map$/.test(asset.name))
          .map(asset => {
            return `  ${asset.name.padEnd(12)} ${c.gray(asset.size + 'kb')}`
          })
      ).join('\n  ')
      }).join('\n  ')
  }

  msg += '\n'

  log(msg)
})

module.exports = evx
