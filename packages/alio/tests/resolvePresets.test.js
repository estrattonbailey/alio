const path = require('path')
const test = require('ava')
const proxy = require('proxyquire')
const cwd = process.cwd()

test('breaks successfully', t => {
  const resolvePresets = proxy('../lib/resolvePresets.js', {
    './logger.js': {
      hydrate (data) {
        t.truthy(/serverless/.test(data.configError[0]))
        return () => {}
      }
    }
  })

  resolvePresets([ 'serverless' ], { watch: false }, {})
})
