#!/usr/bin/env node

const jsdom = require('jsdom')
const { JSDOM } = jsdom

const reduce = require('./lib/reduce')
const getstd = require('./lib/std')

const args = process.argv.slice(2)

function print(input) {
  const lines = [input].flat(2).map(e => e.split('\n').map(s => s.trim())).flat(2)
  for(let line of lines) {
    process.stdout.write(`${line}\n`)
  }
  return lines
}

void async function main() {
  const htmlCode = await getstd()
  let dom = new JSDOM(htmlCode)
  for(let i of args) {
    print(reduce(dom, i))
  }
}()
