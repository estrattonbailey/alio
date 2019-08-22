const path = require('path')
const test = require('ava')
const proxy = require('proxyquire')
const cwd = process.cwd()

let config
let prog = {
  out: '/dist',
}

const mergeCli = proxy('../lib/mergeCli.js', {
  './logger.js': {
    hydrate: () => () => {},
  },
})

test('merges cli entrypoints', t => {
  const merged = mergeCli([
    './tests/mock/foo.js'
  ], prog, config)

  const c = merged[0]

  t.is(c.in.foo, path.join(cwd, './tests/mock/foo.js'))
})

test('merges globbed cli entrypoint', t => {
  const merged = mergeCli([
    './tests/mock/*.js'
  ], prog, config)

  const c = merged[0]

  t.is(c.in.foo, path.join(cwd, './tests/mock/foo.js'))
})

test('config overrides', t => {
  config = {
    in: './tests/mock/foo.js'
  }

  const merged = mergeCli([
    './tests/mock/*.js'
  ], prog, config)

  const c = merged[0]

  t.is(c.in.foo, path.join(cwd, './tests/mock/foo.js'))
  t.falsy(c.in.bar)
  t.falsy(c.in.baz)
})

test('config with entry object', t => {
  config = {
    in: {
      foo: './tests/mock/foo.js',
      bar: './tests/mock/bar.js',
    }
  }

  const merged = mergeCli(null, prog, config)

  const c = merged[0]

  t.is(c.in.foo, path.join(cwd, './tests/mock/foo.js'))
  t.is(c.in.bar, path.join(cwd, './tests/mock/bar.js'))
})

test('multi-config', t => {
  config = [
    {
      in: './tests/mock/foo.js'
    },
    {
      in: './tests/mock/bar.js'
    },
    {
      in: {
        baz: './tests/mock/baz.js'
      }
    }
  ]

  const merged = mergeCli(null, prog, config)

  t.is(merged[0].in.foo, path.join(cwd, './tests/mock/foo.js'))
  t.is(merged[1].in.bar, path.join(cwd, './tests/mock/bar.js'))
  t.is(merged[2].in.baz, path.join(cwd, './tests/mock/baz.js'))
})

test('config with array entry', t => {
  config = [
    {
      in: [
        './tests/mock/foo.js',
        './tests/mock/bar.js'
      ]
    },
    {
      in: {
        baz: './tests/mock/baz.js'
      }
    }
  ]

  const merged = mergeCli(null, prog, config)

  t.is(merged[0].in.foo, path.join(cwd, './tests/mock/foo.js'))
  t.is(merged[0].in.bar, path.join(cwd, './tests/mock/bar.js'))
  t.is(merged[1].in.baz, path.join(cwd, './tests/mock/baz.js'))
})
