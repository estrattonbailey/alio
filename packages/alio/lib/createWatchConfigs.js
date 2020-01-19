const getPort = require('get-port');

const mergeConfig = require('./mergeConfig.js')
const clientReloader = require('./clientReloader.js')

module.exports = async function createWatchConfigs(confs, watch = false) {
  let configs = [];
  const servers = {}
  const sockets = {}

  for (const conf of confs) {
    let port;

    if (conf.reload) {
      port = conf.port || await getPort();
      conf.banner = conf.banner || ''
      conf.banner += clientReloader(port)
    }

    const config = mergeConfig(conf, true);

    if (conf.reload) {
      const hash = Object.keys(config.entry).join(':')

      servers[hash] = require('http').createServer((req, res) => {
        res.writeHead(200, { 'content-type': 'text/plain' })
        res.write('alio watch server running...')
        res.end()
      }).listen(port)

      sockets[hash] = require('socket.io')(servers[hash], {
        serveclient: false
      })
    }

    configs.push(config);
  }

  return {
    configs,
    servers,
    sockets,
  };
}
