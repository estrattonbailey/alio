const path = require('path')
const match = require('matched')
const exit = require('exit')

const log = require('./logger.js')

const cwd = process.cwd()

function getFiles (file) {
  if (/\*+/g.test(file)) {
    return match.sync(path.join(cwd, file))
  } else {
    return [ path.join(cwd, file) ]
  }
}

module.exports = function mergeConfig (inputs, prog, config) {
  let merged = []

  if (config) {
    const configs = [].concat(config)

    merged = configs.map(config => {
      const input = {}

      if (typeof config.in === 'object' && !Array.isArray(config.in)) {
        for (let name in config.in) {
          input[name] = path.join(cwd, config.in[name])
        }
      } else {
        const files = getFiles(config.in)

        files.map(f => {
          input[path.basename(f, '.js')] = f
        })
      }

      return {
        ...config,
        in: input,
      }
    })
  } else {
    const input = inputs.reduce((entry, file) => {
      const files = getFiles(file)

      files.map(f => {
        entry[path.basename(f, '.js')] = f
      })

      return entry
    }, {})

    merged = [
      {
        in: input,
        out: prog.out || cwd,
        reload: prog.reload || false,
        presets: []
      }
    ]
  }

  /**
   * assertions
   *
   * TODO ensure at least one entry
   */

  return merged
}
