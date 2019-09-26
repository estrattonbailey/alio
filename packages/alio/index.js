const path = require('path')
const exit = require('exit')
const onExit = require('exit-hook')
const webpack = require('webpack')

const log = require('./lib/logger.js')
const mergeConfig = require('./lib/mergeConfig.js')
const formatStats = require('./lib/formatStats.js')
const clientReloader = require('./lib/clientReloader.js')

const cwd = process.cwd()

function watch (confs) {
  // TODO write tests for reloading
  let port = 4000
  const servers = {}
  const sockets = {}

  const configs = confs
    .map(conf => {
      if (conf.reload) {
        conf.__port = port++
        conf.banner = conf.banner || ''
        conf.banner += clientReloader(conf.__port)
      }

      return conf
    })
    .map(conf => mergeConfig(conf, true))
    .map(([ conf, wc ]) => {
      if (conf.modify) conf.modify(wc)
      return [ conf, wc ]
    })
    .map(([ conf, wc ]) => {
      const hash = Object.keys(wc.entry).join(':')

      if (conf.reload) {
        servers[hash] = require('http').createServer((req, res) => {
          res.writeHead(200, { 'Content-Type': 'text/plain' })
          res.write('socket running...')
          res.end()
        }).listen(conf.__port)

        sockets[hash] = require('socket.io')(servers[hash], {
          serveClient: false
        })
      }

      process.env.DEBUG && console.log(JSON.stringify(wc, null, '  '))

      return wc
    })

  const compiler = webpack(configs).watch({}, (e, stats) => {
    const formatted = formatStats(stats)

    formatted.map(stats => {
      const hash = stats.assets
        .filter(asset => /\.js$/.test(asset.name))
        .map(asset => path.basename(asset.name, '.js'))
        .join(':')

      if (sockets[hash]) {
        sockets[hash].emit('refresh')
      }
    })

    log.hydrate(state => ({
      stats: formatted
    }))()
  })

  function closeServer () {
    for (let hash in servers) {
      servers[hash].close()
      sockets[hash].close()
    }
  }

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
    .map(([ conf, wc ]) => {
      if (conf.modify) conf.modify(wc)
      return wc
    })

  return new Promise((res, rej) => {
    webpack(configs).run((e, stats) => {
      const { hash } = stats.stats[0]

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
