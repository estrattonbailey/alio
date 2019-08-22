const path = require('path')
const test = require('ava')
const proxy = require('proxyquire').noPreserveCache()
const cwd = process.cwd()

function createProg (stubs = {}) {
  return proxy('../cli.js', {
    './index.js': () => {
      return {
        watch () {},
        build() {}
      }
    },
    ...stubs
  })
}

test('watch works', t => {
  t.plan(6)

  const prog = createProg({
    './lib/mergeCli.js': (inputs, prog, config) => {
      t.is(inputs[0], 'index.js')
      t.truthy(prog)
      t.is(config.in, './foo.js')
    }
  })

  prog.parse([
    '~node~',
    '~script~',
    'watch', 'index.js', '--config', './tests/alio.config-test.js'
  ])

  prog.parse([
    '~node~',
    '~script~',
    'build', 'index.js', '--config', './tests/alio.config-test.js'
  ])
})
