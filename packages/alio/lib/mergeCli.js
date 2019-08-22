const path = require('path')
const match = require('matched')
const exit = require('exit')

const log = require('./logger.js')
const resolveEntry = require('./resolveEntry.js')

const cwd = process.cwd()

module.exports = function mergeCli (inputs, prog, config) {
  let merged = []

  if (config) {
    const configs = [].concat(config)

    merged = configs.map(config => {
      return {
        ...config,
        in: resolveEntry(config.in)
      }
    })
  } else {
    merged = [
      {
        in: resolveEntry(inputs),
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
