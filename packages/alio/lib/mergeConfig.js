const path = require('path')
const match = require('matched')
const exit = require('exit')

const log = require('./logger.js')

const cwd = process.cwd()

module.exports = function mergeConfig (inputs, prog) {
  let config = {}

  try {
    config = require(path.join(cwd, prog.config || 'alio.config.js'))
  } catch (e) {
    log.hydrate({
      error: [ e.message || e ]
    })()

    exit()
  }

  const cli = inputs.length ? {
    in: inputs.reduce((entry, file) => {
      if (/\*+/g.test(file)) {
        const files = match.sync(path.join(cwd, file))

        files.map(file => {
          entry[path.basename(file, '.js')] = file
        })
      } else {
        entry[path.basename(file, '.js')] = file
      }

      return entry
    }, {}),
    out: prog.out || cwd,
    reload: prog.reload || false,
    presets: []
  } : {}

  const conf = Object.assign(cli, config)

  /**
   * assertions
   *
   * TODO ensure at least one entry
   */
  if (!conf.in || (typeof conf.in === 'object' && !Object.keys(conf.in).length)) {
    log.hydrate({
      error: [
        `config must contain at least one entry`
      ]
    })()

    exit()
  }

  return conf
}
