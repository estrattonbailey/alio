const path = require('path')
const test = require('ava')
const proxy = require('proxyquire')
const webpack = require('webpack');
const cwd = process.cwd()

const cWC = require('../lib/createWatchConfigs.js')

// basically tests mergeConfig, so no need to check those values
test('merges cli entrypoints', async t => {
  const res = await cWC([
    {
      in: 'foo.js',
      out: cwd,
    }
  ]);

  t.truthy(res.configs[0].entry.foo)
})

test('createWatchConfigs: banner option works', async t => {
  const res = await cWC([
    {
      in: 'foo.js',
      out: cwd,
      banner: 'hello',
    }
  ]);

  t.plan(1);

  for (const plugin of res.configs[0].plugins) {
    if (plugin instanceof webpack.BannerPlugin) {
      t.pass();
    }
  }
})

test('createWatchConfigs: reload option works', async t => {
  const res = await cWC([
    {
      in: 'foo.js',
      out: cwd,
      reload: true,
    }
  ]);

  for (const plugin of res.configs[0].plugins) {
    if (plugin instanceof webpack.BannerPlugin) {
      t.pass();
    }
  }

  t.truthy(res.servers['foo']);
  t.truthy(res.sockets['foo']);

  Object.keys(res.servers).forEach(key => {
    res.servers[key].close();
    res.sockets[key].close();
  });
})

test('createWatchConfigs: hash comes through', async t => {
  const res = await cWC([
    {
      in: ['foo.js', 'bar.js'],
      out: cwd,
      reload: true,
    }
  ]);

  t.truthy(res.servers['foo:bar']);

  Object.keys(res.servers).forEach(key => {
    res.servers[key].close();
    res.sockets[key].close();
  });
})
