#!/usr/bin/env node

const DevTools = require('../')

const args = process.argv.slice(2)

function readStdin() {
  return new Promise((resolve, reject) => {
    let content = ''
    let chunk = ''
    process.stdin.setEncoding('utf8').on('readable', () => {
      while((chunk = process.stdin.read()) !== null) { content += chunk } })
      .on('end', () => resolve(content))
      .on('error', reject)
  })
}

function print(input) {
  const lines = [input].flat(2).map(e => e.split(/\r?\n/)).flat(2)
  for(let line of lines) {
    process.stdout.write(`${line}\n`)
  }
  return lines.join
}

void async function main() {
  const htmlCode = await readStdin()
  // Temporary solution to bypass error from parsing CSS @import
  let dom = new DevTools(htmlCode.replace(/@import/g, '&40;import'))

  for(let i of args) {
    print(dom.execute(i))
  }
}()
