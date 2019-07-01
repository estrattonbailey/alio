#! /usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')
const exit = require('exit')

const cwd = process.cwd()
const pkg = require('./package.json')
const alio = require('./index.js')
const log = require('./lib/logger.js')
const mergeConfig = require('./lib/mergeConfig.js')

const prog = require('commander')
  .version(pkg.version)
  .option('-o, --out <output>', '')
  .option('-c, --config <config>', '')
  .option('-r, --reload', 'enable live-reloading after changes: --reload (default: false)')

prog
  .command('watch [inputs...]')
  .action(inputs => {
    const compiler = alio(mergeConfig(inputs, prog))
    compiler.watch()
  })

prog
  .command('build [inputs...]')
  .action(inputs => {
    const compiler = alio(mergeConfig(inputs, prog))
    compiler.build()
  })

if (!process.argv.slice(2).length) {
  prog.outputHelp(txt => {
    console.log(txt)
    exit()
  })
} else {
  console.clear()
  log.hydrate({ silent: false })
  prog.parse(process.argv)
}
