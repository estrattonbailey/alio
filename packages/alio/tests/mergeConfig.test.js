const path = require('path')
const test = require('ava')
const proxy = require('proxyquire').noPreserveCache()
const cwd = process.cwd()

function create (stubs = {}) {
  return proxy('../lib/mergeConfig.js', {
    ...stubs
  })
}

test('default config', t => {
  const mergeConfig = create()

  const [ conf, wc ] = mergeConfig({
    in: './test/mock/foo.js',
    out: './dist'
  }, false)

  t.is(wc.entry.foo, path.join(cwd, './test/mock/foo.js'))
  t.is(wc.output.path, path.join(cwd, './dist'))
  t.is(wc.mode, 'production')
  t.is(wc.resolve.alias['@'], cwd)
  t.truthy(wc.optimization)

  t.pass()
})

test('default watch config', t => {
  const mergeConfig = create()

  const [ conf, wc ] = mergeConfig({
    in: './test/mock/foo.js',
    out: './dist'
  }, true)

  t.is(wc.mode, 'development')
  t.falsy(wc.optimization)

  t.pass()
})
