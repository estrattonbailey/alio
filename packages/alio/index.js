const onExit = require('exit-hook')
const webpack = require('webpack')

const log = require('./lib/logger.js')
const mergeConfig = require('./lib/mergeConfig.js')
const formatStats = require('./lib/formatStats.js')
const createWatchConfigs = require('./lib/createWatchConfigs.js')

async function watch (confs) {
  const {
    configs,
    servers,
    sockets,
  } = await createWatchConfigs(confs, true);

  function closeServer () {
    for (const hash in Object.keys(servers)) {
      servers[hash].close()
      sockets[hash].close()
    }
  }

  const compiler = webpack(configs).watch({}, (e, stats) => {
    const formatted = formatStats(stats)

    formatted.map(stats => {
      if (sockets[stats.hash]) {
        sockets[stats.hash].emit('refresh')
      }
    })

    log.hydrate(state => ({
      stats: formatted
    }))()
  })

  onExit(() => {
    log.hydrate({
      closing: true
    })()
    closeServer()
  })

  return {
    close () {
      return new Promise(r => {
        compiler.close(() => {
          closeServer()
          r()
        })
      })
    }
  }
}

function build (confs) {
  const configs = confs
    .map(conf => mergeConfig(conf, false))

  return new Promise((res, rej) => {
    webpack(configs).run((e, stats) => {
      if (e) {
        rej(e)
        return
      }

      const formatted = formatStats(stats)

      log.hydrate({
        stats: formatted,
        done: true
      })()

      res(formatted)
    })
  })
}

module.exports = (confs, options = { silent: true }) => {
  confs = [].concat(confs)

  log.hydrate({ silent: options.silent })

  return {
    ...log,
    build () {
      log.hydrate({
        build: true
      })()
      return build(confs)
    },
    watch () {
      log.hydrate({
        watch: true
      })()
      return watch(confs)
    }
  }
}
