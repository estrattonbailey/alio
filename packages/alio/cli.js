#! /usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')
const exit = require('exit')

const cwd = process.cwd()
const pkg = require('./package.json')
const alio = require('./index.js')
const mergeConfig = require('./lib/mergeConfig.js')

const { NODE_ENV } = process.env

const prog = require('commander')
  .version(pkg.version)
  .option('-o, --out <output>', '')
  .option('-c, --config <config>', '')
  .option('-r, --reload', 'enable live-reloading after changes: --reload (default: false)')

prog
  .command('watch [inputs...]')
  .action(inputs => {
    let config = {}
    try { config = require(path.join(cwd, prog.config || 'alio.config.js')) } catch (e) {}
    const compiler = alio(mergeConfig(inputs, prog, config), { silent: false })
    compiler.watch()
  })

prog
  .command('build [inputs...]')
  .action(inputs => {
    let config = {}
    try { config = require(path.join(cwd, prog.config || 'alio.config.js')) } catch (e) {}
    const compiler = alio(mergeConfig(inputs, prog, config), { silent: false })
    compiler.build()
  })

if (!process.argv.slice(2).length) {
  prog.outputHelp(txt => {
    console.log(txt)
    exit()
  })
} else {
  NODE_ENV !== 'testing' && console.clear()
  prog.parse(process.argv)
}

module.exports = prog
