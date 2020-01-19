const log = require('./logger.js')

// TODO write tests
module.exports = function formatStats (stats) {
  return [].concat(stats.stats || stats).map(stat => {
    const { startTime, endTime } = stat
    const json = stat.toJson({
      children: false,
      modules: false
    })

    const hasWarnings = stat.hasWarnings()
    const hasErrors = stat.hasErrors()

    /**
     * This handles all warnings and errors from the
     * webpack instance
     */
    log.hydrate({
      warning: hasWarnings ? json.warnings : [],
      error: hasErrors ? json.errors : []
    })()

    return {
      hash: Object.keys(json.entrypoints).join(':'),
      duration: (endTime - startTime) / 1000,
      assets: json.assets.map(({ name, size }) => {
        return {
          name,
          size: size / 1000
        }
      })
    }
  })
}
