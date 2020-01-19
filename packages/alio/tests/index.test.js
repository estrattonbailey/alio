const path = require('path')
const test = require('ava')
const proxy = require('proxyquire').noPreserveCache()
const webpack = require('webpack')
const cwd = process.cwd()

function create (stubs = {}) {
  return proxy('../index.js', {
    './lib/logger.js': {
      hydrate: () => () => {}
    },
    ...stubs
  })
}

test('single base config', t => {
  const alio = create({
    'webpack': configs => {
      t.truthy(configs[0].entry.foo)

      return {
        run () {},
        watch () {},
      }
    }
  })

  alio({
    in: './test/mocks/foo.js',
    out: './dist'
  }).build()
})

test('multiple base configs', t => {
  const alio = create({
    'webpack': configs => {
      t.truthy(configs[0].entry.foo)
      t.truthy(configs[1].entry.bar)

      return {
        run () {},
        watch () {},
      }
    }
  })

  alio([
    {
      in: './test/mocks/foo.js',
      out: './dist'
    },
    {
      in: './test/mocks/bar.js',
      out: './dist'
    },
  ]).build()
})
