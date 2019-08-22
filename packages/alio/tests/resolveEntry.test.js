const path = require('path')
const test = require('ava')
const proxy = require('proxyquire').noPreserveCache()
const cwd = process.cwd()

const resolveEntry = require('../lib/resolveEntry.js')

test('string', t => {
  const entry = resolveEntry('./tests/mock/foo.js')

  t.is(entry.foo, path.join(cwd, './tests/mock/foo.js'))
})

test('array', t => {
  const entry = resolveEntry([
    './tests/mock/foo.js',
    './tests/mock/bar.js'
  ])

  t.is(entry.foo, path.join(cwd, './tests/mock/foo.js'))
  t.is(entry.bar, path.join(cwd, './tests/mock/bar.js'))
})

test('object', t => {
  const entry = resolveEntry({
    one: './tests/mock/foo.js',
    two: './tests/mock/bar.js'
  })

  t.is(entry.one, path.join(cwd, './tests/mock/foo.js'))
  t.is(entry.two, path.join(cwd, './tests/mock/bar.js'))
})

test('glob', t => {
  const entry = resolveEntry('./tests/mock/*.js')

  t.is(entry.foo, path.join(cwd, './tests/mock/foo.js'))
  t.is(entry.bar, path.join(cwd, './tests/mock/bar.js'))
  t.is(entry.baz, path.join(cwd, './tests/mock/baz.js'))
})

test('array with glob', t => {
  const entry = resolveEntry([
    './tests/mock/*.js',
    './tests/mock/baz.js'
  ])

  t.is(entry.foo, path.join(cwd, './tests/mock/foo.js'))
  t.is(entry.bar, path.join(cwd, './tests/mock/bar.js'))
  t.is(entry.baz, path.join(cwd, './tests/mock/baz.js'))
})
