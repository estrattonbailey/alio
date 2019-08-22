const path = require('path')
const cwd = process.cwd()
const log = require('./logger.js')

module.exports = function resolvePresets (presets, args, wc) {
  presets.map(p => {
    try {
      const preset = require(path.join(cwd, './node_modules', `@alio/preset-${p}`))
      preset()(wc, args)
    } catch (e) {
      log.hydrate({
        configError: [
          `cannot find '${p}' preset, please make sure it's installed`
        ]
      })()
    }
  })
}
